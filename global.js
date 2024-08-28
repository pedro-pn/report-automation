var reportBuffer;
var isEdit = false;
var reportBlobs = [];
var reportType = 0;
var reportIds = "";

var counters = {
	TP: 0,
	LQ: 0,
	FLU: 0,
	FIL: 0,
	PC1: 0,
	PC2: 0,
	PCIMG: 0,
  	DHY: 0,
	DHY1: 0,
	DHY2: 0,
	DHYIMG: 0,
  	LSR: 0,
	LR: 0,
	VOL: 0,
  	OIL: 0
}

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
