interface ReportData {
	formResponse: GoogleAppsScript.Forms.FormResponse,
	formResponsesDict: FormResponseDict;
	reportInfo: ReportInfo;
	missionName: string;
	date: string;
	reportNum: number;
	shiftTime: ShiftTime;
	numOfServices: number;
	reportSpreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
	reportFirstSheet: GoogleAppsScript.Spreadsheet.Sheet;
	reportSpreadSheetFile: GoogleAppsScript.Drive.File;
	reportParams: ReportInfoParameters;
	reportBlob: GoogleAppsScript.Base.Blob;
	getReportNumber;
	getRDONumber(): number;
	getRTPNumber(): number;
	getRLQNumber(): number;
	getRCPNumber(): number;
	getRLRNumber(): number;
	getRLINumber(): number;
	getClient(): string;
	getMissionInfos(): ReportInfoMission;
	getLeaderInfos(): ReportInfoLeaders;
	getManometer(name: string): ManometerEntry;
	getShiftTime(): ShiftTime;
	getCNPJ(): string;
	getProposal(): string;
	getParameters(): ReportInfoParameters;
	getWeekDayNum(): number;
	getWeekDay(): string;
	searchFieldResponse(fieldName: string, item?: number): fieldResponse
	getReportDate(): string;
	getMissionName(): string;
	openReportSpreadSheet(): void;
	getReportFolder(): GoogleAppsScript.Drive.Folder;
	getFormResponsesAsDictionary(): FormResponseDict;
	exportSheetToPDF(): void;
	makeReportSpreadsheetFile(reportDb, item?: number): void;
	createReportSpreadSheetFile(item: number);
	setReportName(item: number): void;
	getOldReportNum(reportSheet: GoogleAppsScript.Spreadsheet.Sheet): number;
	openExistingReportSpreadsheet(reportDb, item): boolean;
	updateReportSpreadsheetFile(reportDb, item: number): void;
}

interface ShiftTime {
	weekdays: string,
	weekend: string
}

type fieldResponse = string[][] | string[] | string;

var ReportData = (function() {
	class ReportData {
		formResponse: GoogleAppsScript.Forms.FormResponse;
		formResponsesDict: FormResponseDict;
		reportInfo: ReportInfo;
		missionName: string;
		date: string;
		reportNum: number;
		shiftTime: ShiftTime;
		numOfServices: number;
		reportSpreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
		reportFirstSheet: GoogleAppsScript.Spreadsheet.Sheet;
		reportSpreadSheetFile: GoogleAppsScript.Drive.File;
		reportParams: ReportInfoParameters;
		reportBlob: GoogleAppsScript.Base.Blob;
		constructor(formResponse: GoogleAppsScript.Forms.FormResponse) {
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

		getReportNumber(): number {
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
		
		getRDONumber(): number {
			return (this.reportInfo.getMissionInfo(this.missionName).RDO + 1);
		}

		getRTPNumber(): number {
			return (this.reportInfo.getMissionInfo(this.missionName).RTP + 1);
		}

		getRLQNumber(): number {
			return (this.reportInfo.getMissionInfo(this.missionName).RLQ + 1);
		}

		getRCPNumber(): number {
			return (this.reportInfo.getMissionInfo(this.missionName).RCP + 1)
		}

		getRLRNumber(): number {
			return (this.reportInfo.getMissionInfo(this.missionName).RLR + 1)
		}

		getRLINumber(): number {
			return (this.reportInfo.getMissionInfo(this.missionName).RLI + 1)
		}
		
		getClient(): string {
			return (this.reportInfo.getMissionInfo(this.missionName).Client);
		}

		getMissionInfos(): ReportInfoMission {
			return (this.reportInfo.getMissionInfo(this.missionName));
		}

		getLeaderInfos(): ReportInfoLeaders {
			var leaderId = this.reportInfo.getMissionInfo(this.missionName).Leader;
			return (this.reportInfo.getLeaderInfo(leaderId));
		}

		getManometer(name: string): ManometerEntry {
			return (this.reportInfo.getManometers()[name])
		}

		getShiftTime(): ShiftTime {
			var shiftTime = {
				weekdays: this.reportInfo.getMissionInfo(this.missionName).ShiftTime,
				weekend: this.reportInfo.getMissionInfo(this.missionName).WeekendShiftTime
			};

			return (shiftTime);
		}

		getCNPJ(): string {
			return (this.reportInfo.getMissionInfo(this.missionName).CNPJ);
		}

		getProposal(): string {
			return (this.reportInfo.getMissionInfo(this.missionName).Proposal);
		}

		getParameters(): ReportInfoParameters {
			return (this.reportInfo.getParameters())
		}

		getWeekDayNum(): number {
			var dateStrings = this.date.split('-');
			var dateType = new Date(Number(dateStrings[2]), Number(dateStrings[1]) - 1, Number(dateStrings[0]));
			var weekDay = dateType.getDay();
			
			return (weekDay);
		}

		getWeekDay(): string {
			let weekDay = this.getWeekDayNum();
			return (weekDays[weekDay]);
		}
		
    searchFieldResponse(fieldName: string, item: number = 0): fieldResponse {
      let responseField = this.formResponsesDict[item];
      if (responseField !== undefined)
        return (this.formResponsesDict[item][fieldName]);
      return (null)
    }

		getReportDate(): string {
				var date = this.searchFieldResponse(HeaderFields.Date);
				if (typeof date !== "string")
					return ("Invalid date");
				var dateComponents = date.split("-");
				var day = dateComponents[2];
				var month = dateComponents[1];
				var year = dateComponents[0];
				if (year.substring(0, 2) === "00")
					year = `20${year.substring(2)}`;
			
				return (`${day}-${month}-${year}`);
		}
			
		getMissionName(): string {
			return (this.searchFieldResponse(HeaderFields.Mission) as string);
		}

		openReportSpreadSheet(): void {
			this.reportSpreadSheet = SpreadsheetApp.open(this.reportSpreadSheetFile);
			this.reportFirstSheet = this.reportSpreadSheet.getSheets()[0];
		}

		getReportFolder(): GoogleAppsScript.Drive.Folder {
			let reportsFolder = DriveApp.getFolderById(reportFolderID);
			let folderName = Object.keys(ReportTypes)[reportType];
			try {
				let currentReportFolder = reportsFolder.getFoldersByName(this.searchFieldResponse(HeaderFields.Mission) as string).next();
				var recipientFolder = currentReportFolder.getFoldersByName(folderName).next();
			}
			catch {
				recipientFolder = DriveApp.getFolderById(reportStandardFolderID);
			}
		
			return (recipientFolder);
		}

		getFormResponsesAsDictionary(): FormResponseDict {
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

		exportSheetToPDF(): void {
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

		makeReportSpreadsheetFile(reportDb, item: number = 0): void {
			if (isEdit)
				this.updateReportSpreadsheetFile(reportDb, item);
			else
				this.createReportSpreadSheetFile(item);
		}

		createReportSpreadSheetFile(item: number = 0): void {
			var modelSpreadSheetFile = SpreadsheetApp.openById(ReportModelIds[reportType]);
			var spreadSheetFileCopy = DriveApp.getFileById(modelSpreadSheetFile.getId()).makeCopy(this.getReportFolder());
			this.reportSpreadSheetFile = spreadSheetFileCopy;
			this.setReportName(item);
      this.openReportSpreadSheet()
      if (reportType)
        newService = true;
		}

		setReportName(item: number = 0): void {
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

		getOldReportNum(reportSheet: GoogleAppsScript.Spreadsheet.Sheet): number {
			switch (reportType) {
				case ReportTypes.RDO:
					return (reportSheet.getRange(ReportHeaderCells.RdoNumber).getValue());
				default:
					return (reportSheet.getRange(ReportHeaderCells.ServiceNumber).getValue());
			}
		}

    	openExistingReportSpreadsheet(reportDb, item = 0): boolean {
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

		updateReportSpreadsheetFile(reportDb, item: number = 0): void { // generalize this function
			let openStatus = this.openExistingReportSpreadsheet(reportDb, item);
      if (openStatus === false)
        return ;
			var oldReportFirstSheet = this.reportSpreadSheet.getSheets()[0];
			this.reportNum = this.getOldReportNum(oldReportFirstSheet);
			var modelSheet = SpreadsheetApp.openById(ReportModelIds[reportType]).getSheets()[0];

			this.reportFirstSheet = modelSheet.copyTo(this.reportSpreadSheet);
			this.reportSpreadSheet.deleteSheet(oldReportFirstSheet);
			this.reportFirstSheet.setName(ReportTypes[reportType])
			
			if (reportType !== ReportTypes.RDO)
				return ;
			var reportNameModel =  /(\d{2}-\d{2}-\d{4}) - ([a-zA-ZçÇ]+)/;
			var newReportName = this.reportSpreadSheet.getName().replace(reportNameModel, `${this.date} - ${this.getWeekDay()}`);
			this.reportSpreadSheet.rename(newReportName);
		}
	}
	return ({ReportData: ReportData});
})();
