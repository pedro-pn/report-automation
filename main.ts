function onFormSubmit(formEvent: GoogleAppsScript.Events.FormsOnFormSubmit): void {
	const formResponse = formEvent.response;
	const reportState = ReportState.getInstance();
	const reportDb = new ReportDb(formResponse, reportState);
	const reportInfo = new ReportInfo();
	const reportData =  new ReportData(formResponse, reportInfo, reportState);
	reportDb.setEditFlag();
  	if (reportDb.checkReportStatus(reportData) === false)
    	return ;
	const spreadsheetManager = reportData.createSpreadSheetManager(reportDb);
	if (reportState.getIsEdit() === true || reportState.getIsAppending() === true) // get report number of editing report
		reportData.reportNum = spreadsheetManager.getOldReportNumber();
	fillReport(reportData, spreadsheetManager);
	SpreadsheetApp.flush();
	spreadsheetManager.exportSheetToPDF();
	sendReportViaEmail(reportData, reportState);
	reportDb.logResponse(reportData, spreadsheetManager);
  	if (reportState.getIsEdit() === false)
   	 	reportDb.removePendingService()
	else if (reportState.getIsEdit() === true)
		return ;
	if (reportState.getIsAppending() === false)
		reportInfo.updateReportNumber(reportData.missionName, ReportTypes.RDO);
	reportInfo.updateReportInfo();
}

function  fillReport(reportData: ReportData, spreadsheetManager: SpreadsheetManager): void {
	var reportCellsRange = spreadsheetManager.getWorkingSheet().getRange("A1:P82");
	const reportState = ReportState.getInstance();
	reportState.setReportBuffer(reportCellsRange.getValues());
	var formulas = reportCellsRange.getFormulas();
	
	fillReportHeader(reportData);
	fillReportSubHeader(reportData);
	fillReportNightShift(reportData);
	fillReportFooter(reportData, spreadsheetManager);
	fillActivities(reportData);
	fillServicesFields(reportData);
	fillSignField(reportData, spreadsheetManager, ReportCells.RDO.FOOTER.SIGNATURE, 100);
	var reportValuesResult = mergeValuesAndFormulas(formulas, reportState.getReportBuffer());
	reportCellsRange.setValues(reportValuesResult)
	reportCellsFit(spreadsheetManager.getWorkingSheet())
	deleteEmptyServiceRows(spreadsheetManager.getWorkingSheet(), reportData.numOfServices);
	setDotLineBorder(reportData, spreadsheetManager);
	if (reportState.getIsAppending() === false)
		spreadsheetManager.spreadServices(reportData.numOfServices);
	else
		spreadsheetManager.appendServices(reportData.numOfServices);
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

