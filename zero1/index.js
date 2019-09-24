const fs = require('fs');

//remove spaces from a provided string

const removeSpaces = str => {
	str = str.replace(/ /g, '');
	return str;
};
/*tests
console.log(removeSpaces('  12 121 123   '));
*/

//check the length, return true if 3 or between 7-12
const lengthValidator = data => {
	const strippedLen = removeSpaces(data).length;
	return strippedLen == 3 || (strippedLen >= 7 && strippedLen <= 12);
};
/* Tests 
console.log(lengthValidator('121 243254'));
console.log(lengthValidator('12    '));
console.log(lengthValidator('12121343535    '));
console.log(lengthValidator('121   '));
console.log(lengthValidator(' 1212345   '));
*/
const plusValidator = data => {
	if (data[0] == '+' && data[1] == '0' && data[2] == '0') {
		return false;
	} else if (data[0] == '+' && data[1] == ' ') {
		return false;
	} else return true;
};
/*Tests
console.log(plusValidator('+00'));
console.log(plusValidator('+01'));
console.log(plusValidator('+10'));
console.log(plusValidator('00'));
console.log(plusValidator('+ 232'));
*/
const removePlusAndInitialZeroes = data => {
	if (data[0] == '0' && data[1] == '0') {
		data = data.substr(2);
	} else if (data[0] == '+') {
		data = data.substr(1);
	}
	return data;
};
/*Tests
console.log(removePlusAndInitialZeroes('+23232'));
console.log(removePlusAndInitialZeroes('0023232'));
*/

//check that the string doesn't contains any special char or alphabet.
const charValidator = data => {
	const re = new RegExp('[^\\d\\+]');
	return !re.test(removeSpaces(data));
};

/*Test
console.log(charValidator('232+'));
console.log(charValidator('23@1`#  2+'));
console.log(charValidator('23'));
console.log(charValidator('2321w'));
*/

const validationRules = [charValidator, plusValidator];
const checkAllRules = data => {
	validationRules.forEach(vtype => {
		if (vtype(data) == false) {
			console.log('failed for ' + vtype.name);
			return false;
		}
	});
	return true;
};

const formattedOutput = obj => {
	for (x in obj) {
		if (obj[x] != 0) {
			console.log(x + ':' + obj[x]);
		}
	}
};

// read numbers file and process it.
const readArgFile = () => {
	if (process.argv[2] == null || process.argv[2] == undefined || process.argv[2] == '') {
		console.log("Seems you didn't provide the required Numbers file as argument to script.");
	} else {
		fs.readFile(process.argv[2], 'utf8', (err, data) => {
			if (err) {
				console.log(err);
			} else {
				//iniitialize areacode object by reading from area code file
				let areaCode = {};
				fs.readFile('area_codes.txt', 'utf8', (aerr, adata) => {
					if (aerr) {
						console.log(aerr);
					} else {
						adata = adata.replace(/(\r\n|\n|\r)/gm, '\n');
						let acodes = adata.split('\n');
						acodes.forEach(element => {
							areaCode[element] = 0;
						});

						// Replace different types of line breaks to 1 type
						data = data.replace(/(\r\n|\n|\r)/gm, '\n');

						data = data.split('\n');
						//check validation rules
						data.forEach(element => {
							if (checkAllRules(element)) {
								let x = removeSpaces(element);
								x = removePlusAndInitialZeroes(x);
								if (lengthValidator(x)) {
									if (areaCode.hasOwnProperty(x.substr(0, 1))) {
										areaCode[x.substr(0, 1)] += 1;
									} else if (areaCode.hasOwnProperty(x.substr(0, 2))) {
										areaCode[x.substr(0, 2)] += 1;
									} else if (areaCode.hasOwnProperty(x.substr(0, 3))) {
										areaCode[x.substr(0, 3)] += 1;
									}
								}
							}
						});
						formattedOutput(areaCode);
					}
				});
			}
		});
	}
};
readArgFile();
