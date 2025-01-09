interface ReportInfoJSON {
	Missions: ReportInfoMission[];
	Leaders: ReportInfoLeaders[];
	Parameters: ReportInfoParameters;
	Manometers: ReportInfoManometers;
}

interface ReportInfoMission {
	Name: string;
	Client: string;
	CNPJ: string;
	Proposal: string;
	Leader: number;
	ClientLeader: string;
	ClientLeaderPosition: string;
	IncludeSaturday: boolean;
	IncludeSunday: boolean;
	ShiftTime: string;
	WeekendShiftTime: string;
	RDO: number;
	RTP: number;
	RLQ: number;
	RCP: number;
	RLR: number;
	RLI: number
}

interface ReportInfoLeaders {
	Id: number;
	Name: string;
	Email: string;
	Position: string;
	Ass: string
}

interface ReportInfoParameters {
	exportUrlRequest: string;
    EmailSubject: string;
    EmailBody: string;
    Recipient: string;
    Bcc: string;
}

interface ManometerEntry {
	pressureRange: string;
	referenceCode: string;
	startDate: string;
	endDate: string;
}

interface ReportInfoManometers {
	[key: string]: ManometerEntry;
}

class ReportInfo {
	reportInfoFile: GoogleAppsScript.Drive.File;
	reportInfoString: string;
	reportInfoData: ReportInfoJSON;
	constructor() {
		this.reportInfoFile = DriveApp.getFileById(ReportJSONIds.REPORT_INFO);
		this.reportInfoString = this.reportInfoFile.getBlob().getDataAsString();
		this.reportInfoData = JSON.parse(this.reportInfoString);
	}

	// This function MUST be called after using reportInfo.json. 
	updateReportInfo() {
		const updatedInfoData = JSON.stringify(this.reportInfoData, null, 2);
		this.reportInfoFile.setContent(updatedInfoData);
	}

	getMissionInfo(missionName: string): ReportInfoMission {
		return (this.reportInfoData.Missions.find(mission => mission.Name === missionName));
	}

	getLeaderInfo(leaderId: number): ReportInfoLeaders {
		return (this.reportInfoData.Leaders.find(leader => leader.Id === leaderId));
	}

	getParameters(): ReportInfoParameters {
		return (this.reportInfoData.Parameters);
	}

	getManometers(): ReportInfoManometers {
		return (this.reportInfoData.Manometers);
	}

	updateReportNumber(missionName: string, reportType: ReportTypes): void {
		this.getMissionInfo(missionName)[ReportTypes[reportType]] += 1;
	}

}

