/**
 * A utility class to handle spreadsheet operations for reports.
 */
class SpreadsheetManager {
    private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet | null = null;
    private firstSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null;
    private secondSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null;
    private thirdSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null;
    private blob: GoogleAppsScript.Base.Blob;
    private oldReportNum: number
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
            return (this.thirdSheet);
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
    }

    appendReportSpreadsheetFile(oldSpreadsheetId: string): void { // generalize this function
        this.spreadsheet = this.openSpreadsheet(oldSpreadsheetId);
        if (this.spreadsheet === null)
          throw Error("Could not open report Spreadsheet - appeding mode");

        // O CÓDIGO ABAIXO TALVEZ SÓ PRECISE SER EXECUTADO APÓS O PROCESSAMENTO DOS SERVIÇOS.
        this.firstSheet = this.spreadsheet.getSheets()[0];
        this.oldReportNum = this.getOldReportNum();
        let modelSheet = this.openSpreadsheet(SpreadsheetIds.MODEL_IDS[this.reportState.getReportType()]).getSheets()[0];
        let newFirstSheet = this.copySheetToCurrentSpreadsheet(modelSheet)
        this.thirdSheet = newFirstSheet;
        this.thirdSheet.setName("Verso 3")
        this.secondSheet = this.spreadsheet.getSheets()[1];
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
        var reportSheetId = this.firstSheet.getSheetId();
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

    spreadServices(numberOfServices: number): void {
        if (numberOfServices <= 6)
            return;
        this.secondSheet = this.firstSheet.copyTo(this.spreadsheet);
        this.secondSheet.setName("Verso 2");
        this.firstSheet.getRange(ReportCells.RDO.FOOTER.PAGE_NUMBER).setValue("Página 1 de 2");
        this.secondSheet.getRange(ReportCells.RDO.FOOTER.PAGE_NUMBER).setValue("Página 2 de 2");
        let startRow = ReportCells.RDO.SERVICES_ROWS.FIRST_ROWS[7];
        let endRow = ReportCells.RDO.SERVICES_ROWS.FIRST_ROWS.LAST_ROW - startRow + 1 - (7 * (9 - numberOfServices));
        this.firstSheet.deleteRows(startRow, endRow);
        SpreadsheetApp.flush();
        startRow = ReportCells.RDO.SERVICES_ROWS.FIRST_ROWS[1];
        this.secondSheet.deleteRows(startRow, 42);
        this.firstSheet.deleteRows(ReportCells.RDO.FIRST_PAGE_INFO_ROWS.START_ROW, ReportCells.RDO.FIRST_PAGE_INFO_ROWS.TOTAL);
        this.secondSheet.deleteRows(ReportCells.RDO.HEADER_ROWS.START_ROW, ReportCells.RDO.HEADER_ROWS.TOTAL);
    }

    appendServices(numberOfServices: number): void {
        let numberOfRowsToAppend = numberOfServices <= 3 ? (7 * numberOfServices) : 21;
        let numberOfServicesToAppend = numberOfRowsToAppend / 7;
        let rangeToCopy = this.thirdSheet.getRange(11, 1, numberOfRowsToAppend, 16);
        rangeToCopy.copyTo(this.secondSheet.getRange("A84")); // random cell down below report
        let rangeToMove = this.secondSheet.getRange(84, 1, numberOfRowsToAppend, 16);
        this.secondSheet.moveRows(rangeToMove, 30);
        for (let i = 0; i < numberOfServicesToAppend; i++) {
            let itemHeader = this.secondSheet.getRange(ReportCells.RDO.SERVICES_ROWS.FIRST_ROWS[i + 4] - 2, 1);
            let itemNumber = i + 10;
            itemHeader.setValue("Item " + itemNumber);
        }
        if (numberOfServices <= 3) {
            this.spreadsheet.deleteSheet(this.thirdSheet);
            return ;
        }
        for (let i = 0; i < numberOfServices - 3; i++) {
            let itemHeader = this.thirdSheet.getRange(ReportCells.RDO.SERVICES_ROWS.FIRST_ROWS[i + 4], 1);
            let itemNumber = i + 13;
            itemHeader.setValue("Item " + itemNumber);
        }

        let overTimeValues = this.secondSheet.getRange(ReportCells.RDO.FOOTER.SECOND_SHEET_OVERTIME_VALUES).getValues();
        this.thirdSheet.getRange(76 - 7 * (9 - numberOfServices), 1, 3, 16).setValues(overTimeValues);
        this.firstSheet.getRange(this.firstSheet.getLastRow(), 1).setValue("Página 1 de 3");
        this.secondSheet.getRange(this.secondSheet.getLastRow(), 1).setValue("Página 2 de 3");
        this.thirdSheet.getRange(this.thirdSheet.getLastRow(), 1).setValue("Página 3 de 3");
        this.thirdSheet.deleteRows(11, numberOfRowsToAppend);
        this.thirdSheet.deleteRows(ReportCells.RDO.HEADER_ROWS.START_ROW, ReportCells.RDO.HEADER_ROWS.TOTAL);
        this.secondSheet.deleteRows(53, 3);
    }
}
