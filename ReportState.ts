class ReportState {
    private static instance: ReportState;
    private reportBuffer: string[][];
	private isEdit: boolean;
	private isAppending: boolean;
	private reportBlobs: GoogleAppsScript.Base.Blob[];
	private reportType: ReportTypes;
	private reportIds: string;
    private debug: boolean;
    private newServiceFlag: boolean;
    private serviceItem: number;
    private requestsObject: GoogleAppsScript.URL_Fetch.URLFetchRequest[];

    private constructor() {
        this.reportBuffer = [];
        this.isEdit = false;
        this.isAppending = false;
        this.reportBlobs = [];
        this.reportType = ReportTypes.RDO;
        this.reportIds = "";
        this.debug = false;
        this.newServiceFlag = false;
        this.serviceItem = 0;
        this.requestsObject = [];
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

    public getIsAppending(): boolean {
        return (this.isAppending);
    }

    public setIsAppending(value: boolean): void {
        this.isAppending = value;
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

    public makePostRequestObject(formResponseId: string, reportInfoJSONString: string, reportType: ReportTypes, item: number, serviceObject: ServiceFieldResponses): void {
        var payload = {
            formResponseId: formResponseId,
            reportInfoJSONString: reportInfoJSONString,
            reportType: reportType,
            item: item,
            isEdit: this.isEdit,
            // reportNumber: reportNumber,
            serviceObject: serviceObject
        };

        var options: GoogleAppsScript.URL_Fetch.URLFetchRequest = {
            'url': ServiceApi.SERVICE_API_URL,
            'method': 'post',
            'contentType': 'application/json',
            'payload': JSON.stringify(payload),
            'headers': {
            'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()
            }
        };
        this.requestsObject.push(options);
    }

    public makeUrlRequests(): void {
        let reportState = ReportState.getInstance();
        let urlRequestReponses = UrlFetchApp.fetchAll(this.requestsObject);
        urlRequestReponses.forEach(response => {
            var responseObject = JSON.parse(response.getContentText())
            var serviceReportBlob = Utilities.newBlob(Utilities.base64Decode(responseObject.blob, Utilities.Charset.UTF_8), "application/pdf", responseObject.blobName);
            this.reportBlobs.push(serviceReportBlob)
            this.addReportId(`,${responseObject.reportId}`);
        });
    }
}
