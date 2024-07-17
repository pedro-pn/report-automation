class ReportData {
	constructor(formResponse) {
		this.formResponse = formResponse;
		this.formResponsesDict = this.getFormResponsesAsDictionary()
		this.reportInfo = new ReportLib.ReportInfo();
		this.missionName = this.getMissionName();
		this.date = this.getReportDate();
		this.reportNum = this.getRDONumber();
		this.shiftTime = this.getShiftTime();
		this.numOfServices = 0;
		this.reportSpreadSheet;
		this.reportFirstSheet;
		this.reportSpreadSheetFile;
		this.reportParams = this.reportInfo.getParameters();
		this.reportBlob;
	}
	
	getRDONumber() {
		if (isEdit === false)
			return (this.reportInfo.getMissionInfo(this.missionName).RDO + 1);
		
	}

	getClient() {
		return (this.reportInfo.getMissionInfo(this.missionName).Client);
	}

	getLeaderInfos() {
		var leaderId = this.reportInfo.getMissionInfo(this.missionName).Leader;
		return (this.reportInfo.getLeaderInfo(leaderId));
	}

	getShiftTime() {
		var shiftTime = {
			weekdays: this.reportInfo.getMissionInfo(this.missionName).ShiftTime,
			weekend: this.reportInfo.getMissionInfo(this.missionName).WeekendShiftTime
		};

		return (shiftTime);
	}

	// Method not in use. May be delete later
	getServices() {
		const services = {
			First: this.searchFieldResponse(HeaderFields.AddService, 0),
			Second: this.searchFieldResponse(HeaderFields.AddService, 1),
			Third: this.searchFieldResponse(HeaderFields.AddService, 2),
			Fourth: this.searchFieldResponse(HeaderFields.AddService, 3),
			Fifth: this.searchFieldResponse(HeaderFields.AddService, 4),
			Sixth: this.searchFieldResponse(HeaderFields.AddService, 5),
		};
		return (services);
	}

	getCNPJ() {
		return (this.reportInfo.getMissionInfo(this.missionName).CNPJ);
	}

	getProposal() {
		return (this.reportInfo.getMissionInfo(this.missionName).Proposal);
	}

	getParameters() {
		return (this.reportInfo.getParametersInfo())
	}

	getWeekDayNum() {
		var dateStrings = this.date.split('-');
		var dateType = new Date(dateStrings[2], dateStrings[1] - 1, dateStrings[0]);
		var weekDay = dateType.getDay();
		
		return (weekDay);
	}

	getWeekDay() {
		let weekDay = this.getWeekDayNum();
		return (weekDays[weekDay]);
	}
	
	searchFieldResponse(fieldName, item=0) {
		var responses = [];
		this.formResponsesDict.forEach(responseDict => {
			for (let key in responseDict) {
				if (responseDict.hasOwnProperty(key)) {
          			if (key.trim() === fieldName) 
				        responses.push(responseDict[key]);
				}
      		}
		});
		return (responses[item]);
	}

	getReportDate() {
			var date = this.searchFieldResponse(HeaderFields.Date);
			var dateComponents = date.split("-");
			var day = dateComponents[2];
			var month = dateComponents[1];
			var year = dateComponents[0];
			if (year.substring(0, 2) === "00")
				year = `20${year.substring(2)}`;
		
			return (`${day}-${month}-${year}`);
	}
		
	getMissionName() {
		return (this.searchFieldResponse(HeaderFields.Mission));
	}

	openReportSpreadSheet() {
		if (isEdit)
			return ;
		this.reportSpreadSheet = SpreadsheetApp.open(this.reportSpreadSheetFile);
		this.reportFirstSheet = this.reportSpreadSheet.getSheets()[0];
	}

	getRdoFolder() {
		let reportsFolder = DriveApp.getFolderById(reportFolderID);
		try {
			let currentReportFolder = reportsFolder.getFoldersByName(this.searchFieldResponse(HeaderFields.Mission)).next();
			var recipientFolder = currentReportFolder.getFoldersByName("RDO").next();
		}
		catch {
			recipientFolder = DriveApp.getFolderById(reportStandardFolderID);
		}
	
		return (recipientFolder);
	}

	getFormResponsesAsDictionary() {
		var allResponses = [];
		this.formResponse.getItemResponses().forEach(function(itemResponse) {
		  var responseDict = {};
		  responseDict[itemResponse.getItem().getTitle()] = itemResponse.getResponse();
		  allResponses.push(responseDict);
		});
		return (allResponses);
	  }

	  exportSheetToPDF() {
		var token = ScriptApp.getOAuthToken();
		var reportSpreadsheetId = this.reportSpreadSheet.getId();
		var reportSheetId = this.reportFirstSheet.getSheetId();
		var urlRequest = getExportUrlRequest(reportSpreadsheetId, reportSheetId);
		try {
			var response = UrlFetchApp.fetch(urlRequest, {
			  headers: {
				'Authorization': 'Bearer ' + token
			  },
			  muteHttpExceptions: true
			});
	
		} catch (error) {
			Logger.log('Error: ' + error.toString());
		}
		var blob = response.getBlob().setName(`${this.reportSpreadSheet.getName()}.pdf`);
		this.reportBlob = blob;
		this.getRdoFolder().createFile(blob)
	}

	makeReportSpreadsheetFile(reportDb) {
		if (isEdit)
			this.updateReportSpreadsheetFile(reportDb);
		else
			this.createReportSpreadSheetFile();
	}

	createReportSpreadSheetFile() {
		var modelSpreadSheetFile = SpreadsheetApp.openById(greportModelID);
		var spreadSheetFileCopy = DriveApp.getFileById(modelSpreadSheetFile.getId()).makeCopy(this.getRdoFolder());
		spreadSheetFileCopy.setName(`${this.missionName} - RDO ${this.reportNum} - ${this.date} - ${this.getWeekDay()}`);
		this.reportSpreadSheetFile = spreadSheetFileCopy;
	}

	updateReportSpreadsheetFile(reportDb) {
		this.reportSpreadSheet = SpreadsheetApp.openById(reportDb.getReportSpreadsheetId());
		var oldReportFirstSheet = this.reportSpreadSheet.getSheets()[0];
		this.reportNum = oldReportFirstSheet.getRange(ReportHeaderCells.RdoNumber).getValue();
		var modelSheet = SpreadsheetApp.openById(greportModelID).getSheets()[0];

		this.reportFirstSheet = modelSheet.copyTo(this.reportSpreadSheet);
		this.reportSpreadSheet.deleteSheet(oldReportFirstSheet);
		this.reportFirstSheet.setName("RDO")

		var reportNameModel =  /(\d{2}-\d{2}-\d{4}) - ([a-zA-ZçÇ]+)/;
		var newReportName = this.reportSpreadSheet.getName().replace(reportNameModel, `${this.date} - ${this.getWeekDay()}`);
		this.reportSpreadSheet.rename(newReportName);

	}
}
