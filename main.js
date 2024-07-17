function onFormSubmit(formEvent) {
	var formResponse = formEvent.response;
	let reportDb = new ReportDb.ReportDb(formResponse);
	reportDb.setEditFlag();
	let reportData = new ReportData(formResponse);
	reportData.makeReportSpreadsheetFile(reportDb);
	reportData.openReportSpreadSheet();
	fillReport(reportData);
	SpreadsheetApp.flush();

	reportData.exportSheetToPDF();
	sendReportViaEmail(reportData);
	if (isEdit === true)
		return ;
	reportData.reportInfo.updateRDO(reportData.missionName);
	reportData.reportInfo.updateReportInfo();
	reportDb.logResponse(reportData.reportSpreadSheet.getId());
	
}

function  fillReport(reportData) {
	var reportCellsRange = reportData.reportFirstSheet.getRange("A1:P68");
	reportBuffer = reportCellsRange.getValues();
	var formulas = reportCellsRange.getFormulas();
	
	fillReportHeader(reportData);
	fillReportSubHeader(reportData);
	fillReportNightShift(reportData);
	fillReportFooter(reportData);
	fillActivities(reportData);
	fillServicesFields(reportData);
	var reportValuesResult = mergeValuesAndFormulas(formulas, reportBuffer);
	reportCellsRange.setValues(reportValuesResult)
	reportCellsFit(reportData.reportFirstSheet)
	deleteEmptyServiceRows(reportData.reportFirstSheet, reportData.numOfServices);
	setDotLineBorder(reportData);
}
