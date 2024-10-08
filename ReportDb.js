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

		logResponse(reportData) {
      var cellRange = this.reportDbSheet.getDataRange()
			var cellValues = cellRange.getValues();

			for (var i = 1; i < cellValues.length; i++) {
				if (cellValues[i][0] === this.formResponseId) {
					this.reportDbSheet.getRange(i + 1, 1, 1, 5).setValues([[this.formResponseId, `${reportData.reportSpreadSheet.getId()}${reportIds}`, reportData.missionName, reportData.reportNum, reportData.date]]) // setValue(reportData.reportSpreadSheet.getId() + reportIds);
					return ;
				}
			}
			this.reportDbSheet.appendRow([this.formResponseId, `${reportData.reportSpreadSheet.getId()}${reportIds}`, reportData.missionName, reportData.reportNum, reportData.date]);
      let lastRow = this.reportDbSheet.getLastRow();
      this.reportDbSheet.getRange(lastRow, 6).setFormula('=HYPERLINK("' + reportData.formResponse.getEditResponseUrl() + '"; "' + "Edit" + '")');
		}
	}

	return ({ReportDb: ReportDb});
})();
