var reportBuffer;
var isEdit = false;

var counters = {
	TP: 0,
	LQ: 0,
	FLU: 0,
	FIL: 0,
	PC1: 0,
	PC2: 0,
	LR: 0
}

function setValueToBuffer(cellString, content) {
	var columnLetter = cellString.charAt(0);
	var columnNumber = columnLetter.charCodeAt(0) - 65;
	var rowNumber = parseInt(cellString.substring(1)) - 1;
	reportBuffer[rowNumber][columnNumber] = content;
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
