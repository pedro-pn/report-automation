function createReportSpreadSheetFile(reportData) {
	var modelSpreadSheetFile = SpreadsheetApp.openById(greportModelID);
	var spreadSheetFileCopy = DriveApp.getFileById(modelSpreadSheetFile.getId()).makeCopy(reportData.getRdoFolder());
	spreadSheetFileCopy.setName(`${reportData.missionName} - RDO ${reportData.rdo} - ${reportData.date} - ${reportData.getWeekDay()}`);
	return (spreadSheetFileCopy);
}
