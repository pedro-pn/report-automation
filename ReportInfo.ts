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

interface ReportInfo {
	reportInfoFile: GoogleAppsScript.Drive.File;
	reportInfoString: string;
	reportInfoData: ReportInfoJSON;
	getMissionInfo(missionName: string): ReportInfoMission;
	getLeaderInfo(leaderId: number): ReportInfoLeaders;
	getParameters(): ReportInfoParameters;
	getManometers(): ReportInfoManometers;
	updateReportInfo(): void;
	updateRDO(missionName: string): void
	updateRTP(missionName: string): void;
	updateRLQ(missionName: string): void;
	updateRCP(missionName: string): void;
	updateRLR(missionName: string): void;
	updateRLI(missionName: string): void;

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

var ReportLib = (function() {
	class ReportInfo {
		reportInfoFile: GoogleAppsScript.Drive.File;
		reportInfoString: string;
		reportInfoData: ReportInfoJSON;
		constructor() {
			this.reportInfoFile = DriveApp.getFileById(reportInfoID);
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

		updateRDO(missionName: string) {
			this.getMissionInfo(missionName).RDO += 1;
		}

		updateRTP(missionName: string) {
			this.getMissionInfo(missionName).RTP += 1;
		}

		updateRLQ(missionName: string) {
			this.getMissionInfo(missionName).RLQ += 1;
		}

		updateRCP(missionName: string) {
			this.getMissionInfo(missionName).RCP += 1;
		}

		updateRLR(missionName: string) {
			this.getMissionInfo(missionName).RLR += 1;
		}

		updateRLI(missionName: string) {
			this.getMissionInfo(missionName).RLI += 1;
		}
	}
	return ({
		ReportInfo: ReportInfo
	});

})();
