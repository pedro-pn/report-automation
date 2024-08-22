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

        getReportSpreadsheetId(item = 1) {
            var cellValues= this.reportDbSheet.getDataRange().getValues();

            for (var i = 1; i < cellValues.length; i++) {
                if (cellValues[i][0] === this.formResponseId) {
                  if (reportType === ReportTypes.RDO)
                    return (cellValues[i][reportType + 1]);
                  var reportIds = cellValues[i][reportType + 1].split(",");

                  return (reportIds[item - 1]);
                }
            }
        }

        logResponse(reportSpreadsheetId) {
            var cellValues = this.reportDbSheet.getDataRange().getValues();
            console.log(reportSpreadsheetId)
            for (var i = 1; i < cellValues.length; i++) {
                if (cellValues[i][0] === this.formResponseId) {
                    cellValues[i][reportType + 1] = reportSpreadsheetId;
                    return ;
                }
            }
            this.reportDbSheet.appendRow([this.formResponseId].concat(reportIds));
        }
    }

    return ({ReportDb: ReportDb});
})();
