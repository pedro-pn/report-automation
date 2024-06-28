function setDotLineBorder(reportData) {
	var reportCells = [];
	for (var service = 1; service <= reportData.numOfServices; service++) {
		respCells = ReportServiceRespCells[service];

		getValueFromBuffer(respCells.ParamOne) ? reportCells.push(respCells.ParamOne): false;
		getValueFromBuffer(respCells.ParamTwo) ? reportCells.push(respCells.ParamTwo): false;
		getValueFromBuffer(respCells.Info) ? reportCells.push(respCells.Info): false;
	}
	if (reportCells.length)
		reportData.reportSpreadSheet.getRangeList(reportCells).activate()
			.setBorder(null, null, true, null, null, null, '#000000', SpreadsheetApp.BorderStyle.DOTTED);
}

function deleteEmptyServiceRows(reportFirstSheet, servicesCount) {
	if (servicesCount > 5)
		return ;
	var startRow = ServiceRows[servicesCount + 1]
	var endRow = ServiceRows.LastRow - startRow;
	reportFirstSheet.deleteRows(startRow, endRow);
}
