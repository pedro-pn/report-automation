var ReportDb = (function() {
	class ReportDb {
		constructor(formResponse) {
			this.reportDbFile = SpreadsheetApp.openById(spreadsheetDbId);
			this.reportDbSheet = this.reportDbFile.getSheets()[0];
      this.pendingDbSheet = this.reportDbFile.getSheetByName("Pendentes")
			this.formResponseId = formResponse.getId();
      this.pendingIndex;
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

    isReportPending() {
      var pendingIdColumnRange = this.pendingDbSheet.getRange("A2:A");
      var pendingIdColumnValues = pendingIdColumnRange.getValues();

      for (this.pendingIndex = 0; this.pendingIndex < pendingIdColumnValues.length; this.pendingIndex++) {
        if (pendingIdColumnValues[this.pendingIndex][0] === this.formResponseId)
          return (true);
      }
      
      return (false);
    }

    checkReportStatus(reportData) {
      if (isEdit)
        return (true);
      if (this.isReportPending() === false) {
        this.addPendingService(reportData);
        return (false);
      }
      var pendingReportStatus = this.pendingDbSheet.getRange(this.pendingIndex + 2, 6).getValue();
      if (pendingReportStatus)
        return (true);
      return (false);
    }

    addPendingService(reportData) {
      const checkboxRule = SpreadsheetApp.newDataValidation()
      .requireCheckbox()
      .build();
      this.pendingDbSheet.appendRow([this.formResponseId, reportData.missionName, reportData.reportNum, reportData.date]);
      let lastRow = this.pendingDbSheet.getLastRow();
      this.pendingDbSheet.getRange(lastRow, 5).setFormula('=HYPERLINK("' + reportData.formResponse.getEditResponseUrl() + '"; "' + "Conferir" + '")');
      let statusCell = this.pendingDbSheet.getRange(lastRow, 6);
      statusCell.setDataValidation(checkboxRule);
    }

    removePendingService() {
      this.pendingDbSheet.deleteRow(this.pendingIndex + 2)
    }
	}

	return ({ReportDb: ReportDb});
})();
