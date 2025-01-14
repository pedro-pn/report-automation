/**
 * A utility class to handle spreadsheet operations for reports.
 */
class SpreadsheetManager {
    private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet | null = null;
    private firstSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null;
    private blob: GoogleAppsScript.Base.Blob;
    constructor(
        private modelId: string,
        private folder: GoogleAppsScript.Drive.Folder,
        private name: string,
        private reportState: ReportState
    ) {
        this.createSpreadsheetFromModel(this.modelId, this.folder, this.name);
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
        let reportNum = this.getOldReportNum();
        let reportNameModel =  /(\d{2}-\d{2}-\d{4}) - ([a-zA-ZçÇ]+)/;
        let newSpreadsheetName = this.spreadsheet.getName().replace(reportNameModel, `${date} - ${getWeekDay(date)}`);
        let modelSheet = this.openSpreadsheet(SpreadsheetIds.MODEL_IDS[ReportTypes[this.reportState.getReportType()]]).getSheets()[0];
        let newFirstSheet = this.copySheetToCurrentSpreadsheet(modelSheet)
        this.deleteSheet(this.firstSheet);
        this.firstSheet = newFirstSheet;
        this.firstSheet.setName(ReportTypes[this.reportState.getReportType()])
        this.updateSpreadsheetName(newSpreadsheetName)
    }

    exportSheetToPDF(): void {
        var token = ScriptApp.getOAuthToken();
        var reportSpreadsheetId = this.getSpreadsheetId();
        var reportSheetId = this.firstSheet.getSheetId();
        var urlRequest = getExportUrlRequest(reportSpreadsheetId, reportSheetId);
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
        this.folder.createFile(blob)
    }
}
