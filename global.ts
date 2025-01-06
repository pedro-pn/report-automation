let ReportState = {
	reportBuffer: [],
	isEdit: false,
	reportBlobs: [],
	reportType: ReportTypes.RDO,
	reportIds: "",
	serviceDb: {},
	debug: false,
	newService: false,
	
	setValueToBuffer(cellString: string, content: any) {
		var cellNumbers = cellStringToNumber(cellString)
		ReportState.reportBuffer[cellNumbers[0]][cellNumbers[1]] = content;
	},

	getValueFromBuffer(cellString) {
		let columnLetter = cellString.charAt(0);
		let columnNumber = columnLetter.charCodeAt(0) - 65;
		let rowNumber = parseInt(cellString.substring(1)) - 1;
		let value = ReportState.reportBuffer[rowNumber][columnNumber];
	
		return (value);
	},
}

function setAllValuesToZero(obj) {
	Object.keys(obj).forEach(key => {
	  obj[key] = 0;
	});
}
