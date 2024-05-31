const greportModelID = "1stkfMCGdpIDEc1u4xfS3Ldl9qXirgR_4mPYMcCjSxBM" 
const reportInfoID = "1CEXqNgVBJOohszlvzw3B10nchUQ2eUIk"

const weekDays = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];

const HeaderFields = {
	Date: "Data do relatório",
	Mission: "Missão",
	DayShiftStartTime: "Horário de chegada a obra",
	DayShiftExitTime: "Horário de saída da obra",
	TotalLunchTime: "Tempo total de intervalo de almoço",
	DayShiftNumOfEmployees: "Quantidade de colaboradores (apenas turno diurno)",
	NightShift: "Houve turno noturno?",
	NightShiftStartTime: "Horário de inicio do turno noturno",
	NightShiftEndTime: "Horário de saída do turno noturno",
	TotalDinnerTime: "Tempo total de intervalo de janta",
	NightShiftNumOfEmployees: "Quantidade de colaboradores no turno noturno",
	StandByFlag: "Teve período ocioso (stand-by)",
	StandByValidity: "O período de aguardo foi por causa do cliente?",
	StandByTime: "Tempo total em stand-by",
	StandByMotive: "Motivo do período ocioso",
	OvertimeComment: "Em caso de hora extra, indicar o responsável a mesma",
	Activities: "Atividades/Observações",
	AddService: "Selecione o tipo de serviço que deseja adicionar informações"
}

const FormServicesFields = {
	Service: "Selecione o tipo de serviço que deseja adicionar informações",
	Equipament: "Nome do equipamento",
	System: "Nome do sistema",
	Size: "Diâmetro e comprimento das tubulações",
	Oil: "Óleo (nome, marca e viscosidade)",
	Type: "Tipo de Flushing",
	Status: "Serviço finalizado?",
	Start: "Início/continuação do flushing",
	End: "Término ou pausa do flushing",
	Inversion: "Inversão de fluxo",
	InicialPartCount: "Contagem de partículas inicial",
	FinalPartCount: "Contagem de partículas final",
	Steps: "Etapas realizadas no dia",
	Obs: "Observações"
}

const ReportServiceStatements = {
	InicialAnalysis: "Análise inicial",
	FinalAnalysis: "Análise final",
	Volume: "Volume",
	Material: "Material",
	WorkPressure: "Pressão de trabalho",
	TestPressure: "Pressão de teste",
	Fluid: "Fluido",
}

const ReportServiceRespCells = {
	1: {
		Service: "C13",
		Equipament: "C14",
		System: "C15",
		StartTime: "I13",
		EndTime: "M13",
		Status: "I15",
		ParamOne: "I14",
		ParamTwo: "M14",
		Info: "M15",
		ParamOneKey: "G14",
		ParamTwoKey: "K14",
		InfoKey: "L15",
		Steps: "B17",
		Obs: "B18"

	},

	2: {
		Service: "C21",
		Equipament: "C22",
		System: "C23",
		StartTime: "I21",
		EndTime: "M21",
		Status: "I23",
		ParamOne: "I22",
		ParamTwo: "M22",
		Info: "M23",
		ParamOneKey: "G22",
		ParamTwoKey: "K22",
		InfoKey: "L23",
		Steps: "B25",
		Obs: "B26"
	},

	3: {
		Service: "C29",
		Equipament: "C30",
		System: "C31",
		StartTime: "I29",
		EndTime: "M29",
		Status: "I31",
		ParamOne: "I30",
		ParamTwo: "M30",
		Info: "M31",
		ParamOneKey: "G30",
		ParamTwoKey: "K30",
		InfoKey: "L31",
		Steps: "B33",
		Obs: "B34"
	},

	4: {
		Service: "C37",
		Equipament: "C38",
		System: "C39",
		StartTime: "I37",
		EndTime: "M37",
		Status: "I39",
		ParamOne: "I38",
		ParamTwo: "M38",
		Info: "M39",
		ParamOneKey: "G38",
		ParamTwoKey: "K38",
		InfoKey: "L39",
		Steps: "B41",
		Obs: "B42"
	},

	5: {
		Service: "C45",
		Equipament: "C46",
		System: "C47",
		StartTime: "I45",
		EndTime: "M45",
		Status: "I47",
		ParamOne: "I46",
		ParamTwo: "M46",
		Info: "M47",
		ParamOneKey: "G46",
		ParamTwoKey: "K46",
		InfoKey: "L47",
		Steps: "B48",
		Obs: "B49"
	},

	6: {
		Service: "C53",
		Equipament: "C54",
		System: "C55",
		StartTime: "I53",
		EndTime: "M53",
		Status: "I55",
		ParamOne: "I54",
		ParamTwo: "M54",
		Info: "M55",
		ParamOneKey: "G54",
		ParamTwoKey: "K54",
		InfoKey: "L55",
		Steps: "B57",
		Obs: "B58"
	}
}

//#region Test
function showAllResponses() {
	var form = FormApp.openById('15AIFLqOUbhvio4D1_eAG16XB8mzExiXd8-4tSW-PLNk');
	var responses = form.getResponses();
	
	responses.forEach(function(response) {
	  Logger.log(response.getItemResponses().map(function(itemResponse) {
		return itemResponse.getResponse();
	  }));
	});
	return responses;
  }

function testWithPreviousResponse() {
var form = FormApp.openById('15AIFLqOUbhvio4D1_eAG16XB8mzExiXd8-4tSW-PLNk'); // Replace with your form ID
var responses = form.getResponses();
	if (responses.length > 0) {
		var testResponse = responses[42];
		
		// Create a fake event object
		var fakeEvent = {
		response: testResponse,
		source: form
		}
		// Call form submission handler with the fake event
		onFormSubmit(fakeEvent);
	} else {
		Logger.log('No responses found.');
	}
}

function testReportData() {
	var form = FormApp.openById('15AIFLqOUbhvio4D1_eAG16XB8mzExiXd8-4tSW-PLNk'); // Replace with your form ID
	var responses = form.getResponses();
	var testResponse = responses[42];
	var fakeEvent = {
		response: testResponse,
		source: form
	}
	var reportData = new ReportData(testResponse);
	console.log(reportData.services.First);
	console.log(reportData.services.Second);
	console.log(reportData.services.Third);
}
//#endregion

class ReportInfo {
	constructor() {
		this.reportInfoFile = DriveApp.getFileById(reportInfoID);
		this.reportInfoString = this.reportInfoFile.getBlob().getDataAsString();
		this.reportInfoData = JSON.parse(this.reportInfoString);
	}

	// This function MUST be called after using reportInfo.json. 
	updateReportInfo() {
		const updatedInfoData = JSON.stringify(this.reportInfoData, null, 2);
		this.reportInfoFile.setContent(updatedInfoData);
	}

	getMissionInfo(missionName) {
		return (this.reportInfoData.Missions.find(mission => mission.Name === missionName));
	}

	updateRDO(missionName) {
		this.getMissionInfo(missionName).RDO += 1;
	}
}

class ReportData {
	constructor(formObject) {
		this.formObject = formObject;
		this.reportInfo = new ReportInfo();
		this.name = this.getMissionName();
		this.date = this.getReportDate();
		this.rdo = this.getRDONumber() + 1;
		this.services = this.getServices();
		this.reportSpreadSheet;
		this.reportSpreadSheetFile;
	}

	getRDONumber() {
		return (this.reportInfo.getMissionInfo(this.name).RDO);
	}

	getClient() {
		return (this.reportInfo.getMissionInfo(this.name).Client);
	}

	getServices() {
		const services = {
			First: this.searchFieldResponse(HeaderFields.AddService, 0),
			Second: this.searchFieldResponse(HeaderFields.AddService, 1),
			Third: this.searchFieldResponse(HeaderFields.AddService, 2),
			Fourth: this.searchFieldResponse(HeaderFields.AddService, 3),
			Fifth: this.searchFieldResponse(HeaderFields.AddService, 4),
			Sixth: this.searchFieldResponse(HeaderFields.AddService, 5),
		};
		return (services);
	}

	getCNPJ() {
		return (this.reportInfo.getMissionInfo(this.name).CNPJ);
	}

	getProposal() {
		return (this.reportInfo.getMissionInfo(this.name).Proposal);
	}

	getWeekDayNum() {
		var dateStrings = this.date.split('-');
		var dateType = new Date(dateStrings[2], dateStrings[1] - 1, dateStrings[0]);
		var weekDay = dateType.getDay();
		
		return (weekDay);
	}

	getWeekDay() {
		var weekDay = this.getWeekDayNum();
		return (weekDays[weekDay]);
	}
	
	searchFieldResponse(fieldName, item=0) {
		var itemResponses = this.formObject.getItemResponses();
		for (var i = 0; i < itemResponses.length; i++) {
			var itemResponse = itemResponses[i];
			if (itemResponse.getItem().getTitle() === fieldName){
				if (item === 0)
					return(itemResponse.getResponse());
				item--;
			}
		}
	}

	getReportDate() {
			var date = this.searchFieldResponse(HeaderFields.Date);
			var dateComponents = date.split("-");
			var day = dateComponents[2];
			var month = dateComponents[1];
			var year = dateComponents[0];
		
			return (day + '-' + month + '-' + year);
		}
		
		getMissionName() {
			return (this.searchFieldResponse(HeaderFields.Mission));
		}

		openReportSpreadSheet() {
			this.reportSpreadSheet = SpreadsheetApp.open(this.reportSpreadSheetFile);
		}
}

function	fillReportNightShift(reportData, reportFirstSheet) {
	var nightShiftFlag = reportData.searchFieldResponse(HeaderFields.NightShift);

	if (nightShiftFlag === "Não")
		return ;
	
	var nightShiftStartTime = reportData.searchFieldResponse(HeaderFields.NightShiftStartTime);
	var nightShiftExitTime = reportData.searchFieldResponse(HeaderFields.NightShiftEndTime);
	var nightShiftDinnerTime = reportData.searchFieldResponse(HeaderFields.TotalDinnerTime);
	var	nightShiftNumOfEmployees = reportData.searchFieldResponse(HeaderFields.NightShiftNumOfEmployees);
	reportFirstSheet.getRange("D7").setValue(nightShiftStartTime);
	reportFirstSheet.getRange("D8").setValue(nightShiftExitTime);
	reportFirstSheet.getRange("I8").setValue(nightShiftDinnerTime);
	reportFirstSheet.getRange("N8").setValue(nightShiftNumOfEmployees);
}


function hourStringToDate(hourString) {
	const [hours, minutes] = hourString.split(':');
	const date = new Date();
	date.setHours(parseInt(hours, 10));
	date.setMinutes(parseInt(minutes, 10));
	
	return (date);
}

function getDiffHourAbs(hourStringOne, hourStringTwo) {
	const hourOne = hourStringToDate(hourStringOne);
	const hourTwo = hourStringToDate(hourStringTwo);
	const timeDifference = hourOne.getTime() - hourTwo.getTime();
	const hourDifference = timeDifference / (1000 * 60 * 60);
	return (Math.abs(hourDifference));
}

/**
 * Calculates the time difference from the given time stamp string. The string must be in the
 * "XX:XX" format.
 *
 * @param {string} startHourString
 * @param {string} endHourString
 * @return {number} 
 */

function getDiffHour(startHourString, endHourString) {
	const startTime = hourStringToDate(startHourString);
	const endTime = hourStringToDate(endHourString);
	if (endTime.getTime() < startTime.getTime())
		endTime.setTime(endTime.getTime() + 8.64E7); // add 24 hours
	const timeDifference = endTime.getTime() - startTime.getTime();
	const hourDifference = timeDifference / (1000 * 60 * 60);
	return (hourDifference);
}

/**
 * Converts a time stamp number to a time stamp string in the format "XX:XX".
 *
 * @param {number} hours
 * @return {string} 
 */
function hoursToHourString(hours) {
	const wholeHours = Math.floor(hours);
	const minutes = Math.round((hours - wholeHours) * 60);

	const paddedHours = wholeHours < 10 ? '0' + wholeHours : wholeHours;
	const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;

	const hourString = `${paddedHours}:${paddedMinutes}`;

	return (hourString);
}

function getShiftTime(reportData) {
	const weekday = reportData.getWeekDayNum();
	const saturdayFlag = reportData.reportInfo.getMissionInfo(reportData.name).IncludeSaturday;
	if (weekday > 0 && weekday < 5)
		return ("09:00");
	if (weekday == 5)
		return ("08:00");
	if (weekday == 6 && saturdayFlag)
		return ("08:00");
	return ("00:00");
}

function calculateOvertime(shiftTime, totalShiftTime) {
	const overtime = getDiffHourAbs(totalShiftTime, shiftTime);
	if (totalShiftTime < shiftTime)
		return (-overtime)
	return (overtime);
}

function calculateDayShiftTime(reportData) {
	const dayShiftStartTime = reportData.searchFieldResponse(HeaderFields.DayShiftStartTime);
	const dayShiftExitTime = reportData.searchFieldResponse(HeaderFields.DayShiftExitTime);
	const lunchInterval = reportData.searchFieldResponse(HeaderFields.TotalLunchTime);
	const totalShiftTime = getDiffHour(dayShiftStartTime, dayShiftExitTime);
	const shiftTime = getDiffHourAbs(hoursToHourString(totalShiftTime), lunchInterval);

	return (shiftTime);
}

function calculateNightShiftTime(reportData) {
	const nightShiftStartTime = reportData.searchFieldResponse(HeaderFields.NightShiftStartTime);
	const nightShiftExitTime = reportData.searchFieldResponse(HeaderFields.NightShiftEndTime);
	const dinnerInterval = reportData.searchFieldResponse(HeaderFields.TotalDinnerTime);
	const totalShiftTime = getDiffHour(nightShiftStartTime, nightShiftExitTime);
	const shiftTime = getDiffHourAbs(hoursToHourString(totalShiftTime), dinnerInterval);

	return (shiftTime);
}

function fillDayShiftOvertimeField(reportData, reportFirstSheet) {
	const dayShiftTime = hoursToHourString(calculateDayShiftTime(reportData));
	const shiftTime = getShiftTime(reportData);
	const overtime = calculateOvertime(shiftTime, dayShiftTime);
	if (overtime <= 0.5)
			return false;
	reportFirstSheet.getRange("D62").setValue(hoursToHourString(overtime));

	return (true);
}

function fillNightShiftOvertimeField(reportData, reportFirstSheet) {
	const nightShiftTime = hoursToHourString(calculateNightShiftTime(reportData));
	const shiftTime = getShiftTime(reportData);
	const overtime = calculateOvertime(shiftTime, nightShiftTime);
	if (overtime <= 0.5)
			return false;
	reportFirstSheet.getRange("D63").setValue(hoursToHourString(overtime));
	
	return (true);
}

function fillStandByField(reportData, reportFirstSheet) {
	if (reportData.searchFieldResponse(HeaderFields.StandByValidity) === "Não" || 
			reportData.searchFieldResponse(HeaderFields.StandByFlag === "Não"))
			return ;
	const standByTime = reportData.searchFieldResponse(HeaderFields.StandByTime);
	const standByMotive = reportData.searchFieldResponse(HeaderFields.StandByMotive);
	reportFirstSheet.getRange("J63").setValue(standByMotive);
	reportFirstSheet.getRange("J62").setValue(standByTime);
}

function fillOvertimeCommentField(reportData, reportFirstSheet) {
	const overtimeComment = reportData.searchFieldResponse(HeaderFields.OvertimeComment);
	reportFirstSheet.getRange("B64").setValue(overtimeComment);
}

function fillOvertimeField(reportData, reportFirstSheet) {
	const dayOvertime = fillDayShiftOvertimeField(reportData, reportFirstSheet);
	const NightShift = reportData.searchFieldResponse(HeaderFields.NightShift);
	var	nightOvertime = false;
	if (NightShift === "Sim")
		nightOvertime = fillNightShiftOvertimeField(reportData, reportFirstSheet);
	if (dayOvertime || nightOvertime)
		fillOvertimeCommentField(reportData, reportFirstSheet);
}

function fillLeaderField(reportData, reportFirstSheet) {
	const leader = reportData.reportInfo.getMissionInfo(reportData.name).Leader;
	const position = reportData.reportInfo.getMissionInfo(reportData.name).Position;

	reportFirstSheet.getRange("B65").setValue(leader);
	reportFirstSheet.getRange("B66").setValue(position);
}

function fillClientLeaderField(reportData, reportFirstSheet) {
	const leader = reportData.reportInfo.getMissionInfo(reportData.name).ClientLeader;
	const position = reportData.reportInfo.getMissionInfo(reportData.name).ClientLeaderPosition;

	reportFirstSheet.getRange("I65").setValue(leader);
	reportFirstSheet.getRange("I66").setValue(position);
}

function getStatus(status) {
	if (status === "Sim")
		return ("Finalizado");
	return ("Em andamento");
}

function fillFlushing(reportData, reportFirstSheet, item) {
	var cells = ReportServiceRespCells[item];

	reportFirstSheet.getRange(cells.ParamOneKey).setValue(ReportServiceStatements.InicialAnalysis + ":");
	reportFirstSheet.getRange(cells.ParamTwoKey).setValue(ReportServiceStatements.FinalAnalysis + ":");
	reportFirstSheet.getRange(cells.InfoKey).setValue(ReportServiceStatements.Volume + ":");

	console.log(reportData.searchFieldResponse(FormServicesFields.Steps))
	reportFirstSheet.getRange(cells.StartTime).setValue(reportData.searchFieldResponse(FormServicesFields.Start, item));
	reportFirstSheet.getRange(cells.EndTime).setValue(reportData.searchFieldResponse(FormServicesFields.End, item));
	reportFirstSheet.getRange(cells.Service).setValue("Flushing");
	reportFirstSheet.getRange(cells.Equipament).setValue(reportData.searchFieldResponse(FormServicesFields.Equipament, item));
	reportFirstSheet.getRange(cells.System).setValue(reportData.searchFieldResponse(FormServicesFields.System, item));
	reportFirstSheet.getRange(cells.Status).setValue(getStatus(reportData.searchFieldResponse(FormServicesFields.Status, item)));
	reportFirstSheet.getRange(cells.ParamOne).setValue(reportData.searchFieldResponse(FormServicesFields.InicialPartCount, item));
	reportFirstSheet.getRange(cells.ParamTwo).setValue(reportData.searchFieldResponse(FormServicesFields.FinalPartCount, item));
	try {
		reportFirstSheet.getRange(cells.Steps).setValue(reportData.searchFieldResponse(FormServicesFields.Steps, item).join(", "));

	} catch(e) {
		Logger.log("No steps in this service");
	}
	reportFirstSheet.getRange(cells.Obs).setValue(reportData.searchFieldResponse(FormServicesFields.Obs, item));

}

function fillItem(reportData, reportFirstSheet, item) {
	var service = reportData.searchFieldResponse(FormServicesFields.Service, item - 1)
	if (service === "Flushing")
		fillFlushing(reportData, reportFirstSheet, item);
	// else if (reportData.services.item === "Limpeza Química")
	// 	fillFlushing(reportData, reportFirstSheet, cells)
	// else if (reportData.services.item === "Filtragem")
	// 	fillFlushing(reportData, reportFirstSheet, cells)
	// else if (reportData.services.item === "Teste de Pressão")
	// 	fillFlushing(reportData, reportFirstSheet, cells)
	// else if (reportData.services.item === "Limpeza de reservatório")
	// 	fillFlushing(reportData, reportFirstSheet, cells)
}

function fillServicesFields(reportData, reportFirstSheet) {
	for (var item = 6; item > 0; item--) {
		fillItem(reportData, reportFirstSheet, item);
	}
	// fillSecondItem();
	// fillThirdItem();
	// fillFourthItem();
	// fillFifthItem();
	// fillSexthItem();
}


function fillActivities(reportData, reportFirstSheet) {
	const activities = reportData.searchFieldResponse(HeaderFields.Activities)

	reportFirstSheet.getRange("C10").setValue(activities);
}

function fillReportFooter(reportData, reportFirstSheet) {
	fillOvertimeField(reportData, reportFirstSheet);
	fillStandByField(reportData, reportFirstSheet);
	fillLeaderField(reportData, reportFirstSheet);
	fillClientLeaderField(reportData, reportFirstSheet);
	fillActivities(reportData, reportFirstSheet);
	fillServicesFields(reportData, reportFirstSheet);
}

function  fillReport(reportData) {
	var reportSpreadSheet = reportData.reportSpreadSheet;
	var reportFirstSheet = reportSpreadSheet.getSheets()[0];

	fillReportHeader(reportData, reportFirstSheet);
	fillReportSubHeader(reportData, reportFirstSheet);
	fillReportNightShift(reportData, reportFirstSheet);
	fillReportFooter(reportData, reportFirstSheet);
}

function  fillReportSubHeader(reportData, reportFirstSheet) {
	var	reportArriveTime = reportData.searchFieldResponse(HeaderFields.DayShiftStartTime);
	var	reportExitTime = reportData.searchFieldResponse(HeaderFields.DayShiftExitTime);
	var	reportLunchTime = reportData.searchFieldResponse(HeaderFields.TotalLunchTime);
	var reportNumOfEmployees = reportData.searchFieldResponse(HeaderFields.DayShiftNumOfEmployees);
	
	reportFirstSheet.getRange("B7").setValue(reportArriveTime);
	reportFirstSheet.getRange("B8").setValue(reportExitTime);
	reportFirstSheet.getRange("I7").setValue(reportLunchTime);
	reportFirstSheet.getRange("N7").setValue(reportNumOfEmployees);
}

function fillReportHeader(reportData, reportFirstSheet) {
	reportFirstSheet.getRange("L5").setValue(reportData.rdo);
	reportFirstSheet.getRange("N5").setValue(reportData.date);
	reportFirstSheet.getRange("B6").setValue(reportData.getClient());
	reportFirstSheet.getRange("G6").setValue(reportData.getCNPJ());
	reportFirstSheet.getRange("M6").setValue(reportData.getProposal());
}

function onFormSubmit(formData) {
	var formObject = formData.response;
	let reportData = new ReportData(formObject);
	reportData.reportSpreadSheetFile = createReportSpreadSheetFile(reportData);
	reportData.openReportSpreadSheet();
	fillReport(reportData);

	reportData.reportInfo.updateRDO(reportData.name);
	reportData.reportInfo.updateReportInfo();
}

function createReportSpreadSheetFile(reportData) {
	var modelSpreadSheetFile = SpreadsheetApp.openById(greportModelID);
	var copierSpreadSheetFile = DriveApp.getFileById(modelSpreadSheetFile.getId()).makeCopy();
	copierSpreadSheetFile.setName(reportData.name + ' - RDO ' + reportData.rdo + ' - ' + reportData.date + ' - ' + reportData.getWeekDay());
	return (copierSpreadSheetFile);
}

function moveFile() {
	// Replace 'FILE_ID' with the ID of the file you want to move
	var fileId = 'FILE_ID';
	
	// Replace 'FOLDER_ID' with the ID of the folder where you want to move the file
	var folderId = 'FOLDER_ID';
	
	// Get the file
	var file = DriveApp.getFileById(fileId);
	
	// Get the destination folder
	var folder = DriveApp.getFolderById(folderId);
	
	// Move the file to the destination folder
	folder.addFile(file);
	
	// Remove the file from its current location (if needed)
	DriveApp.getRootFolder().removeFile(file);
}
