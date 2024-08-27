var ReportDb = (function() {
	class ReportDb {
		constructor(formResponse) {
			this.reportDbFile = SpreadsheetApp.openById(spreadsheetDbId);
			this.reportDbSheet = this.reportDbFile.getSheets()[0];
			this.formResponseId = formResponse.getId();
		}

		setEditFlag() {
			var reportId = this.getReportSpreadsheetId(0);
			if (reportId == null)
			  return ;
			if (DriveApp.getFileById(reportId).isTrashed() === false)
			  isEdit = true;
		}

		getReportSpreadsheetId(item) {
			var cellValues= this.reportDbSheet.getDataRange().getValues();

			for (var i = 1; i < cellValues.length; i++) {
				if (cellValues[i][0] === this.formResponseId) {
					var reportIds = cellValues[i][1].split(",");
					return (reportIds[item]);
				}
			}

			return (null);
		}

		logResponse(reportSpreadsheetId) {
			var cellValues = this.reportDbSheet.getDataRange().getValues();

			for (var i = 1; i < cellValues.length; i++) {
				if (cellValues[i][0] === this.formResponseId) {
					cellValues[i][1] == this.formResponseId + reportIds;
					return ;
				}
			}
			this.reportDbSheet.appendRow([this.formResponseId, `${reportSpreadsheetId}${reportIds}`]);
		}
	}

	return ({ReportDb: ReportDb});
})();
