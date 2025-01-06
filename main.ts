function onFormSubmit(formEvent: GoogleAppsScript.Events.FormsOnFormSubmit): void {
	var formResponse = formEvent.response;
	let reportDb = new ReportDb(formResponse);
	let reportInfo = new ReportInfo();
	let reportData =  new ReportData(formResponse, reportInfo);
	reportDb.setEditFlag();
  	if (reportDb.checkReportStatus(reportData) === false)
    	return ;
	let spreadsheetManager = reportData.createSpreadSheetManager(reportDb);
	fillReport(reportData, spreadsheetManager);
	SpreadsheetApp.flush();
	spreadsheetManager.exportSheetToPDF();
	sendReportViaEmail(reportData);
	reportDb.logResponse(reportData, spreadsheetManager);
  	if (ReportState.isEdit === false)
   	 	reportDb.removePendingService()
	if (ReportState.isEdit === true)
		return ;
	reportInfo.updateReportNumber(reportData.missionName, ReportTypes.RDO);
	reportInfo.updateReportInfo();
}

function  fillReport(reportData: ReportData, spreadsheetManager: SpreadsheetManager): void {
	var reportCellsRange = spreadsheetManager.getFirstSheet().getRange("A1:P82");
	ReportState.reportBuffer = reportCellsRange.getValues();
	var formulas = reportCellsRange.getFormulas();
	
	fillReportHeader(reportData);
	fillReportSubHeader(reportData);
	fillReportNightShift(reportData);
	fillReportFooter(reportData, spreadsheetManager);
	fillActivities(reportData);
	fillServicesFields(reportData);
	fillSignField(reportData, spreadsheetManager, ReportsRanges.RDO.CELLS.FOOTER.SIGNATURE, 100);
	var reportValuesResult = mergeValuesAndFormulas(formulas, ReportState.reportBuffer);
	reportCellsRange.setValues(reportValuesResult)
	reportCellsFit(spreadsheetManager.getFirstSheet())
	deleteEmptyServiceRows(spreadsheetManager.getFirstSheet(), reportData.numOfServices);
	setDotLineBorder(reportData, spreadsheetManager);
}

//#region TEST AND DEBUG

// function onFormSubmitDEBUG(formEvent: GoogleAppsScript.Events.FormsOnFormSubmit) {
// 	var formResponse = formEvent.response;
// 	let reportDb = new ReportDb.ReportDb(formResponse);
// 	let reportData = new ReportData.ReportData(formResponse);
// 	reportDb.setEditFlag();
//   // if (reportDb.checkReportStatus(reportData) === false)
//   //   return ;
// 	reportData.makeReportSpreadsheetFile(reportDb);
// 	fillReport(reportData);
// 	SpreadsheetApp.flush();

// 	reportData.exportSheetToPDF();
//   reportBlobs.push(reportData.reportBlob);
// 	// sendReportViaEmail(reportData);
// 	reportDb.logResponse(reportData);
//   // reportDb.removePendingService()
// 	// if (isEdit === true)
// 	// 	return ;
// 	// reportData.reportInfo.updateRDO(reportData.missionName);
// 	// reportData.reportInfo.updateReportInfo();
// }

