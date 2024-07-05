class ReportInfo {
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

	getMissionInfo(missionName) {
		return (this.reportInfoData.Missions.find(mission => mission.Name === missionName));
	}

	getLeaderInfo(leaderId) {
		return (this.reportInfoData.Leaders.find(leader => leader.Id === leaderId));
	}

	getParameters() {
		return (this.reportInfoData.Parameters);
	}

	updateRDO(missionName) {
		this.getMissionInfo(missionName).RDO += 1;
	}
}
