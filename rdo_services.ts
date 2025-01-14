//#region SERVICE HANDLER

function fillServicesFields(reportData: ReportData): void {
	var serviceDbFile = DriveApp.getFileById(ReportJSONIds.SERVICE_DB_ID);
	let serviceFieldResponseDb: ServiceFieldResponses = JSON.parse(serviceDbFile.getBlob().getDataAsString());
    for (var item = 1; item <= 9; item++) {
        reportData.numOfServices += fillItem(reportData, item, serviceFieldResponseDb);
    }
	serviceDbFile.setContent(JSON.stringify(serviceFieldResponseDb, null, 2));
  // console.log(serviceDb)
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
	else if (service === "Limpeza e inibição")
		fillInibition(reportData, item, serviceFieldResponseDb)
	else
		return (0)
	return (1);
}

// function makeServiceReport(reportData: ReportData, reportNumber: number, type: number, item: number) {
// 	var reportId = reportData.formResponse.getId();
//   var serviceObject = reportData.formResponsesDict[item];
// 	// try {
// 	let status = sendPostRequest(reportId, reportNumber, type, item, serviceObject);
// 	return (status);
  
// 	// } catch (error) {
// 	 // Logger.log(`Could not make ${Object.keys(ReportTypes)[type]} ${error}`)
// 	// }

// }

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
		Service: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.SERVICE, item) as string,
		Fluid: getServiceFieldResponse(reportData, FormFields.SERVICES.RTH.FLUID_TYPE, item) as string,
		Obs: getServiceFieldResponse(reportData,FormFields.SERVICES.COMMON.OBS, item) as string,
		Steps:getServiceFieldResponse(reportData,FormFields.SERVICES.COMMON.STEPS, item) as string[],
		WorkPressure: getServiceFieldResponse(reportData, FormFields.SERVICES.RTH.WORK_PRESSURE, item) as string,
		TestPressure: getServiceFieldResponse(reportData, FormFields.SERVICES.RTH.TEST_PRESSURE, item) as string,
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
	// if (pressureTestSpecs.Status === "Finalizado") {
	// 	var status = makeServiceReport(reportData, reportData.getReportNumber(ReportTypes.RTP), ReportTypes.RTP, item)
	// 	if (status)
	// 		reportData.reportInfo.updateReportNumber(reportData.missionName, ReportTypes.RTP);
	// }
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
		Service: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.SERVICE, item) as string,
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
	reportState.setValueToBuffer(cells.OBS, descalingSpecs.Obs + (descalingSpecs.Obs && descalingSpecs.Size) ? `\n`:"" + descalingSpecs.Size);

  if (reportState.getIsEdit())
    return ;
	checkServiceProgress(reportData, item, RlqServiceDbFields, serviceFieldResponseDb)
	// if (descalingSpecs.Status === "Finalizado") {
	// 	var status = makeServiceReport(reportData, reportData.getReportNumber(ReportTypes.RLQ), ReportTypes.RLQ, item)
	// 	if (status)
	// 		reportData.reportInfo.updateReportNumber(reportData.missionName, ReportTypes.RLQ);
	// }
}
//#endregion

//#region FLUSHING

interface FlushingSpecs {
	StartTime: string;
	EndTime: string;
	Equipament: string;
	System: string;
	Type: string;
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
		Type: getServiceFieldResponse(reportData, FormFields.SERVICES.RCP.FLUSHING_TYPE, item) as string,
		Service: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.SERVICE, item) as string,
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
	// if (flushingSpecs.Status === "Finalizado") {
	// 	var status = makeServiceReport(reportData, reportData.getReportNumber(ReportTypes.RCP), ReportTypes.RCP, item)
	// 	if (status)
	// 		reportData.reportInfo.updateReportNumber(reportData.missionName, ReportTypes.RCP);
	// }
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
		Service: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.SERVICE, item) as string,
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
	// if (filtrationSpecs.Status === "Finalizado") {
	// 	var status = makeServiceReport(reportData, reportData.getReportNumber(ReportTypes.RCP), ReportTypes.RCP, item)
	// 	if (status)
	// 		reportData.reportInfo.updateReportNumber(reportData.missionName, ReportTypes.RCP);
	// }
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
		Service: getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.SERVICE, item) as string,
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
	//   if (tankCleaningSpecs.Status === "Finalizado") {
	// 	  var status = makeServiceReport(reportData, reportData.getReportNumber(ReportTypes.RLR), ReportTypes.RLR, item)
	// 	  if (status)
	// 		  reportData.reportInfo.updateReportNumber(reportData.missionName, ReportTypes.RLR);
	//   }
}
//#endregion

//#region Inibition

interface InibitionSpecs {
	StartTime: string;
	EndTime: string;
	Equipament: string;
	System: string;
	Service: string;
	Obs: string;
	Size: string;
	Steps: string;
	PipeMaterial: string;
	Status: string;
	Code: string;
	DegreaseInterval: string;
	FlushingInterval: string;
	InibitionInterval: string;
}

function fillInibitionStatements(cells: ReportServiceCells, reportState: ReportState): void {
	reportState.setValueToBuffer(cells.PARAM_ONE_KEY, ReportStatements.RDO.PIPE_MATERIAL);
}

function getInibitionSpecs(reportData: ReportData, item: number): InibitionSpecs {
	var inibitionSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormFields.RLI.START, item) as string,
		EndTime: getServiceFieldResponse(reportData, FormFields.RLI.END, item) as string,
		Equipament: getServiceFieldResponse(reportData, FormFields.RLI.EQUIPAMENT, item) as string,
		System: getServiceFieldResponse(reportData, FormFields.RLI.SYSTEM, item) as string,
		Service: getServiceFieldResponse(reportData, FormFields.RLI.SERVICE, item) as string,
		Obs: getInibitionObs(reportData, item) as string,
 	    Size: getServiceFieldResponse(reportData, FormFields.RLI.SIZE, item) as string,
		Steps: getInibitionSteps(reportData, item) as string,
		PipeMaterial: getServiceFieldResponse(reportData,FormFields.RLI.MATERIAL, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormFields.RLI.STATUS, item) as string),
		Code: getServiceFieldResponse(reportData, FormFields.RLI.PIPE_CODE, item) as string,
		DegreaseInterval: getServiceFieldResponse(reportData, FormFields.RLI.DEGREASING_DURATION, item).slice(0, -3) as string,
		FlushingInterval: getServiceFieldResponse(reportData, FormFields.RLI.FLUSHING_DURATION, item).slice(0, -3) as string,
		InibitionInterval: getServiceFieldResponse(reportData, FormFields.RLI.INIBITION_DURATION, item).slice(0, -3) as string
	}
	
	return (inibitionSpecs);
}

function getInibitionObs(reportData: ReportData, item: number): string {
	let code = getServiceFieldResponse(reportData, FormFields.RLI.PIPE_CODE, item);
	
	return (`${code != "" ? `${code}\n`:""}${getServiceFieldResponse(reportData, FormFields.RLI.OBS, item)}`)
}

function getInibitionSteps(reportData: ReportData, item: number): string {
	let steps = [];

	steps.push((getServiceFieldResponse(reportData, FormFields.RLI.DEGREASING, item) === "Sim") ? "Desengraxe":"")
	steps.push((getServiceFieldResponse(reportData, FormFields.RLI.FLUSHING, item) === "Sim") ? "Flushing":"")
	steps.push((getServiceFieldResponse(reportData, FormFields.RLI.INIBITION, item) === "Sim") ? "Aplicação do inibidor":"")

	return (steps.join(", "));
}

function fillInibition(reportData: ReportData, item: number, serviceFieldResponseDb: ServiceFieldResponses): void {
	let cells = ReportCells.RDO.SERVICES[item];
	let inibitionSpecs = getInibitionSpecs(reportData, item);
	const reportState = ReportState.getInstance();

	fillInibitionStatements(cells, reportState)
	reportState.setValueToBuffer(cells.START_TIME, inibitionSpecs.StartTime);
	reportState.setValueToBuffer(cells.END_TIME, inibitionSpecs.EndTime);
	reportState.setValueToBuffer(cells.EQUIPAMENT, inibitionSpecs.Equipament);
	reportState.setValueToBuffer(cells.SYSTEM, inibitionSpecs.System);
	reportState.setValueToBuffer(cells.SERVICE, inibitionSpecs.Service);
	reportState.setValueToBuffer(cells.STATUS, inibitionSpecs.Status);
	reportState.setValueToBuffer(cells.PARAM_ONE, inibitionSpecs.PipeMaterial);
	reportState.setValueToBuffer(cells.STEPS, inibitionSpecs.Steps);
	reportState.setValueToBuffer(cells.OBS, inibitionSpecs.Obs + ((inibitionSpecs.Obs && inibitionSpecs.Size) ? `\n`:"") + inibitionSpecs.Size); //((inibitionSpecs.Obs && inibitionSpecs.Size) ? `\n`:"") + inibitionSpecs.Size)
	reportData.formResponsesDict[item]["DegreaseInterval"] = inibitionSpecs.DegreaseInterval;
	reportData.formResponsesDict[item]["FlushingInterval"] = inibitionSpecs.FlushingInterval;
	reportData.formResponsesDict[item]["InibitionInterval"] = inibitionSpecs.InibitionInterval;

  if (reportState.getIsEdit())
    return ;
	checkServiceProgress(reportData, item, RliServiceDbFields, serviceFieldResponseDb)
	// if (inibitionSpecs.Status === "Finalizado") {
	// 	var status = makeServiceReport(reportData, reportData.getReportNumber(ReportTypes.RLI), ReportTypes.RLI, item)
	// 	if (status)
	// 		reportData.reportInfo.updateReportNumber(reportData.missionName, ReportTypes.RLI);
	// }
}
//#endregion

//#region SERVICE_UTILS
function getServiceFieldResponse(reportData: ReportData, field: string, item: number): fieldResponse {
    return (reportData.searchFieldResponse(field, item));
}

function getStatus(status: string): string {
	if (status === "Sim")
		return ("Finalizado");
	return ("Em andamento");
}

function	mergeValuesAndFormulas(formulas: string[][], values: string[][]): string[][] {
	let result = formulas
	for (var i = 0; i < formulas.length; i++) {
		for (var j = 0; j < formulas[i].length; j++) {
			if (formulas[i][j] === '')
				result[i][j] = values[i][j];
		}
	}
	return (result);
}
//#endregion
