//#region SERVICE HANDLER

function fillServicesFields(reportData: ReportData): void {
	let reportState = ReportState.getInstance();
	var serviceDbFile = DriveApp.getFileById(ReportJSONIds.SERVICE_DB_ID);
	let serviceFieldResponseDb: ServiceFieldResponses = JSON.parse(serviceDbFile.getBlob().getDataAsString());
    for (var item = 1; item <= 9; item++) {
        reportData.numOfServices += fillItem(reportData, item, serviceFieldResponseDb);
    }
	reportState.makeUrlRequests();
	serviceDbFile.setContent(JSON.stringify(serviceFieldResponseDb, null, 2));
}

function fillItem(reportData: ReportData, item: number, serviceFieldResponseDb: ServiceFieldResponses): number {
    var service = reportData.searchFieldResponse(FormFields.HEADER.ADD_SERVICE, item)
	if (service === "Teste de pressão")
		fillPressureTest(reportData, item, serviceFieldResponseDb);
	else if (service === "Limpeza química")
		fillDescaling(reportData, item, serviceFieldResponseDb)
	else if (service === "Flushing")
		fillFlushing(reportData, item, serviceFieldResponseDb)
	else if (service === "Filtragem absoluta")
		fillFiltration(reportData, item, serviceFieldResponseDb)
	else if (service === "Limpeza de reservatório")
		fillTankCleaning(reportData, item, serviceFieldResponseDb)
	else if (service === "Inibição")
		fillInibition(reportData, item, serviceFieldResponseDb)
	else
		return (0)
	return (1);
}

function makeServiceReport(reportData: ReportData, type: ReportTypes, item: number): void {
	let reportState = ReportState.getInstance();
	let reportId = reportData.getFormResponse().getId();
  	let serviceObject = reportData.formResponsesDict[item];
	// let reportNumber = reportData.getReportNumber(type) + 1;
	reportState.makePostRequestObject(reportId, reportData.getReportInfoJsonString(), type, item, serviceObject);
}

//#endregion

//#region PRESSURE TEST
function	fillPressureTestStatements(cells: ReportServiceCells, reportState: ReportState): void {
	reportState.setValueToBuffer(cells.PARAM_ONE_KEY, ReportStatements.RDO.WORK_PRESSURE);
	reportState.setValueToBuffer(cells.PARAM_TWO_KEY, ReportStatements.RDO.TEST_PRESSURE);
	reportState.setValueToBuffer(cells.INFO_KEY, ReportStatements.RDO.FLUID_TYPE);
}

interface PressureTestSpecs {
	StartTime: string;
	EndTime: string;
	Equipament: string;
	System: string;
	Service: string;
	Fluid: string;
	Obs: string;
	Steps: string[];
	WorkPressure: string;
	TestPressure: string;
	Status: string;
	TotalTime: string;
}


function getPressureTestSpecs(reportData: ReportData, item: number): PressureTestSpecs {
	var pressureTestSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.START_TIME, item) as string,
		EndTime: getServiceFieldResponse(reportData,FormFields.SERVICES.COMMON.END_TIME, item) as string,
		Equipament: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.EQUIPAMENT, item) as string,
		System: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.SYSTEM, item) as string,
		Service: getServiceString(ServicesNames.TESTE_DE_PRESSÃO),
		Fluid: getServiceFieldResponse(reportData, FormFields.SERVICES.RTP.FLUID_TYPE, item) as string,
		Obs: getServiceFieldResponse(reportData,FormFields.SERVICES.COMMON.OBS, item) as string,
		Steps:getServiceFieldResponse(reportData,FormFields.SERVICES.COMMON.STEPS, item) as string[],
		WorkPressure: getServiceFieldResponse(reportData, FormFields.SERVICES.RTP.WORK_PRESSURE, item) as string,
		TestPressure: getServiceFieldResponse(reportData, FormFields.SERVICES.RTP.TEST_PRESSURE, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.STATUS, item) as string) as string,
		TotalTime: hoursToHourString(getDiffHour(getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.START_TIME, item) as string, getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.END_TIME, item) as string))
	}
	
	return (pressureTestSpecs);
}

function	fillPressureTest(reportData: ReportData, item: number, serviceFieldResponseDb: ServiceFieldResponses): void {
	let cells = ReportCells.RDO.SERVICES[item];
	let pressureTestSpecs = getPressureTestSpecs(reportData, item);
	const reportState = ReportState.getInstance()

	fillPressureTestStatements(cells, reportState);
	reportState.setValueToBuffer(cells.START_TIME, pressureTestSpecs.StartTime);
	reportState.setValueToBuffer(cells.END_TIME, pressureTestSpecs.EndTime);
	reportState.setValueToBuffer(cells.EQUIPAMENT, pressureTestSpecs.Equipament);
	reportState.setValueToBuffer(cells.SYSTEM, pressureTestSpecs.System);
	reportState.setValueToBuffer(cells.SERVICE, pressureTestSpecs.Service);
	reportState.setValueToBuffer(cells.STATUS, pressureTestSpecs.Status);
	reportState.setValueToBuffer(cells.PARAM_ONE, pressureTestSpecs.WorkPressure);
	reportState.setValueToBuffer(cells.PARAM_TWO, pressureTestSpecs.TestPressure);
	reportState.setValueToBuffer(cells.INFO, pressureTestSpecs.Fluid);
	reportState.setValueToBuffer(cells.STEPS, pressureTestSpecs.Steps.join(", "));
	reportState.setValueToBuffer(cells.OBS, pressureTestSpecs.Obs);
	reportData.formResponsesDict[item]["TotalTime"] = pressureTestSpecs.TotalTime;

  if (reportState.getIsEdit())
    return ;
	checkServiceProgress(reportData, item, RtpServiceDbFields, serviceFieldResponseDb)
	if (pressureTestSpecs.Status === "Finalizado" || pressureTestSpecs.Status === "Finished") {
		makeServiceReport(reportData, ReportTypes.RTP, item)
		reportData.updateReportNumber(ReportTypes.RTP);
	}
}
//#endregion

//#region DESCALING

interface DescalingSpecs {
	StartTime: string;
	EndTime: string;
	Equipament: string;
	System: string;
	Service: string;
	Obs: string;
	Size: string;
	Steps: string[];
	PipeMaterial: string;
	Status: string;
}

function fillDescalingStatements(cells: ReportServiceCells, reportState: ReportState): void {
	reportState.setValueToBuffer(cells.PARAM_ONE, ReportStatements.RDO.PIPE_MATERIAL);
}

function getDescalingSpecs(reportData: ReportData, item: number): DescalingSpecs {
	var descalingSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.START_TIME, item) as string,
		EndTime: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.END_TIME, item) as string,
		Equipament: getServiceFieldResponse(reportData,FormFields.SERVICES.COMMON.EQUIPAMENT, item) as string,
		System: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.SYSTEM, item) as string,
		Service: getServiceString(ServicesNames.LIMPEZA_QUÍMICA),
		Obs: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.OBS, item) as string,
   		Size: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.SIZE, item) as string,
		Steps:getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.STEPS, item) as string[],
		PipeMaterial: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.PIPE_MATERIAL, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.STATUS, item) as string)
	}
	
	return (descalingSpecs);
}

function fillDescaling(reportData: ReportData, item: number, serviceFieldResponseDb: ServiceFieldResponses): void {
	let cells = ReportCells.RDO.SERVICES[item];
	let descalingSpecs = getDescalingSpecs(reportData, item);
	const reportState = ReportState.getInstance();

	fillDescalingStatements(cells, reportState)
	reportState.setValueToBuffer(cells.START_TIME, descalingSpecs.StartTime);
	reportState.setValueToBuffer(cells.END_TIME, descalingSpecs.EndTime);
	reportState.setValueToBuffer(cells.EQUIPAMENT, descalingSpecs.Equipament);
	reportState.setValueToBuffer(cells.SYSTEM, descalingSpecs.System);
	reportState.setValueToBuffer(cells.SERVICE, descalingSpecs.Service);
	reportState.setValueToBuffer(cells.STATUS, descalingSpecs.Status);
	reportState.setValueToBuffer(cells.PARAM_ONE, descalingSpecs.PipeMaterial);
	reportState.setValueToBuffer(cells.STEPS, descalingSpecs.Steps.join(", "));
	reportState.setValueToBuffer(cells.OBS, descalingSpecs.Obs + ((descalingSpecs.Obs && descalingSpecs.Size) ? `\n`:"") + descalingSpecs.Size);
	// reportState.setValueToBuffer(cells.OBS, "teste " + descalingSpecs.Obs + (((descalingSpecs.Obs && descalingSpecs.Size) ?  `\n` : "") + descalingSpecs.Size));
	/* Altera;áo feita pelo Victor, comentei a linha e fiz miha versáo em baixo */

  if (reportState.getIsEdit())
    return ;
	checkServiceProgress(reportData, item, RlqServiceDbFields, serviceFieldResponseDb)
	if (descalingSpecs.Status === "Finalizado" || descalingSpecs.Status === "Finished") {
		makeServiceReport(reportData, ReportTypes.RLQ, item)
		reportData.updateReportNumber(ReportTypes.RLQ);
	}
}
//#endregion

//#region FLUSHING

interface FlushingSpecs {
	StartTime: string;
	EndTime: string;
	Equipament: string;
	System: string;
	Service: string;
	Obs: string;
	Steps: string[];
	InicialPartCount: string;
	OilNorm: string;
	FinalPartCount: string;
	Oil: string;
	Status: string;
	TotalTime: string;
}

function fillFlushingStatements(cells: ReportServiceCells, reportState: ReportState): void {
	reportState.setValueToBuffer(cells.PARAM_ONE_KEY, ReportStatements.RDO.INICIAL_ANALYSIS);
	reportState.setValueToBuffer(cells.PARAM_TWO_KEY, ReportStatements.RDO.FINAL_ANALYSIS);
	reportState.setValueToBuffer(cells.INFO_KEY, ReportStatements.RDO.OIL);
}

function getFlushingSpecs(reportData: ReportData, item: number): FlushingSpecs {
	var flushingSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.START_TIME, item) as string,
		EndTime: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.END_TIME, item) as string,
		Equipament: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.EQUIPAMENT, item) as string,
		System: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.SYSTEM, item) as string,
		Service: getServiceString(ServicesNames.FLUSHING, getFlushingType(getServiceFieldResponse(reportData, FormFields.SERVICES.RCP.FLUSHING_TYPE, item) as string)),
		Obs: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.OBS, item) as string,
		Steps:getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.STEPS, item) as string[],
		InicialPartCount: getServiceFieldResponse(reportData, FormFields.SERVICES.RCP.INICIAL_PART_COUNT, item) as string,
		OilNorm: getServiceFieldResponse(reportData, FormFields.SERVICES.RCP.OIL_NORM, item) as string,
		FinalPartCount: getServiceFieldResponse(reportData, FormFields.SERVICES.RCP.FINAL_PART_COUNT, item) as string,
		Oil: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.OIL, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.STATUS, item) as string),
		TotalTime: hoursToHourString(getDiffHour(getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.START_TIME, item) as string, getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.END_TIME, item) as string))
	}
	
	return (flushingSpecs);
}

function fillFlushing(reportData: ReportData, item: number, serviceFieldResponseDb: ServiceFieldResponses): void {
	let cells = ReportCells.RDO.SERVICES[item];
	let flushingSpecs = getFlushingSpecs(reportData, item);
	const reportState = ReportState.getInstance();

	fillFlushingStatements(cells, reportState)
	reportState.setValueToBuffer(cells.START_TIME, flushingSpecs.StartTime);
	reportState.setValueToBuffer(cells.END_TIME, flushingSpecs.EndTime);
	reportState.setValueToBuffer(cells.SERVICE, flushingSpecs.Service);
	reportState.setValueToBuffer(cells.EQUIPAMENT, flushingSpecs.Equipament);
	reportState.setValueToBuffer(cells.SYSTEM, flushingSpecs.System);
	reportState.setValueToBuffer(cells.STATUS, flushingSpecs.Status);
	reportState.setValueToBuffer(cells.PARAM_ONE, `\'${(flushingSpecs.OilNorm == null ? "" : flushingSpecs.OilNorm)} ${flushingSpecs.InicialPartCount}`);
	reportState.setValueToBuffer(cells.PARAM_TWO, `\'${(flushingSpecs.OilNorm == null ? "" : flushingSpecs.OilNorm)} ${flushingSpecs.FinalPartCount}`);
	reportState.setValueToBuffer(cells.INFO, flushingSpecs.Oil);
	reportState.setValueToBuffer(cells.STEPS, flushingSpecs.Steps.join(", "));
	reportState.setValueToBuffer(cells.OBS, flushingSpecs.Obs);
	reportData.formResponsesDict[item]["TotalTime"] = flushingSpecs.TotalTime;

  	if (reportState.getIsEdit())
   		return ;
	checkServiceProgress(reportData, item, RcpServiceDbFields, serviceFieldResponseDb)
	if (flushingSpecs.Status === "Finalizado" || flushingSpecs.Status === "Finished") {
		makeServiceReport(reportData, ReportTypes.RCP, item)
		reportData.updateReportNumber(ReportTypes.RCP);
	}
}
//#endregion

//#region FILTRATION

interface FiltrationSpecs {
	StartTime: string;
	EndTime: string;
	Equipament: string;
	System: string;
	Service: string;
	Obs: string;
	Steps: string[];
	OilNorm: string;
	InicialPartCount: string;
	FinalPartCount: string;
	Volume: string;
	Status: string;
	TotalTime: string;

}

function fillFiltrationStatements(cells: ReportServiceCells, reportState: ReportState): void {
	reportState.setValueToBuffer(cells.PARAM_ONE, ReportStatements.RDO.INICIAL_ANALYSIS);
	reportState.setValueToBuffer(cells.PARAM_TWO_KEY, ReportStatements.RDO.FINAL_ANALYSIS);
	reportState.setValueToBuffer(cells.INFO_KEY, ReportStatements.RDO.VOLUME);
}

function getFiltrationSpecs(reportData: ReportData, item: number): FiltrationSpecs {
	var filtrationSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.START_TIME, item) as string,
		EndTime: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.END_TIME, item) as string,
		Equipament: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.EQUIPAMENT, item) as string,
		System: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.SYSTEM, item) as string,
		Service: getServiceString(ServicesNames.FILTRAGEM_ABSOLUTA),
		Obs: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.OBS, item) as string,
		Steps:getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.STEPS, item) as string[],
		OilNorm: getServiceFieldResponse(reportData, FormFields.SERVICES.RCP.OIL_NORM, item) as string,
		InicialPartCount: getServiceFieldResponse(reportData, FormFields.SERVICES.RCP.INICIAL_PART_COUNT, item) as string,
		FinalPartCount: getServiceFieldResponse(reportData, FormFields.SERVICES.RCP.FINAL_PART_COUNT, item) as string,
		Volume: getServiceFieldResponse(reportData, FormFields.SERVICES.RCP.VOLUME, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.STATUS, item) as string),
		TotalTime: hoursToHourString(getDiffHour(getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.START_TIME, item) as string, getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.END_TIME, item) as string))
	}
	
	return (filtrationSpecs);
}

function fillFiltration(reportData: ReportData, item: number, serviceFieldResponseDb: ServiceFieldResponses): void {
	let cells = ReportCells.RDO.SERVICES[item];
	let filtrationSpecs = getFiltrationSpecs(reportData, item);
	const reportState = ReportState.getInstance();

	fillFiltrationStatements(cells, reportState)
	reportState.setValueToBuffer(cells.START_TIME, filtrationSpecs.StartTime);
	reportState.setValueToBuffer(cells.END_TIME, filtrationSpecs.EndTime);
	reportState.setValueToBuffer(cells.EQUIPAMENT, filtrationSpecs.Equipament);
	reportState.setValueToBuffer(cells.SYSTEM, filtrationSpecs.System);
	reportState.setValueToBuffer(cells.SERVICE, filtrationSpecs.Service);
	reportState.setValueToBuffer(cells.STATUS, filtrationSpecs.Status);
	reportState.setValueToBuffer(cells.PARAM_ONE, `\'${(filtrationSpecs.OilNorm == null ? "" : filtrationSpecs.OilNorm)} ${filtrationSpecs.InicialPartCount}`);
	reportState.setValueToBuffer(cells.PARAM_TWO, `\'${(filtrationSpecs.OilNorm == null ? "" : filtrationSpecs.OilNorm)} ${filtrationSpecs.FinalPartCount}`);
	reportState.setValueToBuffer(cells.INFO, filtrationSpecs.Volume);
	reportState.setValueToBuffer(cells.STEPS, filtrationSpecs.Steps.join(", "));
	reportState.setValueToBuffer(cells.OBS, filtrationSpecs.Obs);
	reportData.formResponsesDict[item]["TotalTime"] = filtrationSpecs.TotalTime;

  if (reportState.getIsEdit())
      return ;
	checkServiceProgress(reportData, item, RcpServiceDbFields, serviceFieldResponseDb)
	if (filtrationSpecs.Status === "Finalizado" || filtrationSpecs.Status === "Finished") {
		makeServiceReport(reportData, ReportTypes.RCP, item)
		reportData.updateReportNumber(ReportTypes.RCP);
	}
}
//#endregion

//#region TANK CLEANING

interface TankCleaningSpecs {
	StartTime: string;
	EndTime: string;
	Equipament: string;
	System: string;
	Service: string;
	Obs: string;
	Steps: string[];
	tankMaterial: string;
	Status: string;
}

function fillTankCleaningStatements(cells: ReportServiceCells, reportState: ReportState): void {
	reportState.setValueToBuffer(cells.PARAM_ONE_KEY, ReportStatements.RDO.TANK_MATERIAL);
}

function getTankCleaningSpecs(reportData: ReportData, item: number): TankCleaningSpecs {
	var descalingSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.START_TIME, item) as string,
		EndTime: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.END_TIME, item) as string,
		Equipament: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.EQUIPAMENT, item) as string,
		System: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.SYSTEM, item) as string,
		Service: getServiceString(ServicesNames.LIMPEZA_DE_RESERVATORIO),
		Obs: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.OBS, item) as string,
		Steps:getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.STEPS, item) as string[],
		tankMaterial: getServiceFieldResponse(reportData, FormFields.SERVICES.RLR.TANK_MATERIAL, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.STATUS, item) as string)
	}
	
	return (descalingSpecs);
}

function fillTankCleaning(reportData: ReportData, item: number, serviceFieldResponseDb: ServiceFieldResponses): void {
	let cells = ReportCells.RDO.SERVICES[item];
	let tankCleaningSpecs = getTankCleaningSpecs(reportData, item);
	const reportState = ReportState.getInstance();

	fillTankCleaningStatements(cells, reportState)
	reportState.setValueToBuffer(cells.START_TIME, tankCleaningSpecs.StartTime);
	reportState.setValueToBuffer(cells.END_TIME, tankCleaningSpecs.EndTime);
	reportState.setValueToBuffer(cells.EQUIPAMENT, tankCleaningSpecs.Equipament);
	reportState.setValueToBuffer(cells.SYSTEM, tankCleaningSpecs.System);
	reportState.setValueToBuffer(cells.SERVICE, tankCleaningSpecs.Service);
	reportState.setValueToBuffer(cells.STATUS, tankCleaningSpecs.Status);
	reportState.setValueToBuffer(cells.STEPS, tankCleaningSpecs.Steps.join(", "));
	reportState.setValueToBuffer(cells.OBS, tankCleaningSpecs.Obs);

	if (reportState.getIsEdit())
		return ;
	  checkServiceProgress(reportData, item, RlrServiceDbFields, serviceFieldResponseDb)
	  if (tankCleaningSpecs.Status === "Finalizado" || tankCleaningSpecs.Status === "Finished") {
		  makeServiceReport(reportData, ReportTypes.RLR, item)
		reportData.updateReportNumber(ReportTypes.RLR);
	  }
}
//#endregion

//#region Inibition

interface InibitionSpecs {
	StartTime: string;
	EndTime: string;
	Id: string;
	System: string;
	Service: string;
	ServiceStep: string;
	Obs: string;
	PipeMaterial: string;
	Status: string;
	Steps: string[];
	Reports: string[];
}

function fillInibitionStatements(cells: ReportServiceCells, reportState: ReportState): void {
	reportState.setValueToBuffer(cells.PARAM_ONE_KEY, ReportStatements.RDO.PIPE_MATERIAL);
}

function getInibitionSpecs(reportData: ReportData, item: number): InibitionSpecs {
	var inibitionSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormFields.SERVICES.RLI.START, item) as string,
		EndTime: getServiceFieldResponse(reportData, FormFields.SERVICES.RLI.END, item) as string,
		Id: getServiceFieldResponse(reportData, FormFields.SERVICES.RLI.ID, item) as string,
		Lines: getServiceFieldResponse(reportData, FormFields.SERVICES.RLI.LINES, item) as string,
		System: getServiceFieldResponse(reportData, FormFields.SERVICES.RLI.SYSTEM, item) as string,
		ServiceStep: getServiceFieldResponse(reportData, FormFields.SERVICES.RLI.SERVICE_STEP, item) as string,
		Service: getServiceFieldResponse(reportData, FormFields.SERVICES.RLI.SERVICE, item) as string,
		Obs: getServiceFieldResponse(reportData, FormFields.SERVICES.RLI.OBS, item) as string,
		PipeMaterial: getServiceFieldResponse(reportData,FormFields.SERVICES.RLI.MATERIAL, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormFields.SERVICES.RLI.STATUS, item) as string),
		Steps: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.STEPS, item) as string[],
		Reports: getServiceFieldResponse(reportData, FormFields.SERVICES.RLI.REPORTS, item) as string[],
	}
	
	return (inibitionSpecs);
}

function fillInibition(reportData: ReportData, item: number, serviceFieldResponseDb: ServiceFieldResponses): void {
	let cells = ReportCells.RDO.SERVICES[item];
	let inibitionSpecs = getInibitionSpecs(reportData, item);
	const reportState = ReportState.getInstance();

	fillInibitionStatements(cells, reportState)
	let systemDescription = inibitionSpecs.System.split(';');
	reportState.setValueToBuffer(cells.START_TIME, inibitionSpecs.StartTime);
	reportState.setValueToBuffer(cells.END_TIME, inibitionSpecs.EndTime);
	reportState.setValueToBuffer(cells.EQUIPAMENT, inibitionSpecs.Id);
	reportState.setValueToBuffer(cells.PARAM_ONE, inibitionSpecs. PipeMaterial);
	reportState.setValueToBuffer(cells.SYSTEM, systemDescription[0] + " - Step " + inibitionSpecs.ServiceStep + " - " + systemDescription[1]);
	reportState.setValueToBuffer(cells.SERVICE, "Flushing/Inibição");
	reportState.setValueToBuffer(cells.STATUS, inibitionSpecs.Status);
	reportState.setValueToBuffer(cells.STEPS, inibitionSpecs.Steps.join(", "));
	reportState.setValueToBuffer(cells.OBS, inibitionSpecs.Obs);

  	if (reportState.getIsEdit())
    	return ;
	checkServiceProgress(reportData, item, RliServiceDbFields, serviceFieldResponseDb)
	if (inibitionSpecs.Status !== "Finalizado")
		return ;
	inibitionSpecs.Reports.forEach(reportType => {
		if (reportType == "RLI") {
			makeServiceReport(reportData, ReportTypes.RLI, item);
			reportData.updateReportNumber(ReportTypes.RLI);
		}
		else if (reportType == "RLF") {
			makeServiceReport(reportData, ReportTypes.RLF, item);
			reportData.updateReportNumber(ReportTypes.RLF);
		}
	});
}
//#endregion
