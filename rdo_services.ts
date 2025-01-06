//#region SERVICE HANDLER

function fillServicesFields(reportData: ReportData): void {
	var serviceDbFile = DriveApp.getFileById(ReportJSONIds.SERVICE_DB_ID);
	ReportState.serviceDb = JSON.parse(serviceDbFile.getBlob().getDataAsString());
    for (var item = 1; item <= 9; item++) {
        reportData.numOfServices += fillItem(reportData, item);
    }
	serviceDbFile.setContent(JSON.stringify(ReportState.serviceDb, null, 2));
  // console.log(serviceDb)
}

function fillItem(reportData: ReportData, item: number): number {
    var service = reportData.searchFieldResponse(FormFields.SERVICES.SERVICE, item)
	if (service === "Teste de pressão")
		fillPressureTest(reportData, item);
	else if (service === "Limpeza química")
		fillDescaling(reportData, item)
	else if (service === "Flushing")
		fillFlushing(reportData, item);
	else if (service === "Filtragem absoluta")
		fillFiltration(reportData, item)
	else if (service === "Limpeza de reservatório")
		fillTankCleaning(reportData, item)
	else if (service === "Limpeza e inibição")
		fillInibition(reportData, item)
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
function	fillPressureTestStatements(cells: ReportServiceCells): void {
	ReportState.setValueToBuffer(cells.PARAM_ONE_KEY, ReportsRanges.RDO.SERVICES.STATEMENTS.WORK_PRESSURE);
	ReportState.setValueToBuffer(cells.PARAM_TWO_KEY, ReportsRanges.RDO.SERVICES.STATEMENTS.TEST_PRESSURE);
	ReportState.setValueToBuffer(cells.INFO_KEY, ReportsRanges.RDO.SERVICES.STATEMENTS.FLUID_TYPE);
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
		StartTime: getServiceFieldResponse(reportData, FormFields.SERVICES.START_TIME, item) as string,
		EndTime: getServiceFieldResponse(reportData,FormFields.SERVICES.END_TIME, item) as string,
		Equipament: getServiceFieldResponse(reportData, FormFields.SERVICES.EQUIPAMENT, item) as string,
		System: getServiceFieldResponse(reportData, FormFields.SERVICES.SYSTEM, item) as string,
		Service: getServiceFieldResponse(reportData, FormFields.SERVICES.SERVICE, item) as string,
		Fluid: getServiceFieldResponse(reportData, FormFields.SERVICES.FLUID_TYPE, item) as string,
		Obs: getServiceFieldResponse(reportData,FormFields.SERVICES.OBS, item) as string,
		Steps:getServiceFieldResponse(reportData,FormFields.SERVICES.STEPS, item) as string[],
		WorkPressure: getServiceFieldResponse(reportData, FormFields.SERVICES.WORK_PRESSURE, item) as string,
		TestPressure: getServiceFieldResponse(reportData, FormFields.SERVICES.TEST_PRESSURE, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormFields.SERVICES.STATUS, item) as string) as string,
		TotalTime: hoursToHourString(getDiffHour(getServiceFieldResponse(reportData, FormFields.SERVICES.START_TIME, item) as string, getServiceFieldResponse(reportData, FormFields.SERVICES.END_TIME, item) as string))
	}
	
	return (pressureTestSpecs);
}

function	fillPressureTest(reportData: ReportData, item: number): void {
	var cells = ReportsRanges.RDO.CELLS.SERVICES[item];
	var pressureTestSpecs = getPressureTestSpecs(reportData, item);
	fillPressureTestStatements(cells);
	ReportState.setValueToBuffer(cells.START_TIME, pressureTestSpecs.StartTime);
	ReportState.setValueToBuffer(cells.END_TIME, pressureTestSpecs.EndTime);
	ReportState.setValueToBuffer(cells.EQUIPAMENT, pressureTestSpecs.Equipament);
	ReportState.setValueToBuffer(cells.SYSTEM, pressureTestSpecs.System);
	ReportState.setValueToBuffer(cells.SERVICE, pressureTestSpecs.Service);
	ReportState.setValueToBuffer(cells.STATUS, pressureTestSpecs.Status);
	ReportState.setValueToBuffer(cells.PARAM_ONE, pressureTestSpecs.WorkPressure);
	ReportState.setValueToBuffer(cells.PARAM_TWO, pressureTestSpecs.TestPressure);
	ReportState.setValueToBuffer(cells.INFO, pressureTestSpecs.Fluid);
	ReportState.setValueToBuffer(cells.STEPS, pressureTestSpecs.Steps.join(", "));
	ReportState.setValueToBuffer(cells.OBS, pressureTestSpecs.Obs);
	reportData.formResponsesDict[item]["TotalTime"] = pressureTestSpecs.TotalTime;

  if (ReportState.isEdit)
    return ;
	checkServiceProgress(reportData, item, RtpServiceDbFields)
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

function fillDescalingStatements(cells: ReportServiceCells): void {
	ReportState.setValueToBuffer(cells.PARAM_ONE, ReportsRanges.RDO.SERVICES.STATEMENTS.PIPE_MATERIAL);
}

function getDescalingSpecs(reportData: ReportData, item: number): DescalingSpecs {
	var descalingSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormFields.SERVICES.START_TIME, item) as string,
		EndTime: getServiceFieldResponse(reportData, FormFields.SERVICES.END_TIME, item) as string,
		Equipament: getServiceFieldResponse(reportData,FormFields.SERVICES.EQUIPAMENT, item) as string,
		System: getServiceFieldResponse(reportData, FormFields.SERVICES.SYSTEM, item) as string,
		Service: getServiceFieldResponse(reportData, FormFields.SERVICES.SERVICE, item) as string,
		Obs: getServiceFieldResponse(reportData, FormFields.SERVICES.OBS, item) as string,
   		Size: getServiceFieldResponse(reportData, FormFields.SERVICES.SIZE, item) as string,
		Steps:getServiceFieldResponse(reportData, FormFields.SERVICES.STEPS, item) as string[],
		PipeMaterial: getServiceFieldResponse(reportData, FormFields.SERVICES.PIPE_MATERIAL, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormFields.SERVICES.STATUS, item) as string)
	}
	
	return (descalingSpecs);
}

function fillDescaling(reportData: ReportData, item: number): void {
	var cells = ReportsRanges.RDO.CELLS.SERVICES[item];
	var descalingSpecs = getDescalingSpecs(reportData, item);
	fillDescalingStatements(cells)
	ReportState.setValueToBuffer(cells.START_TIME, descalingSpecs.StartTime);
	ReportState.setValueToBuffer(cells.END_TIME, descalingSpecs.EndTime);
	ReportState.setValueToBuffer(cells.EQUIPAMENT, descalingSpecs.Equipament);
	ReportState.setValueToBuffer(cells.SYSTEM, descalingSpecs.System);
	ReportState.setValueToBuffer(cells.SERVICE, descalingSpecs.Service);
	ReportState.setValueToBuffer(cells.STATUS, descalingSpecs.Status);
	ReportState.setValueToBuffer(cells.PARAM_ONE, descalingSpecs.PipeMaterial);
	ReportState.setValueToBuffer(cells.STEPS, descalingSpecs.Steps.join(", "));
	ReportState.setValueToBuffer(cells.OBS, descalingSpecs.Obs + (descalingSpecs.Obs && descalingSpecs.Size) ? `\n`:"" + descalingSpecs.Size);

  if (ReportState.isEdit)
    return ;
	checkServiceProgress(reportData, item, RlqServiceDbFields)
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

function fillFlushingStatements(cells: ReportServiceCells): void {
	ReportState.setValueToBuffer(cells.PARAM_ONE_KEY, ReportsRanges.RDO.SERVICES.STATEMENTS.INICIAL_ANALYSIS);
	ReportState.setValueToBuffer(cells.PARAM_TWO_KEY, ReportsRanges.RDO.SERVICES.STATEMENTS.FINAL_ANALYSIS);
	ReportState.setValueToBuffer(cells.INFO_KEY,ReportsRanges.RDO.SERVICES.STATEMENTS.OIL);
}

function getFlushingSpecs(reportData: ReportData, item: number): FlushingSpecs {
	var flushingSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormFields.SERVICES.START_TIME, item) as string,
		EndTime: getServiceFieldResponse(reportData, FormFields.SERVICES.END_TIME, item) as string,
		Equipament: getServiceFieldResponse(reportData, FormFields.SERVICES.EQUIPAMENT, item) as string,
		System: getServiceFieldResponse(reportData, FormFields.SERVICES.SYSTEM, item) as string,
		Type: getServiceFieldResponse(reportData, FormFields.SERVICES.FLUSHING_TYPE, item) as string,
		Service: getServiceFieldResponse(reportData, FormFields.SERVICES.SERVICE, item) as string,
		Obs: getServiceFieldResponse(reportData, FormFields.SERVICES.OBS, item) as string,
		Steps:getServiceFieldResponse(reportData, FormFields.SERVICES.STEPS, item) as string[],
		InicialPartCount: getServiceFieldResponse(reportData, FormFields.SERVICES.INICIAL_PART_COUNT, item) as string,
		OilNorm: getServiceFieldResponse(reportData, FormFields.SERVICES.OIL_NORM, item) as string,
		FinalPartCount: getServiceFieldResponse(reportData, FormFields.SERVICES.FINAL_PART_COUNT, item) as string,
		Oil: getServiceFieldResponse(reportData, FormFields.SERVICES.OIL, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormFields.SERVICES.STATUS, item) as string),
		TotalTime: hoursToHourString(getDiffHour(getServiceFieldResponse(reportData, FormFields.SERVICES.START_TIME, item) as string, getServiceFieldResponse(reportData, FormFields.SERVICES.END_TIME, item) as string))
	}
	
	return (flushingSpecs);
}

function fillFlushing(reportData: ReportData, item: number): void {
	var cells = ReportsRanges.RDO.CELLS.SERVICES[item];
	var flushingSpecs = getFlushingSpecs(reportData, item);
	fillFlushingStatements(cells)
	ReportState.setValueToBuffer(cells.START_TIME, flushingSpecs.StartTime);
	ReportState.setValueToBuffer(cells.END_TIME, flushingSpecs.EndTime);
	ReportState.setValueToBuffer(cells.EQUIPAMENT, flushingSpecs.Equipament);
	ReportState.setValueToBuffer(cells.SYSTEM, flushingSpecs.System);
	ReportState.setValueToBuffer(cells.STATUS, flushingSpecs.Status);
	ReportState.setValueToBuffer(cells.PARAM_ONE, `\'${(flushingSpecs.OilNorm == null ? "" : flushingSpecs.OilNorm)} ${flushingSpecs.InicialPartCount}`);
	ReportState.setValueToBuffer(cells.PARAM_TWO, `\'${(flushingSpecs.OilNorm == null ? "" : flushingSpecs.OilNorm)} ${flushingSpecs.FinalPartCount}`);
	ReportState.setValueToBuffer(cells.INFO, flushingSpecs.Oil);
	ReportState.setValueToBuffer(cells.STEPS, flushingSpecs.Steps.join(", "));
	ReportState.setValueToBuffer(cells.OBS, flushingSpecs.Obs);
	reportData.formResponsesDict[item]["TotalTime"] = flushingSpecs.TotalTime;

  	if (ReportState.isEdit)
   		return ;
	checkServiceProgress(reportData, item, RcpServiceDbFields)
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

function fillFiltrationStatements(cells: ReportServiceCells): void {
	ReportState.setValueToBuffer(cells.PARAM_ONE, ReportsRanges.RDO.SERVICES.STATEMENTS.INICIAL_ANALYSIS);
	ReportState.setValueToBuffer(cells.PARAM_TWO_KEY, ReportsRanges.RDO.SERVICES.STATEMENTS.FINAL_ANALYSIS);
	ReportState.setValueToBuffer(cells.INFO_KEY, ReportsRanges.RDO.SERVICES.STATEMENTS.VOLUME);
}

function getFiltrationSpecs(reportData: ReportData, item: number): FiltrationSpecs {
	var filtrationSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormFields.SERVICES.START_TIME, item) as string,
		EndTime: getServiceFieldResponse(reportData, FormFields.SERVICES.END_TIME, item) as string,
		Equipament: getServiceFieldResponse(reportData, FormFields.SERVICES.EQUIPAMENT, item) as string,
		System: getServiceFieldResponse(reportData, FormFields.SERVICES.SYSTEM, item) as string,
		Service: getServiceFieldResponse(reportData, FormFields.SERVICES.SERVICE, item) as string,
		Obs: getServiceFieldResponse(reportData, FormFields.SERVICES.OBS, item) as string,
		Steps:getServiceFieldResponse(reportData, FormFields.SERVICES.STEPS, item) as string[],
		OilNorm: getServiceFieldResponse(reportData, FormFields.SERVICES.OIL_NORM, item) as string,
		InicialPartCount: getServiceFieldResponse(reportData, FormFields.SERVICES.INICIAL_PART_COUNT, item) as string,
		FinalPartCount: getServiceFieldResponse(reportData, FormFields.SERVICES.FINAL_PART_COUNT, item) as string,
		Volume: getServiceFieldResponse(reportData, FormFields.SERVICES.VOLUME, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormFields.SERVICES.STATUS, item) as string),
		TotalTime: hoursToHourString(getDiffHour(getServiceFieldResponse(reportData, FormFields.SERVICES.START_TIME, item) as string, getServiceFieldResponse(reportData, FormFields.SERVICES.END_TIME, item) as string))
	}
	
	return (filtrationSpecs);
}

function fillFiltration(reportData: ReportData, item: number): void {
	var cells = ReportsRanges.RDO.CELLS.SERVICES[item];
	var filtrationSpecs = getFiltrationSpecs(reportData, item);
	fillFiltrationStatements(cells)
	ReportState.setValueToBuffer(cells.START_TIME, filtrationSpecs.StartTime);
	ReportState.setValueToBuffer(cells.END_TIME, filtrationSpecs.EndTime);
	ReportState.setValueToBuffer(cells.EQUIPAMENT, filtrationSpecs.Equipament);
	ReportState.setValueToBuffer(cells.SYSTEM, filtrationSpecs.System);
	ReportState.setValueToBuffer(cells.SERVICE, filtrationSpecs.Service);
	ReportState.setValueToBuffer(cells.STATUS, filtrationSpecs.Status);
	ReportState.setValueToBuffer(cells.PARAM_ONE, `\'${(filtrationSpecs.OilNorm == null ? "" : filtrationSpecs.OilNorm)} ${filtrationSpecs.InicialPartCount}`);
	ReportState.setValueToBuffer(cells.PARAM_TWO, `\'${(filtrationSpecs.OilNorm == null ? "" : filtrationSpecs.OilNorm)} ${filtrationSpecs.FinalPartCount}`);
	ReportState.setValueToBuffer(cells.INFO, filtrationSpecs.Volume);
	ReportState.setValueToBuffer(cells.STEPS, filtrationSpecs.Steps.join(", "));
	ReportState.setValueToBuffer(cells.OBS, filtrationSpecs.Obs);
	reportData.formResponsesDict[item]["TotalTime"] = filtrationSpecs.TotalTime;

  if (ReportState.isEdit)
      return ;
	checkServiceProgress(reportData, item, RcpServiceDbFields)
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

function fillTankCleaningStatements(cells: ReportServiceCells): void {
	ReportState.setValueToBuffer(cells.PARAM_ONE_KEY, ReportsRanges.RDO.SERVICES.STATEMENTS.TANK_MATERIAL);
}

function getTankCleaningSpecs(reportData: ReportData, item: number): TankCleaningSpecs {
	var descalingSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormFields.SERVICES.START_TIME, item) as string,
		EndTime: getServiceFieldResponse(reportData, FormFields.SERVICES.END_TIME, item) as string,
		Equipament: getServiceFieldResponse(reportData, FormFields.SERVICES.EQUIPAMENT, item) as string,
		System: getServiceFieldResponse(reportData, FormFields.SERVICES.SYSTEM, item) as string,
		Service: getServiceFieldResponse(reportData, FormFields.SERVICES.SERVICE, item) as string,
		Obs: getServiceFieldResponse(reportData, FormFields.SERVICES.OBS, item) as string,
		Steps:getServiceFieldResponse(reportData, FormFields.SERVICES.STEPS, item) as string[],
		tankMaterial: getServiceFieldResponse(reportData, FormFields.SERVICES.TANK_MATERIAL, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormFields.SERVICES.STATUS, item) as string)
	}
	
	return (descalingSpecs);
}

function fillTankCleaning(reportData: ReportData, item: number): void {
	var cells = ReportsRanges.RDO.CELLS.SERVICES[item];
	var tankCleaningSpecs = getTankCleaningSpecs(reportData, item);
	fillTankCleaningStatements(cells)
	ReportState.setValueToBuffer(cells.START_TIME, tankCleaningSpecs.StartTime);
	ReportState.setValueToBuffer(cells.END_TIME, tankCleaningSpecs.EndTime);
	ReportState.setValueToBuffer(cells.EQUIPAMENT, tankCleaningSpecs.Equipament);
	ReportState.setValueToBuffer(cells.SYSTEM, tankCleaningSpecs.System);
	ReportState.setValueToBuffer(cells.SERVICE, tankCleaningSpecs.Service);
	ReportState.setValueToBuffer(cells.STATUS, tankCleaningSpecs.Status);
	ReportState.setValueToBuffer(cells.STEPS, tankCleaningSpecs.Steps.join(", "));
	ReportState.setValueToBuffer(cells.OBS, tankCleaningSpecs.Obs);

	if (ReportState.isEdit)
		return ;
	  checkServiceProgress(reportData, item, RlrServiceDbFields)
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

function fillInibitionStatements(cells: ReportServiceCells): void {
	ReportState.setValueToBuffer(cells.PARAM_ONE_KEY, ReportsRanges.RDO.SERVICES.STATEMENTS.PIPE_MATERIAL);
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

function fillInibition(reportData: ReportData, item: number): void {
	var cells = ReportsRanges.RDO.CELLS.SERVICES[item];
	var inibitionSpecs = getInibitionSpecs(reportData, item);
	fillInibitionStatements(cells)
	ReportState.setValueToBuffer(cells.START_TIME, inibitionSpecs.StartTime);
	ReportState.setValueToBuffer(cells.END_TIME, inibitionSpecs.EndTime);
	ReportState.setValueToBuffer(cells.EQUIPAMENT, inibitionSpecs.Equipament);
	ReportState.setValueToBuffer(cells.SYSTEM, inibitionSpecs.System);
	ReportState.setValueToBuffer(cells.SERVICE, inibitionSpecs.Service);
	ReportState.setValueToBuffer(cells.STATUS, inibitionSpecs.Status);
	ReportState.setValueToBuffer(cells.PARAM_ONE, inibitionSpecs.PipeMaterial);
	ReportState.setValueToBuffer(cells.STEPS, inibitionSpecs.Steps);
	ReportState.setValueToBuffer(cells.OBS, inibitionSpecs.Obs + ((inibitionSpecs.Obs && inibitionSpecs.Size) ? `\n`:"") + inibitionSpecs.Size); //((inibitionSpecs.Obs && inibitionSpecs.Size) ? `\n`:"") + inibitionSpecs.Size)
	reportData.formResponsesDict[item]["DegreaseInterval"] = inibitionSpecs.DegreaseInterval;
	reportData.formResponsesDict[item]["FlushingInterval"] = inibitionSpecs.FlushingInterval;
	reportData.formResponsesDict[item]["InibitionInterval"] = inibitionSpecs.InibitionInterval;

  if (ReportState.isEdit)
    return ;
	checkServiceProgress(reportData, item, RliServiceDbFields)
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
