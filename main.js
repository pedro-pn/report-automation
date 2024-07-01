function onFormSubmit(formData) {
	var formObject = formData.response;
	let reportData = new ReportData(formObject);
	reportData.reportSpreadSheetFile = createReportSpreadSheetFile(reportData);
	reportData.openReportSpreadSheet();
	fillReport(reportData);
	SpreadsheetApp.flush();

	reportData.reportInfo.updateRDO(reportData.name);
	reportData.reportInfo.updateReportInfo();
	exportSheetToPDF(reportData);
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

// function moveFile(reportData) {
// 	var fileId = reportData.createReportSpreadSheetFile.getId();
// 	var file = DriveApp.getFileById(fileId);
// 	var folder = getRdoFolder(reportData)
// 	folder.moveTo(file);
// }
