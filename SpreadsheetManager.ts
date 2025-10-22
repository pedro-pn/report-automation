/**
 * A utility class to handle spreadsheet operations for reports.
 */
class SpreadsheetManager {
    private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet | null = null;
    private firstSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null;
    private secondToLastSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null;
    private appendingSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null;
    private blob: GoogleAppsScript.Base.Blob;
    private oldReportNum: number
    private numberOfSheets: number
    constructor(
        private reportState: ReportState,
        private modelId?: string,
        private folder?: GoogleAppsScript.Drive.Folder,
        private name?: string,
        private date?: string,
        private lastAppendedService?: number
    ) {
        if (this.reportState.getIsEdit() === false && this.reportState.getIsAppending() === false)
            this.createSpreadsheetFromModel(this.modelId, this.folder, this.name);
        
        else if (this.reportState.getIsEdit() === true && this.reportState.getIsAppending() === false)
            this.updateReportSpreadsheetFile(this.modelId, this.date)
        else
            this.appendReportSpreadsheetFile(this.modelId);
        this.oldReportNum;
    }

    /**
     * Opens an existing spreadsheet by file ID.
     * @param fileId The ID of the Google Spreadsheet to open.
     */
    openSpreadsheet(fileId: string): GoogleAppsScript.Spreadsheet.Spreadsheet | null {
        try {
            let spreadsheet = SpreadsheetApp.openById(fileId);
            return (spreadsheet);
        } catch (e) {
            Logger.log("Could not open spreadsheet/sheet");
            return (null);
        }
    }

    /**
     * Creates a copy of a model spreadsheet in a specified folder.
     * @param modelId The ID of the model spreadsheet.
     * @param folderId The ID of the destination folder.
     * @param name The name for the copied spreadsheet.
     * @returns The newly created spreadsheet.
     */
    // modelId: string, folderId: string, name: string
    createSpreadsheetFromModel(modelId: string, folder: GoogleAppsScript.Drive.Folder, name: string) {
        const modelFile = DriveApp.getFileById(modelId);
        const copiedFile = modelFile.makeCopy(name, folder);
        this.spreadsheet = SpreadsheetApp.openById(copiedFile.getId());
        this.firstSheet = this.spreadsheet.getSheets()[0];
        this.numberOfSheets = this.spreadsheet.getNumSheets();
        return (this.spreadsheet);
    }

    getOldReportNumber(): number {
        return (this.oldReportNum)
    }

    /**
     * Updates the name of the current spreadsheet.
     * @param name The new name for the spreadsheet.
     */
    updateSpreadsheetName(name: string): void {
        if (this.spreadsheet) {
            this.spreadsheet.rename(name);
        } else {
            throw new Error("No spreadsheet is currently open.");
        }
    }

    /**
     * Retrieves the first sheet of the current spreadsheet.
     * @returns The first sheet of the spreadsheet.
     */
    getFirstSheet(): GoogleAppsScript.Spreadsheet.Sheet {
        if (!this.firstSheet) {
            throw new Error("No spreadsheet or sheet is currently open.");
        }
        return this.firstSheet;
    }

    getWorkingSheet(): GoogleAppsScript.Spreadsheet.Sheet {
        if (this.reportState.getIsAppending())
            return (this.appendingSheet);
        return (this.firstSheet);
    }

    getSpreadsheet(): GoogleAppsScript.Spreadsheet.Spreadsheet {
        return (this.spreadsheet);
    }

    /**
     * Exports the current spreadsheet's first sheet as a PDF.
     * @param destinationFolderId The ID of the destination folder for the exported PDF.
     * @returns The created PDF file.
     */
    exportFirstSheetToPDF(destinationFolderId: string): GoogleAppsScript.Drive.File {
        if (!this.spreadsheet || !this.firstSheet) {
            throw new Error("No spreadsheet or sheet is currently open.");
        }

        const token = ScriptApp.getOAuthToken();
        const spreadsheetId = this.spreadsheet.getId();
        const sheetId = this.firstSheet.getSheetId();

        const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=pdf&gid=${sheetId}`;

        const response = UrlFetchApp.fetch(exportUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            muteHttpExceptions: true,
        });

        const pdfBlob = response.getBlob().setName(`${this.spreadsheet.getName()}.pdf`);
        const destinationFolder = DriveApp.getFolderById(destinationFolderId);
        const pdfFile = destinationFolder.createFile(pdfBlob);

        return pdfFile;
    }

    /**
     * Deletes a specific sheet from the current spreadsheet.
     * @param sheet The sheet to delete.
     */
    deleteSheet(sheet: GoogleAppsScript.Spreadsheet.Sheet): void {
        if (!this.spreadsheet) {
            throw new Error("No spreadsheet is currently open.");
        }
        this.spreadsheet.deleteSheet(sheet);
    }

    /**
     * Copies a sheet into the current spreadsheet.
     * @param sourceSheet The sheet to copy.
     * @returns The copied sheet.
     */
    copySheetToCurrentSpreadsheet(sourceSheet: GoogleAppsScript.Spreadsheet.Sheet): GoogleAppsScript.Spreadsheet.Sheet {
        if (!this.spreadsheet) {
            throw new Error("No spreadsheet is currently open.");
        }
        return sourceSheet.copyTo(this.spreadsheet);
    }

    /**
     * Retrieves the current spreadsheet's ID.
     * @returns The spreadsheet ID.
     */
    getSpreadsheetId(): string {
        if (!this.spreadsheet) {
            throw new Error("No spreadsheet is currently open.");
        }
        return this.spreadsheet.getId();
    }

    /**
     * Sets the active spreadsheet instance manually.
     * @param spreadsheet The spreadsheet instance to set.
     */
    setSpreadsheet(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet): void {
        this.spreadsheet = spreadsheet;
        this.firstSheet = spreadsheet.getSheets()[0];
    }

    setFirstSheet(firstSheet: GoogleAppsScript.Spreadsheet.Sheet) {
        this.firstSheet = firstSheet;
    }

    getOldReportNum() {
        return (this.firstSheet.getRange(ReportCells.RDO.HEADER.RDO_NUMBER).getValue());
    }

    updateReportItemsHeader() {
        for (let i = 0; i < 9; i++) {
            let itemHeader = this.appendingSheet.getRange(ReportCells.RDO.SERVICES_ROWS.FIRST_ROWS[i + 1], 1);
            let itemNumber = i + this.getItemNumber();
            itemHeader.setValue("Item " + itemNumber);
        }
    }

    updateReportSpreadsheetFile(oldSpreadsheetId: string, date: string): void { // generalize this function
        this.spreadsheet = this.openSpreadsheet(oldSpreadsheetId);
        if (this.spreadsheet === null)
          throw Error("Could not open report Spreadsheet - edit mode");
        this.firstSheet = this.spreadsheet.getSheets()[0]
        this.oldReportNum = this.getOldReportNum();
        let reportNameModel =  /(\d{2}-\d{2}-\d{4}) - ([a-zA-ZçÇ]+)/;
        let newSpreadsheetName = this.spreadsheet.getName().replace(reportNameModel, `${date} - ${getWeekDay(date)}`);
        let modelSheet = this.openSpreadsheet(SpreadsheetIds.MODEL_IDS[this.reportState.getReportType()]).getSheets()[0];
        let newFirstSheet = this.copySheetToCurrentSpreadsheet(modelSheet)
        this.deleteSheet(this.firstSheet);
        this.firstSheet = newFirstSheet;
        this.firstSheet.setName(ReportTypes[this.reportState.getReportType()])
        this.updateSpreadsheetName(newSpreadsheetName)
        this.numberOfSheets = 1;
    }

    appendReportSpreadsheetFile(oldSpreadsheetId: string): void { // generalize this function
        this.spreadsheet = this.openSpreadsheet(oldSpreadsheetId);
        if (this.spreadsheet === null)
          throw Error("Could not open report Spreadsheet - appeding mode");
        this.firstSheet = this.spreadsheet.getSheets()[0];
        this.oldReportNum = this.getOldReportNum();
        let modelSheet = this.openSpreadsheet(SpreadsheetIds.MODEL_IDS[this.reportState.getReportType()]).getSheets()[0];
        let newAppendingSheet = this.copySheetToCurrentSpreadsheet(modelSheet)
        this.appendingSheet = newAppendingSheet;
        this.numberOfSheets = this.spreadsheet.getNumSheets();
        this.appendingSheet.setName("Verso " + this.numberOfSheets);
        this.secondToLastSheet = this.spreadsheet.getSheets()[this.numberOfSheets - 2];
        this.updateReportItemsHeader();
    }

    deleteOldPdf(): void {
        let oldPdfFileIterator = this.folder.getFilesByName(`${this.spreadsheet.getName()}.pdf`);
        if (oldPdfFileIterator.hasNext() === false)
            return ;
        let oldPdfFile = oldPdfFileIterator.next();
        this.folder.removeFile(oldPdfFile);
    }

    exportSheetToPDF(): void {
        var token = ScriptApp.getOAuthToken();
        var reportSpreadsheetId = this.getSpreadsheetId();
        var urlRequest = getExportUrlRequest(reportSpreadsheetId);
        try {
            var response = UrlFetchApp.fetch(urlRequest, {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            muteHttpExceptions: true
            });
    
        } catch (error) {
            Logger.log('Error: ' + error.toString());
        }
        var blob = response.getBlob().setName(`${this.spreadsheet.getName()}.pdf`);
        this.blob = blob;
        this.reportState.getReportBlobs().push(blob);
        if (this.reportState.getIsAppending() === true || this.reportState.getIsEdit() === true)
            this.deleteOldPdf();
        this.folder.createFile(blob)
    }

    spreadServices(numberOfServices: number): boolean {
        if (numberOfServices <= 6)
            return (false);
        this.appendingSheet = this.firstSheet.copyTo(this.spreadsheet);
        this.appendingSheet.setName(`Verso ${this.numberOfSheets + 1}`);
        let sheets = this.spreadsheet.getSheets();
        for (let i = 0; i < this.numberOfSheets + 1; i++) {
            sheets[i].getRange(sheets[i].getLastRow(), 1).setValue(`Página ${(i + 1)} de ${this.numberOfSheets + 1}`);
        }
        let startRow = ReportCells.RDO.SERVICES_ROWS.FIRST_ROWS[7];
        let endRow = ReportCells.RDO.SERVICES_ROWS.FIRST_ROWS.LAST_ROW - startRow + 1 - (7 * (9 - numberOfServices));
        this.getWorkingSheet().deleteRows(startRow, endRow);
        SpreadsheetApp.flush();
        startRow = ReportCells.RDO.SERVICES_ROWS.FIRST_ROWS[1];
        this.appendingSheet.deleteRows(startRow, 42);
        this.getWorkingSheet().deleteRows(ReportCells.RDO.FIRST_PAGE_INFO_ROWS.START_ROW, ReportCells.RDO.FIRST_PAGE_INFO_ROWS.TOTAL);
        this.appendingSheet.deleteRows(ReportCells.RDO.HEADER_ROWS.START_ROW, ReportCells.RDO.HEADER_ROWS.TOTAL);
        return (true);
    }

    getItemNumber(): number {
        return (((this.numberOfSheets - 2) * 9) + 1);
    }

    appendEvenServices(numberOfServices: number): void {
        let overTimeValues = this.secondToLastSheet.getRange(ReportCells.RDO.FOOTER.SECOND_SHEET_OVERTIME_VALUES).getValues();
        this.appendingSheet.getRange(76 - 7 * (9 - numberOfServices), 1, 3, 16).setValues(overTimeValues);
        if (this.spreadServices(numberOfServices) === false) {
            this.secondToLastSheet.deleteRows(53, 3);
            let sheets = this.spreadsheet.getSheets();
            for (let i = 0; i < this.numberOfSheets; i++) {
                sheets[i].getRange(sheets[i].getLastRow(), 1).setValue(`Página ${(i + 1)} de ${this.numberOfSheets}`);
            }
        }
        
    }

    appendServices(numberOfServices: number): void {
        if (this.numberOfSheets % 2 === 0) {
            this.appendEvenServices(numberOfServices);
            return ;
        }
        let numberOfRowsToAppend = numberOfServices <= 3 ? (7 * numberOfServices) : 21;
        let numberOfServicesToAppend = numberOfRowsToAppend / 7;
        let rangeToCopy = this.appendingSheet.getRange(11, 1, numberOfRowsToAppend, 16);
        rangeToCopy.copyTo(this.secondToLastSheet.getRange("A84")); // random cell down below report
        let rangeToMove = this.secondToLastSheet.getRange(84, 1, numberOfRowsToAppend, 16);
        this.secondToLastSheet.moveRows(rangeToMove, 30);
        rangeToMove.clear();
        if (numberOfServices <= 3) {
            this.spreadsheet.deleteSheet(this.appendingSheet);
            return ;
        }
        let overTimeValues = this.secondToLastSheet.getRange(ReportCells.RDO.FOOTER.SECOND_SHEET_OVERTIME_VALUES).getValues();
        this.appendingSheet.getRange(76 - 7 * (9 - numberOfServices), 1, 3, 16).setValues(overTimeValues);
        let sheets = this.spreadsheet.getSheets();
        for (let i = 0; i < this.numberOfSheets; i++) {
            sheets[i].getRange(sheets[i].getLastRow(), 1).setValue(`Página ${(i + 1)} de ${this.numberOfSheets}`);
        }
        this.appendingSheet.deleteRows(11, numberOfRowsToAppend);
        this.appendingSheet.deleteRows(ReportCells.RDO.HEADER_ROWS.START_ROW, ReportCells.RDO.HEADER_ROWS.TOTAL);
        this.secondToLastSheet.deleteRows(53, 3);
    }
}
