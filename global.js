var reportBuffer;
var isEdit = false;
var newService = false;
var reportBlobs = [];
var reportType = 0;
var reportIds = "";
var serviceDb = {};
var debug = false;

function setValueToBuffer(cellString, content) {
	var cellNumbers = cellStringToNumber(cellString)
	reportBuffer[cellNumbers[0]][cellNumbers[1]] = content;
}

function getValueFromBuffer(cellString) {
	let columnLetter = cellString.charAt(0);
	let columnNumber = columnLetter.charCodeAt(0) - 65;
	let rowNumber = parseInt(cellString.substring(1)) - 1;
	let value = reportBuffer[rowNumber][columnNumber];

	return (value);
};

function setAllValuesToZero(obj) {
	Object.keys(obj).forEach(key => {
	  obj[key] = 0;
	});
}
