//#region SERVICE HANDLER

function fillServicesFields(reportData) {
    for (var item = 1; item <= 6; item++) {
        reportData.numOfServices += fillItem(reportData, item);
    }
}

function fillItem(reportData, item) {
    var service = reportData.searchFieldResponse(FormServicesFields.Service, item - 1)
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
	else
		return (0)
	return (1);
}

function makeServiceReport(reportData, reportNumber, type, item) {
	var reportId = reportData.formResponse.getId();

	try {
		sendPostRequest(reportId, reportNumber, type, item);
		return (true);
  
	} catch (error) {
	  Logger.log(`Could not make ${Object.keys(reportTypes)[type]} ${error}`)
	}
	return (false)
}

//#endregion

//#region PRESSURE TEST
function	fillPressureTestStatements(cells) {
	setValueToBuffer(cells.ParamOneKey, ReportServiceStatements.WorkPressure);
	setValueToBuffer(cells.ParamTwoKey, ReportServiceStatements.TestPressure);
	setValueToBuffer(cells.InfoKey, ReportServiceStatements.Fluid);
}

function getPressureTestSpecs(reportData, item) {
	var pressureTestSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormServicesFields.Start, item - 1),
		EndTime: getServiceFieldResponse(reportData, FormServicesFields.End, item - 1),
		Equipament: getServiceFieldResponse(reportData, FormServicesFields.Equipament, item - 1),
		System: getServiceFieldResponse(reportData, FormServicesFields.System, item - 1),
		Service: getServiceFieldResponse(reportData, FormServicesFields.Service, item - 1),
		Fluid: getServiceFieldResponse(reportData, FormServicesFields.Fluid, counters.TP),
		Obs: getServiceFieldResponse(reportData, FormServicesFields.Obs, item - 1),
		Steps:getServiceFieldResponse(reportData, FormServicesFields.Steps, item - 1),
		WorkPressure: getServiceFieldResponse(reportData, FormServicesFields.WorkPressure, counters.TP),
		TestPressure: getServiceFieldResponse(reportData, FormServicesFields.TestPressure, counters.TP),
		Status: getStatus(getServiceFieldResponse(reportData, FormServicesFields.Status, item - 1))
	}
	
	return (pressureTestSpecs);
}

function	fillPressureTest(reportData, item) {
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

	counters.TP++;
}
//#endregion

//#region DESCALING
function fillDescalingStatements(cells) {
	setValueToBuffer(cells.ParamOneKey, ReportServiceStatements.pipeMaterial);
}

function getDescalingSpecs(reportData, item) {
	var descalingSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormServicesFields.Start, item - 1),
		EndTime: getServiceFieldResponse(reportData, FormServicesFields.End, item - 1),
		Equipament: getServiceFieldResponse(reportData, FormServicesFields.Equipament, item - 1),
		System: getServiceFieldResponse(reportData, FormServicesFields.System, item - 1),
		Service: getServiceFieldResponse(reportData, FormServicesFields.Service, item - 1),
		Obs: getServiceFieldResponse(reportData, FormServicesFields.Obs, item - 1),
		Steps:getServiceFieldResponse(reportData, FormServicesFields.Steps, item - 1),
		PipeMaterial: getServiceFieldResponse(reportData, FormServicesFields.PipeMaterial, counters.LQ),
		Status: getStatus(getServiceFieldResponse(reportData, FormServicesFields.Status, item - 1))
	}
	
	return (descalingSpecs);
}

function fillDescaling(reportData, item) {
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
	setValueToBuffer(cells.Obs, descalingSpecs.Obs);

	var status = makeServiceReport(reportData, reportData.getRLQNumber(), reportTypes.RLQ, item)
	if (status)
		reportData.reportInfo.updateRLQ(reportData.missionName)
	counters.LQ++;
}
//#endregion

//#region FLUSHING
function fillFlushingStatements(cells) {
	setValueToBuffer(cells.ParamOneKey, ReportServiceStatements.InicialAnalysis);
	setValueToBuffer(cells.ParamTwoKey, ReportServiceStatements.FinalAnalysis);
	setValueToBuffer(cells.InfoKey, ReportServiceStatements.Oil);
}

function getFlushingSpecs(reportData, item) {
	var flushingSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormServicesFields.Start, item - 1),
		EndTime: getServiceFieldResponse(reportData, FormServicesFields.End, item - 1),
		Equipament: getServiceFieldResponse(reportData, FormServicesFields.Equipament, item - 1),
		System: getServiceFieldResponse(reportData, FormServicesFields.System, item - 1),
		Type: getServiceFieldResponse(reportData, FormServicesFields.Type, counters.FLU),
		Service: getServiceFieldResponse(reportData, FormServicesFields.Service, item - 1),
		Obs: getServiceFieldResponse(reportData, FormServicesFields.Obs, item - 1),
		Steps:getServiceFieldResponse(reportData, FormServicesFields.Steps, item - 1),
		InicialPartCount: getServiceFieldResponse(reportData, FormServicesFields.InicialPartCount, counters.PC1++),
		FinalPartCount: getServiceFieldResponse(reportData, FormServicesFields.FinalPartCount, counters.PC2++),
		Oil: getServiceFieldResponse(reportData, FormServicesFields.Oil, counters.FLU),
		Status: getStatus(getServiceFieldResponse(reportData, FormServicesFields.Status, item - 1))
	}
	
	return (flushingSpecs);
}

function fillFlushing(reportData, item) {
	var cells = ReportServiceRespCells[item];
	var flushingSpecs = getFlushingSpecs(reportData, item);
	fillFlushingStatements(cells)
	setValueToBuffer(cells.StartTime, flushingSpecs.StartTime);
	setValueToBuffer(cells.EndTime, flushingSpecs.EndTime);
	setValueToBuffer(cells.Equipament, flushingSpecs.Equipament);
	setValueToBuffer(cells.System, flushingSpecs.System);
	setValueToBuffer(cells.Service, flushingSpecs.Service + " " + flushingSpecs.Type);
	setValueToBuffer(cells.Status, flushingSpecs.Status);
	setValueToBuffer(cells.ParamOne, flushingSpecs.InicialPartCount);
	setValueToBuffer(cells.ParamTwo, flushingSpecs.FinalPartCount);
	setValueToBuffer(cells.Info, flushingSpecs.Oil);
	setValueToBuffer(cells.Steps, flushingSpecs.Steps.join(", "));
	setValueToBuffer(cells.Obs, flushingSpecs.Obs);

	counters.FLU++;
}
//#endregion

//#region FILTRATION
function fillFiltrationStatements(cells) {
	setValueToBuffer(cells.ParamOneKey, ReportServiceStatements.InicialAnalysis);
	setValueToBuffer(cells.ParamTwoKey, ReportServiceStatements.FinalAnalysis);
	setValueToBuffer(cells.InfoKey, ReportServiceStatements.Volume);
}

function getFiltrationSpecs(reportData, item) {
	var filtrationSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormServicesFields.Start, item - 1),
		EndTime: getServiceFieldResponse(reportData, FormServicesFields.End, item - 1),
		Equipament: getServiceFieldResponse(reportData, FormServicesFields.Equipament, item - 1),
		System: getServiceFieldResponse(reportData, FormServicesFields.System, item - 1),
		Service: getServiceFieldResponse(reportData, FormServicesFields.Service, item - 1),
		Obs: getServiceFieldResponse(reportData, FormServicesFields.Obs, item - 1),
		Steps:getServiceFieldResponse(reportData, FormServicesFields.Steps, item - 1),
		InicialPartCount: getServiceFieldResponse(reportData, FormServicesFields.InicialPartCount, counters.PC1++),
		FinalPartCount: getServiceFieldResponse(reportData, FormServicesFields.FinalPartCount, counters.PC2++),
		Volume: getServiceFieldResponse(reportData, FormServicesFields.Volume, counters.FIL),
		Status: getStatus(getServiceFieldResponse(reportData, FormServicesFields.Status, item - 1))
	}
	
	return (filtrationSpecs);
}

function fillFiltration(reportData, item) {
	var cells = ReportServiceRespCells[item];
	var filtrationSpecs = getFiltrationSpecs(reportData, item);
	fillFiltrationStatements(cells)
	setValueToBuffer(cells.StartTime, filtrationSpecs.StartTime);
	setValueToBuffer(cells.EndTime, filtrationSpecs.EndTime);
	setValueToBuffer(cells.Equipament, filtrationSpecs.Equipament);
	setValueToBuffer(cells.System, filtrationSpecs.System);
	setValueToBuffer(cells.Service, filtrationSpecs.Service);
	setValueToBuffer(cells.Status, filtrationSpecs.Status);
	setValueToBuffer(cells.ParamOne, filtrationSpecs.InicialPartCount);
	setValueToBuffer(cells.ParamTwo, filtrationSpecs.FinalPartCount);
	setValueToBuffer(cells.Info, filtrationSpecs.Volume);
	setValueToBuffer(cells.Steps, filtrationSpecs.Steps.join(", "));
	setValueToBuffer(cells.Obs, filtrationSpecs.Obs);

	counters.FIL++;
}
//#endregion

//#region TANK CLEANING
function fillTankCleaningStatements(cells) {
	setValueToBuffer(cells.ParamOneKey, ReportServiceStatements.tankMaterial);
}

function getTankCleaningSpecs(reportData, item) {
	var descalingSpecs = {
		StartTime: getServiceFieldResponse(reportData, FormServicesFields.Start, item - 1),
		EndTime: getServiceFieldResponse(reportData, FormServicesFields.End, item - 1),
		Equipament: getServiceFieldResponse(reportData, FormServicesFields.Equipament, item - 1),
		System: getServiceFieldResponse(reportData, FormServicesFields.System, item - 1),
		Service: getServiceFieldResponse(reportData, FormServicesFields.Service, item - 1),
		Obs: getServiceFieldResponse(reportData, FormServicesFields.Obs, item - 1),
		Steps:getServiceFieldResponse(reportData, FormServicesFields.Steps, item - 1),
		tankMaterial: getServiceFieldResponse(reportData, FormServicesFields.TankMaterial, counters.LR),
		Status: getStatus(getServiceFieldResponse(reportData, FormServicesFields.Status, item - 1))
	}
	
	return (descalingSpecs);
}

function fillTankCleaning(reportData, item) {
	var cells = ReportServiceRespCells[item];
	var tankCleaningSpecs = getTankCleaningSpecs(reportData, item);
	fillTankCleaningStatements(cells)
	setValueToBuffer(cells.StartTime, tankCleaningSpecs.StartTime);
	setValueToBuffer(cells.EndTime, tankCleaningSpecs.EndTime);
	setValueToBuffer(cells.Equipament, tankCleaningSpecs.Equipament);
	setValueToBuffer(cells.System, tankCleaningSpecs.System);
	setValueToBuffer(cells.Service, tankCleaningSpecs.Service);
	setValueToBuffer(cells.Status, tankCleaningSpecs.Status);
	setValueToBuffer(cells.ParamOne, tankCleaningSpecs.pipeMaterial);
	setValueToBuffer(cells.Steps, tankCleaningSpecs.Steps.join(", "));
	setValueToBuffer(cells.Obs, tankCleaningSpecs.Obs);

	counters.LR++;
}
//#endregion

//#region SERVICE_UTILS
function getServiceFieldResponse(reportData, field, item) {
    return (reportData.searchFieldResponse(field, item));
}

function getStatus(status) {
	if (status === "Sim")
		return ("Finalizado");
	return ("Em andamento");
}

function	mergeValuesAndFormulas(formulas, values) {
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
