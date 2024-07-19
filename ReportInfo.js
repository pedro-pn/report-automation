var ReportLib = (function() {
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

		updateReportNumber(missionName) {
			switch (reportType) {
				case reportTypes.RDO:
					this.updateRDO(missionName);
					break;
				case reportTypes.RTP:
					this.updateRTP(missionName);
					break ;
				case reportTypes.RLQ:
					this.updateRLQ(missionName);
					break ;
				case reportTypes.RCP:
					this.updateRCP(missionName);
					break ;
				case reportTypes.RLR:
					this.updateRLR(missionName);
					break ;
			};
		}

		updateRDO(missionName) {
			this.getMissionInfo(missionName).RDO += 1;
		}

		updateRTP(missionName) {
			this.getMissionInfo(missionName).RTP += 1;
		}

		updateRLQ(missionName) {
			this.getMissionInfo(missionName).RLQ += 1;
		}

		updateRCP(missionName) {
			this.getMissionInfo(missionName).RCP += 1;
		}

		updateRLR(missionName) {
			this.getMissionInfo(missionName).RLR += 1;
		}
	}
	return ({
		ReportInfo: ReportInfo
	});

})();
