//#region SERVICE HANDLER

function fillServicesFields(reportData: ReportData): void {
	var serviceDbFile = DriveApp.getFileById(serviceDbId);
	serviceDb = JSON.parse(serviceDbFile.getBlob().getDataAsString());
    for (var item = 1; item <= 9; item++) {
        reportData.numOfServices += fillItem(reportData, item);
    }
	serviceDbFile.setContent(JSON.stringify(serviceDb, null, 2));
  // console.log(serviceDb)
}

function fillItem(reportData: ReportData, item: number): number {
    var service = reportData.searchFieldResponse(FormServicesFields.Service, item)
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

function makeServiceReport(reportData: ReportData, reportNumber: number, type: number, item: number) {
	var reportId = reportData.formResponse.getId();
  var serviceObject = reportData.formResponsesDict[item];
	// try {
	let status = sendPostRequest(reportId, reportNumber, type, item, serviceObject);
	return (status);
  
	// } catch (error) {
	 // Logger.log(`Could not make ${Object.keys(ReportTypes)[type]} ${error}`)
	// }

}

//#endregion

//#region PRESSURE TEST
function	fillPressureTestStatements(cells: ReportServiceCells): void {
	setValueToBuffer(cells.ParamOneKey, ReportServiceStatements.WorkPressure);
	setValueToBuffer(cells.ParamTwoKey, ReportServiceStatements.TestPressure);
	setValueToBuffer(cells.InfoKey, ReportServiceStatements.Fluid);
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
		StartTime: getServiceFieldResponse(reportData, FormServicesFields.Start, item) as string,
		EndTime: getServiceFieldResponse(reportData, FormServicesFields.End, item) as string,
		Equipament: getServiceFieldResponse(reportData, FormServicesFields.Equipament, item) as string,
		System: getServiceFieldResponse(reportData, FormServicesFields.System, item) as string,
		Service: getServiceFieldResponse(reportData, FormServicesFields.Service, item) as string,
		Fluid: getServiceFieldResponse(reportData, FormServicesFields.Fluid, item) as string,
		Obs: getServiceFieldResponse(reportData, FormServicesFields.Obs, item) as string,
		Steps:getServiceFieldResponse(reportData, FormServicesFields.Steps, item) as string[],
		WorkPressure: getServiceFieldResponse(reportData, FormServicesFields.WorkPressure, item) as string,
		TestPressure: getServiceFieldResponse(reportData, FormServicesFields.TestPressure, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormServicesFields.Status, item) as string) as string,
		TotalTime: hoursToHourString(getDiffHour(getServiceFieldResponse(reportData, FormServicesFields.Start, item) as string, getServiceFieldResponse(reportData, FormServicesFields.End, item) as string))
	}
	
	return (pressureTestSpecs);
}

function	fillPressureTest(reportData: ReportData, item: number): void {
	var cells = ReportServiceRespCells[item];
	var pressureTestSpecs = getPressureTestSpecs(reportData, item);
	fillPressureTestStatements(cells);
	setValueToBuffer(cells.StartTime, pressureTestSpecs.StartTime);
	setValueToBuffer(cells.EndTime, pressureTestSpecs.EndTime);
	setValueToBuffer(cells.Equipament, pressureTestSpecs.Equipament);
	setValueToBuffer(cells.System, pressureTestSpecs.System);
	setValueToBuffer(cells.Service, pressureTestSpecs.Service);
	setValueToBuffer(cells.Status, pressureTestSpecs.Status);
	setValueToBuffer(cells.ParamOne, pressureTestSpecs.WorkPressure);
	setValueToBuffer(cells.ParamTwo, pressureTestSpecs.TestPressure);
	setValueToBuffer(cells.Info, pressureTestSpecs.Fluid);
	setValueToBuffer(cells.Steps, pressureTestSpecs.Steps.join(", "));
	setValueToBuffer(cells.Obs, pressureTestSpecs.Obs);
	reportData.formResponsesDict[item]["TotalTime"] = pressureTestSpecs.TotalTime;

  if (isEdit)
    return ;
	checkServiceProgress(reportData, item, RtpServiceDbFields)
	if (pressureTestSpecs.Status === "Finalizado") {
		var status = makeServiceReport(reportData, reportData.getRTPNumber(), ReportTypes.RTP, item)
		if (status)
			reportData.reportInfo.updateRTP(reportData.missionName)
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

function fillDescalingStatements(cells: ReportServiceCells): void {
	setValueToBuffer(cells.ParamOneKey, ReportServiceStatements.PipeMaterial);
}

function getDescalingSpecs(reportData: ReportData, item: number): DescalingSpecs {
	var descalingSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormServicesFields.Start, item) as string,
		EndTime: getServiceFieldResponse(reportData, FormServicesFields.End, item) as string,
		Equipament: getServiceFieldResponse(reportData, FormServicesFields.Equipament, item) as string,
		System: getServiceFieldResponse(reportData, FormServicesFields.System, item) as string,
		Service: getServiceFieldResponse(reportData, FormServicesFields.Service, item) as string,
		Obs: getServiceFieldResponse(reportData, FormServicesFields.Obs, item) as string,
   		Size: getServiceFieldResponse(reportData, FormServicesFields.Size, item) as string,
		Steps:getServiceFieldResponse(reportData, FormServicesFields.Steps, item) as string[],
		PipeMaterial: getServiceFieldResponse(reportData, FormServicesFields.PipeMaterial, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormServicesFields.Status, item) as string)
	}
	
	return (descalingSpecs);
}

function fillDescaling(reportData: ReportData, item: number): void {
	var cells = ReportServiceRespCells[item];
	var descalingSpecs = getDescalingSpecs(reportData, item);
	fillDescalingStatements(cells)
	setValueToBuffer(cells.StartTime, descalingSpecs.StartTime);
	setValueToBuffer(cells.EndTime, descalingSpecs.EndTime);
	setValueToBuffer(cells.Equipament, descalingSpecs.Equipament);
	setValueToBuffer(cells.System, descalingSpecs.System);
	setValueToBuffer(cells.Service, descalingSpecs.Service);
	setValueToBuffer(cells.Status, descalingSpecs.Status);
	setValueToBuffer(cells.ParamOne, descalingSpecs.PipeMaterial);
	setValueToBuffer(cells.Steps, descalingSpecs.Steps.join(", "));
	setValueToBuffer(cells.Obs, descalingSpecs.Obs + (descalingSpecs.Obs && descalingSpecs.Size) ? `\n`:"" + descalingSpecs.Size);

  if (isEdit)
    return ;
	checkServiceProgress(reportData, item, RlqServiceDbFields)
	if (descalingSpecs.Status === "Finalizado") {
		var status = makeServiceReport(reportData, reportData.getRLQNumber(), ReportTypes.RLQ, item)
		if (status)
			reportData.reportInfo.updateRLQ(reportData.missionName)
	}
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
	setValueToBuffer(cells.ParamOneKey, ReportServiceStatements.InicialAnalysis);
	setValueToBuffer(cells.ParamTwoKey, ReportServiceStatements.FinalAnalysis);
	setValueToBuffer(cells.InfoKey, ReportServiceStatements.Oil);
}

function getFlushingSpecs(reportData: ReportData, item: number): FlushingSpecs {
	var flushingSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormServicesFields.Start, item) as string,
		EndTime: getServiceFieldResponse(reportData, FormServicesFields.End, item) as string,
		Equipament: getServiceFieldResponse(reportData, FormServicesFields.Equipament, item) as string,
		System: getServiceFieldResponse(reportData, FormServicesFields.System, item) as string,
		Type: getServiceFieldResponse(reportData, FormServicesFields.Type, item) as string,
		Service: getServiceFieldResponse(reportData, FormServicesFields.Service, item) as string,
		Obs: getServiceFieldResponse(reportData, FormServicesFields.Obs, item) as string,
		Steps:getServiceFieldResponse(reportData, FormServicesFields.Steps, item) as string[],
		InicialPartCount: getServiceFieldResponse(reportData, FormServicesFields.InicialPartCount, item) as string,
		OilNorm: getServiceFieldResponse(reportData, FormServicesFields.OilNorm, item) as string,
		FinalPartCount: getServiceFieldResponse(reportData, FormServicesFields.FinalPartCount, item) as string,
		Oil: getServiceFieldResponse(reportData, FormServicesFields.Oil, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormServicesFields.Status, item) as string),
		TotalTime: hoursToHourString(getDiffHour(getServiceFieldResponse(reportData, FormServicesFields.Start, item) as string, getServiceFieldResponse(reportData, FormServicesFields.End, item) as string))
	}
	
	return (flushingSpecs);
}

function fillFlushing(reportData: ReportData, item: number): void {
	var cells = ReportServiceRespCells[item];
	var flushingSpecs = getFlushingSpecs(reportData, item);
	fillFlushingStatements(cells)
	setValueToBuffer(cells.StartTime, flushingSpecs.StartTime);
	setValueToBuffer(cells.EndTime, flushingSpecs.EndTime);
	setValueToBuffer(cells.Equipament, flushingSpecs.Equipament);
	setValueToBuffer(cells.System, flushingSpecs.System);
	setValueToBuffer(cells.Service, flushingSpecs.Service + " " + flushingSpecs.Type);
	setValueToBuffer(cells.Status, flushingSpecs.Status);
	setValueToBuffer(cells.ParamOne, `\'${(flushingSpecs.OilNorm == null ? "" : flushingSpecs.OilNorm)} ${flushingSpecs.InicialPartCount}`);
	setValueToBuffer(cells.ParamTwo, `\'${(flushingSpecs.OilNorm == null ? "" : flushingSpecs.OilNorm)} ${flushingSpecs.FinalPartCount}`);
	setValueToBuffer(cells.Info, flushingSpecs.Oil);
	setValueToBuffer(cells.Steps, flushingSpecs.Steps.join(", "));
	setValueToBuffer(cells.Obs, flushingSpecs.Obs);
	reportData.formResponsesDict[item]["TotalTime"] = flushingSpecs.TotalTime;

  	if (isEdit)
   		return ;
	checkServiceProgress(reportData, item, RcpServiceDbFields)
	if (flushingSpecs.Status === "Finalizado") {
		var status = makeServiceReport(reportData, reportData.getRCPNumber(), ReportTypes.RCP, item)
		if (status)
			reportData.reportInfo.updateRCP(reportData.missionName)
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

function fillFiltrationStatements(cells: ReportServiceCells): void {
	setValueToBuffer(cells.ParamOneKey, ReportServiceStatements.InicialAnalysis);
	setValueToBuffer(cells.ParamTwoKey, ReportServiceStatements.FinalAnalysis);
	setValueToBuffer(cells.InfoKey, ReportServiceStatements.Volume);
}

function getFiltrationSpecs(reportData: ReportData, item: number): FiltrationSpecs {
	var filtrationSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormServicesFields.Start, item) as string,
		EndTime: getServiceFieldResponse(reportData, FormServicesFields.End, item) as string,
		Equipament: getServiceFieldResponse(reportData, FormServicesFields.Equipament, item) as string,
		System: getServiceFieldResponse(reportData, FormServicesFields.System, item) as string,
		Service: getServiceFieldResponse(reportData, FormServicesFields.Service, item) as string,
		Obs: getServiceFieldResponse(reportData, FormServicesFields.Obs, item) as string,
		Steps:getServiceFieldResponse(reportData, FormServicesFields.Steps, item) as string[],
		OilNorm: getServiceFieldResponse(reportData, FormServicesFields.OilNorm, item) as string,
		InicialPartCount: getServiceFieldResponse(reportData, FormServicesFields.InicialPartCount, item) as string,
		FinalPartCount: getServiceFieldResponse(reportData, FormServicesFields.FinalPartCount, item) as string,
		Volume: getServiceFieldResponse(reportData, FormServicesFields.Volume, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormServicesFields.Status, item) as string),
		TotalTime: hoursToHourString(getDiffHour(getServiceFieldResponse(reportData, FormServicesFields.Start, item) as string, getServiceFieldResponse(reportData, FormServicesFields.End, item) as string))
	}
	
	return (filtrationSpecs);
}

function fillFiltration(reportData: ReportData, item: number): void {
	var cells = ReportServiceRespCells[item];
	var filtrationSpecs = getFiltrationSpecs(reportData, item);
	fillFiltrationStatements(cells)
	setValueToBuffer(cells.StartTime, filtrationSpecs.StartTime);
	setValueToBuffer(cells.EndTime, filtrationSpecs.EndTime);
	setValueToBuffer(cells.Equipament, filtrationSpecs.Equipament);
	setValueToBuffer(cells.System, filtrationSpecs.System);
	setValueToBuffer(cells.Service, filtrationSpecs.Service);
	setValueToBuffer(cells.Status, filtrationSpecs.Status);
	setValueToBuffer(cells.ParamOne, `\'${(filtrationSpecs.OilNorm == null ? "" : filtrationSpecs.OilNorm)} ${filtrationSpecs.InicialPartCount}`);
	setValueToBuffer(cells.ParamTwo, `\'${(filtrationSpecs.OilNorm == null ? "" : filtrationSpecs.OilNorm)} ${filtrationSpecs.FinalPartCount}`);
	setValueToBuffer(cells.Info, filtrationSpecs.Volume);
	setValueToBuffer(cells.Steps, filtrationSpecs.Steps.join(", "));
	setValueToBuffer(cells.Obs, filtrationSpecs.Obs);
	reportData.formResponsesDict[item]["TotalTime"] = filtrationSpecs.TotalTime;

  if (isEdit)
      return ;
	checkServiceProgress(reportData, item, RcpServiceDbFields)
	if (filtrationSpecs.Status === "Finalizado") {
		var status = makeServiceReport(reportData, reportData.getRCPNumber(), ReportTypes.RCP, item)
		if (status)
			reportData.reportInfo.updateRCP(reportData.missionName)
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

function fillTankCleaningStatements(cells: ReportServiceCells): void {
	setValueToBuffer(cells.ParamOneKey, ReportServiceStatements.TankMaterial);
}

function getTankCleaningSpecs(reportData: ReportData, item: number): TankCleaningSpecs {
	var descalingSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormServicesFields.Start, item) as string,
		EndTime: getServiceFieldResponse(reportData, FormServicesFields.End, item) as string,
		Equipament: getServiceFieldResponse(reportData, FormServicesFields.Equipament, item) as string,
		System: getServiceFieldResponse(reportData, FormServicesFields.System, item) as string,
		Service: getServiceFieldResponse(reportData, FormServicesFields.Service, item) as string,
		Obs: getServiceFieldResponse(reportData, FormServicesFields.Obs, item) as string,
		Steps:getServiceFieldResponse(reportData, FormServicesFields.Steps, item) as string[],
		tankMaterial: getServiceFieldResponse(reportData, FormServicesFields.TankMaterial, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormServicesFields.Status, item) as string)
	}
	
	return (descalingSpecs);
}

function fillTankCleaning(reportData: ReportData, item: number): void {
	var cells = ReportServiceRespCells[item];
	var tankCleaningSpecs = getTankCleaningSpecs(reportData, item);
	fillTankCleaningStatements(cells)
	setValueToBuffer(cells.StartTime, tankCleaningSpecs.StartTime);
	setValueToBuffer(cells.EndTime, tankCleaningSpecs.EndTime);
	setValueToBuffer(cells.Equipament, tankCleaningSpecs.Equipament);
	setValueToBuffer(cells.System, tankCleaningSpecs.System);
	setValueToBuffer(cells.Service, tankCleaningSpecs.Service);
	setValueToBuffer(cells.Status, tankCleaningSpecs.Status);
	setValueToBuffer(cells.Steps, tankCleaningSpecs.Steps.join(", "));
	setValueToBuffer(cells.Obs, tankCleaningSpecs.Obs);

	if (isEdit)
		return ;
	  checkServiceProgress(reportData, item, RlrServiceDbFields)
	  if (tankCleaningSpecs.Status === "Finalizado") {
		  var status = makeServiceReport(reportData, reportData.getRLRNumber(), ReportTypes.RLR, item)
		  if (status)
			  reportData.reportInfo.updateRLR(reportData.missionName)
	  }
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
	setValueToBuffer(cells.ParamOneKey, ReportServiceStatements.PipeMaterial);
}

function getInibitionSpecs(reportData: ReportData, item: number): InibitionSpecs {
	var inibitionSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormRLIFields.Start, item) as string,
		EndTime: getServiceFieldResponse(reportData, FormRLIFields.End, item) as string,
		Equipament: getServiceFieldResponse(reportData, FormRLIFields.Equipament, item) as string,
		System: getServiceFieldResponse(reportData, FormRLIFields.System, item) as string,
		Service: getServiceFieldResponse(reportData, FormRLIFields.Service, item) as string,
		Obs: getInibitionObs(reportData, item) as string,
 	    Size: getServiceFieldResponse(reportData, FormRLIFields.Size, item) as string,
		Steps: getInibitionSteps(reportData, item) as string,
		PipeMaterial: getServiceFieldResponse(reportData, FormRLIFields.Material, item) as string,
		Status: getStatus(getServiceFieldResponse(reportData, FormRLIFields.Status, item) as string),
		Code: getServiceFieldResponse(reportData, FormRLIFields.Code, item) as string,
		DegreaseInterval: getServiceFieldResponse(reportData, FormRLIFields.DegreasingDuration, item).slice(0, -3) as string,
		FlushingInterval: getServiceFieldResponse(reportData, FormRLIFields.FlushingDuration, item).slice(0, -3) as string,
		InibitionInterval: getServiceFieldResponse(reportData, FormRLIFields.InibitionDuration, item).slice(0, -3) as string
	}
	
	return (inibitionSpecs);
}

function getInibitionObs(reportData: ReportData, item: number): string {
	let code = getServiceFieldResponse(reportData, FormRLIFields.Code, item);
	
	return (`${code != "" ? `${code}\n`:""}${getServiceFieldResponse(reportData, FormRLIFields.Obs, item)}`)
}

function getInibitionSteps(reportData: ReportData, item: number): string {
	let steps = [];

	steps.push((getServiceFieldResponse(reportData, FormRLIFields.Degreasing, item) === "Sim") ? "Desengraxe":"")
	steps.push((getServiceFieldResponse(reportData, FormRLIFields.Flushing, item) === "Sim") ? "Flushing":"")
	steps.push((getServiceFieldResponse(reportData, FormRLIFields.Inibition, item) === "Sim") ? "Aplicação do inibidor":"")

	return (steps.join(", "));
}

function fillInibition(reportData: ReportData, item: number): void {
	var cells = ReportServiceRespCells[item];
	var inibitionSpecs = getInibitionSpecs(reportData, item);
	fillInibitionStatements(cells)
	setValueToBuffer(cells.StartTime, inibitionSpecs.StartTime);
	setValueToBuffer(cells.EndTime, inibitionSpecs.EndTime);
	setValueToBuffer(cells.Equipament, inibitionSpecs.Equipament);
	setValueToBuffer(cells.System, inibitionSpecs.System);
	setValueToBuffer(cells.Service, inibitionSpecs.Service);
	setValueToBuffer(cells.Status, inibitionSpecs.Status);
	setValueToBuffer(cells.ParamOne, inibitionSpecs.PipeMaterial);
	setValueToBuffer(cells.Steps, inibitionSpecs.Steps);
	setValueToBuffer(cells.Obs, inibitionSpecs.Obs + ((inibitionSpecs.Obs && inibitionSpecs.Size) ? `\n`:"") + inibitionSpecs.Size); //((inibitionSpecs.Obs && inibitionSpecs.Size) ? `\n`:"") + inibitionSpecs.Size)
	reportData.formResponsesDict[item]["DegreaseInterval"] = inibitionSpecs.DegreaseInterval;
	reportData.formResponsesDict[item]["FlushingInterval"] = inibitionSpecs.FlushingInterval;
	reportData.formResponsesDict[item]["InibitionInterval"] = inibitionSpecs.InibitionInterval;

  if (isEdit)
    return ;
	checkServiceProgress(reportData, item, RliServiceDbFields)
	if (inibitionSpecs.Status === "Finalizado") {
		var status = makeServiceReport(reportData, reportData.getRLINumber(), ReportTypes.RLI, item)
		if (status)
			reportData.reportInfo.updateRLI(reportData.missionName)
	}
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
