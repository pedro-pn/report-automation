function exportSheetToPDF(reportData) {
	var spreadsheet = SpreadsheetApp.openById(reportData.reportSpreadSheetFile.getId());
	var sheet = spreadsheet.getSheets()[0]; // Change to spreadsheet.getSheetByName('SheetName') if you want a specific sheet
	var sheetId = sheet.getSheetId();
	
	// Define the export URL
	var url = 'https://docs.google.com/spreadsheets/d/' + spreadsheet.getId() + 
	'/export?format=pdf' + 
	'&size=A4' +        // Paper size
	'&portrait=true' +  // Orientation
	'&fitw=true' +      // Fit to width
	'&sheetnames=false&printtitle=false' + // Hide sheet names
	'&pagenumbers=false&gridlines=false' + // Hide page numbers and gridlines
	'&fzr=false' +      // Do not repeat frozen rows
	'&scale=4' +     // Fit to width
	'&gid=' + sheetId
	
	var token = ScriptApp.getOAuthToken();
	
	
	try {
		var response = UrlFetchApp.fetch(url, {
		  headers: {
			'Authorization': 'Bearer ' + token
		  },
		  muteHttpExceptions: true
		});

	} catch (error) {
		// Log the error message
		Logger.log('Error: ' + error.toString());
	  }
	
	var blob = response.getBlob().setName(`${spreadsheet.getName()}.pdf`);
	getRdoFolder(reportData).createFile(blob)
}

function createReportSpreadSheetFile(reportData) {
	var modelSpreadSheetFile = SpreadsheetApp.openById(greportModelID);
	var spreadSheetFileCopy = DriveApp.getFileById(modelSpreadSheetFile.getId()).makeCopy(getRdoFolder(reportData));
	spreadSheetFileCopy.setName(`${reportData.name} - RDO ${reportData.rdo} - ${reportData.date} - ${reportData.getWeekDay()}`);
	return (spreadSheetFileCopy);
}

function getRdoFolder(reportData) {
	let reportsFolder = DriveApp.getFolderById("1Fal8CBjtATle0l7MnhmP1LSJqUk7cB-9");
	try {
		let currentReportFolder = reportsFolder.getFoldersByName(reportData.searchFieldResponse(HeaderFields.Mission)).next();
		var recipientFolder = currentReportFolder.getFoldersByName("RDO").next();
	}
	catch {
		recipientFolder = "10Yoluq2U6o5sQS-YGSMNs83a6GnwRru5";
	}

	return (recipientFolder);
}
