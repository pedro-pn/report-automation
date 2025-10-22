function setDotLineBorder(reportData: ReportData, spreadsheetManager: SpreadsheetManager):void {
	var reportCells = [];
	for (var service = 1; service <= reportData.numOfServices; service++) {
		const respCells = ReportCells.RDO.SERVICES[service];
		const reportState = ReportState.getInstance();

		reportState.getValueFromBuffer(respCells.PARAM_ONE) ? reportCells.push(respCells.PARAM_ONE): false;
		reportState.getValueFromBuffer(respCells.PARAM_TWO) ? reportCells.push(respCells.PARAM_TWO): false;
		reportState.getValueFromBuffer(respCells.INFO) ? reportCells.push(respCells.INFO): false;
	}
	if (reportCells.length) {
		console.log(reportCells)
		spreadsheetManager.getWorkingSheet().getRangeList(reportCells).activate()
			.setBorder(null, null, true, null, null, null, '#000000', SpreadsheetApp.BorderStyle.DOTTED);

	}
}

function deleteEmptyServiceRows(reportFirstSheet: GoogleAppsScript.Spreadsheet.Sheet, servicesCount: number): void {
	if (servicesCount > 8)
		return ;
	var startRow = ReportCells.RDO.SERVICES_ROWS.FIRST_ROWS[servicesCount + 1]
	var endRow = ReportCells.RDO.SERVICES_ROWS.FIRST_ROWS.LAST_ROW - startRow + 1;
	reportFirstSheet.deleteRows(startRow, endRow);
}

function reportCellsFit(reportFirstSheet: GoogleAppsScript.Spreadsheet.Sheet): void {
	reportFirstSheet.autoResizeRows(6, 1);
	reportFirstSheet.autoResizeRows(10, reportFirstSheet.getLastRow());
}
