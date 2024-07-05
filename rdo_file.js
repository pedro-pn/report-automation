function createReportSpreadSheetFile(reportData) {
	var modelSpreadSheetFile = SpreadsheetApp.openById(greportModelID);
	var spreadSheetFileCopy = DriveApp.getFileById(modelSpreadSheetFile.getId()).makeCopy(getRdoFolder(reportData));
	spreadSheetFileCopy.setName(`${reportData.missionName} - RDO ${reportData.rdo} - ${reportData.date} - ${reportData.getWeekDay()}`);
	return (spreadSheetFileCopy);
}

function getRdoFolder(reportData) {
	let reportsFolder = DriveApp.getFolderById(reportFolderID);
	try {
		let currentReportFolder = reportsFolder.getFoldersByName(reportData.searchFieldResponse(HeaderFields.Mission)).next();
		var recipientFolder = currentReportFolder.getFoldersByName("RDO").next();
	}
	catch {
		recipientFolder = DriveApp.getFolderById(reportStandardFolderID);
	}

	return (recipientFolder);
}
