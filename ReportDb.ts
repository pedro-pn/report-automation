type ReportDbData = {
  spreadsheetIds: string[],
  missionName: string,
  reportNumber: number;
  date: string;
}

class ReportDb {
  private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet;
  private finishedSheet: GoogleAppsScript.Spreadsheet.Sheet;
  private pendingSheet: GoogleAppsScript.Spreadsheet.Sheet;
  private formResponseId: string;
  private pendingIndex: number;
  reportDbData: ReportDbData | null;
  
  constructor(private formResponse: GoogleAppsScript.Forms.FormResponse) {
    this.spreadsheet = SpreadsheetApp.openById(SpreadsheetIds.DATABASE);
    this.finishedSheet = this.spreadsheet.getSheets()[0];
    this.pendingSheet = this.spreadsheet.getSheetByName("Pendentes")
    this.formResponseId = formResponse.getId();
    this.pendingIndex;
  }

  setEditFlag(): void {
    var reportId = this.getReportSpreadsheetId(0);
    if (reportId == null)
      return ;
    if (DriveApp.getFileById(reportId).isTrashed() === true)
      return ;
    this.getReportDbData();
    ReportState.isEdit = true;
  }

  getReportDbData(): void {
    let  cellValues = this.finishedSheet.getDataRange().getValues();
    for (var i = 1; i < cellValues.length; i++) {
      if (cellValues[i][0] === this.formResponseId) {
        this.reportDbData.spreadsheetIds = cellValues[i][1].split(",");
        this.reportDbData.date = cellValues[i][4];
        this.reportDbData.reportNumber  = cellValues[i][3];
      }
    }
  }

  getReportSpreadsheetId(item: number): string | null {
    var cellValues= this.finishedSheet.getDataRange().getValues();

    for (var i = 1; i < cellValues.length; i++) {
      if (cellValues[i][0] === this.formResponseId) {
        var reportIds = cellValues[i][1].split(",");
        return (reportIds[item]);
      }
    }

    return (null);
  }

  logResponse(reportData: ReportData, spreadsheetManager: SpreadsheetManager): void {
    var cellRange = this.finishedSheet.getDataRange()
    var cellValues = cellRange.getValues();

    for (var i = 1; i < cellValues.length; i++) {
      if (cellValues[i][0] === this.formResponseId) {
        this.finishedSheet.getRange(i + 1, 1, 1, 5).setValues([[this.formResponseId, `${spreadsheetManager.getSpreadsheetId()}${ReportState.reportIds}`, reportData.missionName, reportData.reportNum, reportData.date]]) // setValue(reportData.reportSpreadSheet.getId() + reportIds);
        return ;
      }
    }
    this.finishedSheet.appendRow([this.formResponseId, `${spreadsheetManager.getSpreadsheetId()}${ReportState.reportIds}`, reportData.missionName, reportData.reportNum, reportData.date]);
    let lastRow = this.finishedSheet.getLastRow();
    this.finishedSheet.getRange(lastRow, 6).setFormula('=HYPERLINK("' + this.formResponse.getEditResponseUrl() + '"; "' + "Edit" + '")');
  }

  isReportPending(): boolean {
    var pendingIdColumnRange = this.pendingSheet.getRange("A2:A");
    var pendingIdColumnValues = pendingIdColumnRange.getValues();

    for (this.pendingIndex = 0; this.pendingIndex < pendingIdColumnValues.length; this.pendingIndex++) {
      if (pendingIdColumnValues[this.pendingIndex][0] === this.formResponseId)
        return (true);
    }
    
    return (false);
  }

  checkReportStatus(reportData: ReportData): boolean {
    if (ReportState.isEdit)
      return (true);
    if (this.isReportPending() === false) {
      this.addPendingService(reportData);
      return (false);
    }
    var pendingReportStatus = this.pendingSheet.getRange(this.pendingIndex + 2, 6).getValue();
    if (pendingReportStatus)
      return (true);
    return (false);
  }

  addPendingService(reportData: ReportData): void {
    const checkboxRule = SpreadsheetApp.newDataValidation()
    .requireCheckbox()
    .build();
    this.pendingSheet.appendRow([this.formResponseId, reportData.missionName, reportData.reportNum, reportData.date]);
    let lastRow = this.pendingSheet.getLastRow();
    this.pendingSheet.getRange(lastRow, 5).setFormula('=HYPERLINK("' + this.formResponse.getEditResponseUrl() + '"; "' + "Conferir" + '")');
    let statusCell = this.pendingSheet.getRange(lastRow, 6);
    statusCell.setDataValidation(checkboxRule);
    let makeReportCell = this.pendingSheet.getRange(lastRow, 7);
    makeReportCell.setDataValidation(checkboxRule);
  }

  removePendingService() {
    this.pendingSheet.deleteRow(this.pendingIndex + 2)
  }
}
