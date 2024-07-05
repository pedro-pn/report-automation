function onFormSubmit(formEvent) {
	var formResponse = formEvent.response;
	let reportData = new ReportData(formResponse);
	reportData.reportSpreadSheetFile = createReportSpreadSheetFile(reportData);
	reportData.openReportSpreadSheet();
	fillReport(reportData);
	SpreadsheetApp.flush();

	reportData.reportInfo.updateRDO(reportData.missionName);
	reportData.reportInfo.updateReportInfo();
	reportData.exportSheetToPDF();
	sendReportViaEmail(reportData);
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
