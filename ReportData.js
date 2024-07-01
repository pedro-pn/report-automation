class ReportData {
	constructor(formObject) {
		this.formObject = formObject;
		this.formResponses = this.getFormResponsesAsDictionary()
		this.reportInfo = new ReportInfo();
		this.name = this.getMissionName();
		this.date = this.getReportDate();
		this.rdo = this.getRDONumber() + 1;
		this.shiftTime = this.getShiftTime();
		this.numOfServices = 0;
		this.reportSpreadSheet;
		this.reportFirstSheet;
		this.reportSpreadSheetFile;
	}

	getRDONumber() {
		return (this.reportInfo.getMissionInfo(this.name).RDO);
	}

	getClient() {
		return (this.reportInfo.getMissionInfo(this.name).Client);
	}

	getShiftTime() {
		var shiftTime = {
			weekdays: this.reportInfo.getMissionInfo(this.name).ShiftTime,
			weekend: this.reportInfo.getMissionInfo(this.name).WeekendShiftTime
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
		return (this.reportInfo.getMissionInfo(this.name).CNPJ);
	}

	getProposal() {
		return (this.reportInfo.getMissionInfo(this.name).Proposal);
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
		this.formResponses.forEach(responseDict => {
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
		this.reportSpreadSheet = SpreadsheetApp.open(this.reportSpreadSheetFile);
		this.reportFirstSheet = this.reportSpreadSheet.getSheets()[0];
	}

	getFormResponsesAsDictionary() {
		var allResponses = [];
		this.formObject.getItemResponses().forEach(function(itemResponse) {
		  var responseDict = {};
		  responseDict[itemResponse.getItem().getTitle()] = itemResponse.getResponse();
		  allResponses.push(responseDict);
		});
		return (allResponses);
	  }
}
