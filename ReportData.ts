const reportTypeNameHandlers = {
    RDO: (data: ReportData) => `${data.missionName} - RDO ${data.reportNum} - ${data.date} - ${data.getWeekDay()}`,
	SERVICES: (data: ReportData, item: number) =>
        `${data.missionName} - ${ReportTypes[data.reportType]} ${data.reportNum} - ${data.searchFieldResponse(FormFields.SERVICES.COMMON.EQUIPAMENT, item)} - ${data.searchFieldResponse(FormFields.SERVICES.COMMON.SYSTEM, item)}`
};

type ShiftTime = {
	weekdays: string,
	weekend: string
}

class ReportData {
	public formResponsesDict: FormResponseDict;
	public missionName: string;
	public date: string;
	public reportNum: number;
	public shiftTime: ShiftTime;
	public numOfServices: number;
	public reportSpreadSheetFile: GoogleAppsScript.Drive.File
	public reportBlob: GoogleAppsScript.Base.Blob;
	public reportType: ReportTypes;

	constructor(
		private formResponse: GoogleAppsScript.Forms.FormResponse,
		private reportInfo: ReportInfo,
		private reportState: ReportState
	) {

		this.formResponse = formResponse;
		this.formResponsesDict = new FormResponseProcessor(this.formResponse).getResponsesAsDictionary();
		this.missionName = this.getMissionName();
		this.date = this.getReportDate();
		this.reportNum = this.getReportNumber(this.reportState.getReportType()) + 1;
		this.shiftTime = this.getShiftTime();
		this.numOfServices = 0;
		this.reportSpreadSheetFile;
	}

	getFormResponse(): GoogleAppsScript.Forms.FormResponse {
		return (this.formResponse);
	}

	getReportNumber(reportType: ReportTypes): number {
		return (this.reportInfo.getMissionInfo(this.missionName)[ReportTypes[reportType]])
	}
	
	getClient(): string {
		return (this.reportInfo.getMissionInfo(this.missionName).Client);
	}

	updateReportNumber(reportType: ReportTypes): void {
		this.reportInfo.updateReportNumber(this.missionName, reportType);
	}

	getMissionInfos(): ReportInfoMission {
		return (this.reportInfo.getMissionInfo(this.missionName));
	}

	getLeaderInfos(): ReportInfoLeaders {
		var leaderId = this.reportInfo.getMissionInfo(this.missionName).Leader;
		return (this.reportInfo.getLeaderInfo(leaderId));
	}

	getParameterInfos(): ReportInfoParameters {
		return (this.reportInfo.getParameters())
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

	getWeekDayNum(): number {
		var dateStrings = this.date.split('-');
		var dateType = new Date(Number(dateStrings[2]), Number(dateStrings[1]) - 1, Number(dateStrings[0]));
		var weekDay = dateType.getDay();
		
		return (weekDay);
	}
	
	getWeekDay(): string {
		let weekDay = this.getWeekDayNum();
		return (Weekdays[weekDay]);
	}

	getReportFolder(): GoogleAppsScript.Drive.Folder {
		let reportsFolder = DriveApp.getFolderById(ReportFolderIds.REPORT_FOLDER_ID);
		let folderName = ReportTypes[this.reportState.getReportType()];
		try {
			let currentReportFolder = reportsFolder.getFoldersByName(this.missionName).next();
			var recipientFolder = currentReportFolder.getFoldersByName(folderName).next();
		}
		catch {
			recipientFolder = DriveApp.getFolderById(ReportFolderIds.REPORT_STANDARD_FOLDER_ID);
		}
		return (recipientFolder);
	}
	
	createSpreadSheetManager(reportDb: ReportDb, item: number = 0): SpreadsheetManager {
		this.check5663();
		let modelId = SpreadsheetIds.MODEL_IDS[this.reportState.getReportType()];
		let name = this.reportState.getReportType() === ReportTypes.RDO ? reportTypeNameHandlers.RDO(this) : reportTypeNameHandlers.SERVICES(this, item);
		let folder = this.getReportFolder();
		if (this.reportState.getIsEdit() === false)
			return (new SpreadsheetManager(this.reportState, modelId, folder, name));
		let oldSpreadsheetId = reportDb.getReportSpreadsheetId(0);
		return (new SpreadsheetManager(this.reportState, oldSpreadsheetId, folder, null, this.date));
		
	}

	searchFieldResponse(fieldName: string, item: number = 0): fieldResponse {
		let responseField = this.formResponsesDict[item];
		if (responseField !== undefined)
		return (this.formResponsesDict[item][fieldName]);
		return (null)
	}

	getReportDate(): string {
		const date = this.searchFieldResponse(FormFields.HEADER.DATE) as string;
		return (parseDateString(date));
	}

	check5663() {
		if (this.missionName === "Missão 5663 - ArcelorMittal - Barra Mansa")
			SpreadsheetIds.MODEL_IDS[ReportTypes.RDO] = SpreadsheetIds5663[ReportTypes.RDO]
	}

	getResponseEditLink(): string {
		return (this.formResponse.getEditResponseUrl());
	}
		
	getMissionName(): string {
		return (this.searchFieldResponse(FormFields.HEADER.MISSION) as string);
	}

	setReportName(item: number = 0): void {
		const handler = reportTypeNameHandlers[ReportTypes[this.reportState.getReportType()]];
    	if (handler) {
        	const name = handler(this, item);
        	this.reportSpreadSheetFile.setName(name);
    	}
	}

	getReportInfoJsonString(): string {
		return (JSON.stringify(this.reportInfo.reportInfoData));
	}
}
