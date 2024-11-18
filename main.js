function onFormSubmit(formEvent) {
	var formResponse = formEvent.response;
	let reportDb = new ReportDb.ReportDb(formResponse);
	let reportData = new ReportData.ReportData(formResponse);
	reportDb.setEditFlag();
  if (reportDb.checkReportStatus(reportData) === false)
    return ;
	reportData.makeReportSpreadsheetFile(reportDb);
	fillReport(reportData);
	SpreadsheetApp.flush();

	reportData.exportSheetToPDF();
  reportBlobs.push(reportData.reportBlob);
	sendReportViaEmail(reportData);
	reportDb.logResponse(reportData);
  if (isEdit === false)
    reportDb.removePendingService()
	if (isEdit === true)
		return ;
	reportData.reportInfo.updateRDO(reportData.missionName);
	reportData.reportInfo.updateReportInfo();
}

function  fillReport(reportData) {
	var reportCellsRange = reportData.reportFirstSheet.getRange("A1:P82");
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

//#region TEST AND DEBUG

function onFormSubmitDEBUG(formEvent) {
	var formResponse = formEvent.response;
	let reportDb = new ReportDb.ReportDb(formResponse);
	let reportData = new ReportData.ReportData(formResponse);
	reportDb.setEditFlag();
  // if (reportDb.checkReportStatus(reportData) === false)
  //   return ;
	reportData.makeReportSpreadsheetFile(reportDb);
	fillReport(reportData);
	SpreadsheetApp.flush();

	reportData.exportSheetToPDF();
  reportBlobs.push(reportData.reportBlob);
	// sendReportViaEmail(reportData);
	reportDb.logResponse(reportData);
  // reportDb.removePendingService()
	// if (isEdit === true)
	// 	return ;
	// reportData.reportInfo.updateRDO(reportData.missionName);
	// reportData.reportInfo.updateReportInfo();
}

//#endregion
