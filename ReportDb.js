var ReportDb = (function() {
    class ReportDb {
        constructor(formResponse) {
            this.reportDbFile = SpreadsheetApp.openById(spreadsheetDbId);
            this.reportDbSheet = this.reportDbFile.getSheets()[0];
            this.formResponseId = formResponse.getId();
        }

        setEditFlag() {
            var cellValues = this.reportDbSheet.getDataRange().getValues();

            for (var i = 1; i < cellValues.length; i++) {
                if (cellValues[i][0] === this.formResponseId) {
                  if (DriveApp.getFileById(cellValues[i][1]).isTrashed() === false)
                    isEdit = true;
                    break ;
                }
            }
        }

        getReportSpreadsheetId() {
            var cellValues= this.reportDbSheet.getDataRange().getValues();

            for (var i = 1; i < cellValues.length; i++) {
                if (cellValues[i][0] === this.formResponseId)
                    return (cellValues[i][1]);
            }
        }

        logResponse(reportSpreadsheetId) {
            var cellValues = this.reportDbSheet.getDataRange().getValues();

            for (var i = 1; i < cellValues.length; i++) {
                if (cellValues[i][0] === this.formResponseId) {
                    cellValues[i][1] = reportSpreadsheetId;
                    return ;
                }
            }
            this.reportDbSheet.appendRow([this.formResponseId, reportSpreadsheetId]);
        }
    }
    return ({ReportDb: ReportDb});
})();
