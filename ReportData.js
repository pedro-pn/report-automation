var ReportData = (function() {
	class ReportData {
		constructor(formResponse) {
			this.formResponse = formResponse;
			this.formResponsesDict = this.getFormResponsesAsDictionary()
			this.reportInfo = new ReportLib.ReportInfo();
			this.missionName = this.getMissionName();
			this.date = this.getReportDate();
			this.reportNum = this.getReportNumber();
			this.shiftTime = this.getShiftTime();
			this.numOfServices = 0;
			this.reportSpreadSheet;
			this.reportFirstSheet;
			this.reportSpreadSheetFile;
			this.reportParams = this.reportInfo.getParameters();
			this.reportBlob;
		}

		getReportNumber() {
			switch (reportType) {
				case ReportTypes.RDO:
					return (this.getRDONumber());
				case (ReportTypes.RTP):
					return (this.getRTPNumber());
				case (ReportTypes.RLQ):
					return (this.getRLQNumber());
				case (ReportTypes.RCP):
					return (this.getRCPNumber());
				case (ReportTypes.RLR):
					return (this.getRLRNumber());
				case (ReportTypes.RLI):
					return (this.getRLINumber());
			}
		}
		
		getRDONumber() {
			return (this.reportInfo.getMissionInfo(this.missionName).RDO + 1);
		}

		getRTPNumber() {
			return (this.reportInfo.getMissionInfo(this.missionName).RTP + 1);
		}

		getRLQNumber() {
			return (this.reportInfo.getMissionInfo(this.missionName).RLQ + 1);
		}

		getRCPNumber() {
			return (this.reportInfo.getMissionInfo(this.missionName).RCP + 1)
		}

		getRLRNumber() {
			return (this.reportInfo.getMissionInfo(this.missionName).RLR + 1)
		}

		getRLINumber() {
			return (this.reportInfo.getMissionInfo(this.missionName).RLI + 1)
		}
		
		getClient() {
			return (this.reportInfo.getMissionInfo(this.missionName).Client);
		}

		getMissionInfos() {
			return (this.reportInfo.getMissionInfo(this.missionName));
		}

		getLeaderInfos() {
			var leaderId = this.reportInfo.getMissionInfo(this.missionName).Leader;
			return (this.reportInfo.getLeaderInfo(leaderId));
		}

		getManometer(name) {
			return (this.reportInfo.getManometers()[name])
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
		
    searchFieldResponse(fieldName, item = 0) {
      let responseField = this.formResponsesDict[item];
      if (responseField !== undefined)
        return (this.formResponsesDict[item][fieldName]);
      return (null)
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

		getReportFolder() {
			let reportsFolder = DriveApp.getFolderById(reportFolderID);
			let folderName = Object.keys(ReportTypes)[reportType];
			try {
				let currentReportFolder = reportsFolder.getFoldersByName(this.searchFieldResponse(HeaderFields.Mission)).next();
				var recipientFolder = currentReportFolder.getFoldersByName(folderName).next();
			}
			catch {
				recipientFolder = DriveApp.getFolderById(reportStandardFolderID);
			}
		
			return (recipientFolder);
		}

		getFormResponsesAsDictionary() {
      var index = 0;
		  
			var allResponses = {};
			this.formResponse.getItemResponses().forEach( response => {
        let title = response.getItem().getTitle().trim();
        if (title === "Selecione o tipo de serviço que deseja adicionar informações")
          index++;
        else if (title === "Em caso de hora extra, indicar o responsável a mesma")
          index = 0;
        else if (title === "Atividades/Observações")
          index = 0;
        if (!(index in allResponses))
          allResponses[index] = {};
				allResponses[index][title] = response.getResponse();

			})
      // console.log(allResponses)
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
			this.getReportFolder().createFile(blob)
		}

		makeReportSpreadsheetFile(reportDb, item = 0) {
			if (isEdit)
				this.updateReportSpreadsheetFile(reportDb, item);
			else
				this.createReportSpreadSheetFile(item);
		}

		createReportSpreadSheetFile(item = 0) {
			var modelSpreadSheetFile = SpreadsheetApp.openById(ReportModelIds[reportType]);
			var spreadSheetFileCopy = DriveApp.getFileById(modelSpreadSheetFile.getId()).makeCopy(this.getReportFolder());
			this.reportSpreadSheetFile = spreadSheetFileCopy;
			this.setReportName(item);
      this.openReportSpreadSheet()
      if (reportType)
        newService = true;
		}

		setReportName(item = 0) {
			switch (reportType) {
				case ReportTypes.RDO:
					this.reportSpreadSheetFile.setName(`${this.missionName} - RDO ${this.reportNum} - ${this.date} - ${this.getWeekDay()}`);
					break ;
				case ReportTypes.RTP:
					this.reportSpreadSheetFile.setName(`${this.missionName} - RTP ${this.reportNum} - ${this.searchFieldResponse(FormServicesFields.Equipament, item)} - ${this.searchFieldResponse(FormServicesFields.System, item)}`);
					break ;
				case ReportTypes.RLQ:
					this.reportSpreadSheetFile.setName(`${this.missionName} - RLQ ${this.reportNum} - ${this.searchFieldResponse(FormServicesFields.Equipament, item)} - ${this.searchFieldResponse(FormServicesFields.System, item)}`);
					break ;
				case ReportTypes.RCP:
					this.reportSpreadSheetFile.setName(`${this.missionName} - RCP ${this.reportNum} - ${this.searchFieldResponse(FormServicesFields.Equipament, item)} - ${this.searchFieldResponse(FormServicesFields.System, item)}`);
					break ;
				case ReportTypes.RLR:
					this.reportSpreadSheetFile.setName(`${this.missionName} - RLR ${this.reportNum} - ${this.searchFieldResponse(FormServicesFields.Equipament, item)} - ${this.searchFieldResponse(FormServicesFields.System, item)}`);
					break ;
				case ReportTypes.RLI:
					this.reportSpreadSheetFile.setName(`${this.missionName} - RLI ${this.reportNum} - ${this.searchFieldResponse(FormServicesFields.Equipament, item)} - ${this.searchFieldResponse(FormServicesFields.System, item)}`);
					break ;
			}
		}

		getOldReportNum(reportSheet) {
			switch (reportType) {
				case ReportTypes.RDO:
					return (reportSheet.getRange(ReportHeaderCells.RdoNumber).getValue());
				default:
					return (reportSheet.getRange(ReportHeaderCells.ServiceNumber).getValue());
			}
		}

    openExistingReportSpreadsheet(reportDb, item = 0) {
      try {
        this.reportSpreadSheetFile = DriveApp.getFileById(reportDb.getReportSpreadsheetId(item));
      } catch {
        this.createReportSpreadSheetFile()
        return (false);
      }
      if (this.reportSpreadSheetFile.isTrashed()) {
        this.createReportSpreadSheetFile();
        return (false);
      }
      else
			  this.openReportSpreadSheet();
        return (true);
    }

		updateReportSpreadsheetFile(reportDb, item = 0) { // generalize this function
			let openStatus = this.openExistingReportSpreadsheet(reportDb, item);
      if (openStatus === false)
        return ;
			var oldReportFirstSheet = this.reportSpreadSheet.getSheets()[0];
			this.reportNum = this.getOldReportNum(oldReportFirstSheet);
			var modelSheet = SpreadsheetApp.openById(ReportModelIds[reportType]).getSheets()[0];

			this.reportFirstSheet = modelSheet.copyTo(this.reportSpreadSheet);
			this.reportSpreadSheet.deleteSheet(oldReportFirstSheet);
			this.reportFirstSheet.setName(ReportTypesString[reportType])
			
			if (reportType !== ReportTypes.RDO)
				return ;
			var reportNameModel =  /(\d{2}-\d{2}-\d{4}) - ([a-zA-ZçÇ]+)/;
			var newReportName = this.reportSpreadSheet.getName().replace(reportNameModel, `${this.date} - ${this.getWeekDay()}`);
			this.reportSpreadSheet.rename(newReportName);
		}
	}
	return ({ReportData: ReportData});
})();
