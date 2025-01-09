class ReportState {
    private static instance: ReportState;
    private reportBuffer: string[][];
	private isEdit: boolean;
	private reportBlobs: GoogleAppsScript.Base.Blob[];
	private reportType: ReportTypes;
	private reportIds: string;
    private debug: boolean;
    private newServiceFlag: boolean;

    private constructor() {
        this.reportBuffer = [];
        this.isEdit = false;
        this.reportBlobs = [];
        this.reportType = ReportTypes.RDO;
        this.reportIds = "";
        this.debug = false;
        this.newServiceFlag = false;
    }

    public static getInstance(): ReportState {
        if (!ReportState.instance) {
            ReportState.instance = new ReportState();
        }
        return (ReportState.instance);
    }

    public setValueToBuffer(cellString: string, content: any): void {
		let cellNumbers = cellStringToNumber(cellString)
		this.reportBuffer[cellNumbers[0]][cellNumbers[1]] = content;
	}

    public getValueFromBuffer(cellString: string): any {
		let columnLetter = cellString.charAt(0);
		let columnNumber = columnLetter.charCodeAt(0) - 65;
		let rowNumber = parseInt(cellString.substring(1)) - 1;
		let value = this.reportBuffer[rowNumber][columnNumber];
	
		return (value);
	}

    public getReportBuffer(): string[][] {
        return (this.reportBuffer)
    }

    public setReportBuffer(value: string[][]): void {
        this.reportBuffer = value;
    }

    public getIsEdit(): boolean {
        return (this.isEdit);
    }

    public setIsEdit(value: boolean): void {
        this.isEdit = value;
    }
    
    public getReportBlobs(): GoogleAppsScript.Base.Blob[] {
       return (this.reportBlobs);
    }
    
    public setReportBlobs(value: GoogleAppsScript.Base.Blob[]): void {
        this.reportBlobs = value;
    }

    public getReportType(): ReportTypes {
        return (this.reportType);
    }

    public setReportType(value: ReportTypes): void {
        this.reportType = value;
    }

    public getReportIds(): string {
        return (this.reportIds);
    }

    public setReportIds(value: string): void {
        this.reportIds = value;
    }

    public getDebug(): boolean {
        return (this.debug);
    }

    public addReportId(value: string): void {
        this.reportIds += value;
    }

    public setDebug(value: boolean): void {
        this.debug = value;
    }

    public getNewServiceFlag(): boolean {
        return (this.newServiceFlag);
    }

    public setNewServiceFlag(value: boolean): void {
        this.newServiceFlag = value;
    }
}
