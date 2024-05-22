const greportModelID = "1stkfMCGdpIDEc1u4xfS3Ldl9qXirgR_4mPYMcCjSxBM" 
const reportInfoID = "1CEXqNgVBJOohszlvzw3B10nchUQ2eUIk"

const weekDays = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];

const FormsFields = {
	Date: "Data do relatório",
	Project: "Projeto",
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
	Activities: "Atividades/Observações"
}

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

	getProjectInfo(projectName) {
			return (this.reportInfoData.Projects.find(project => project.Name === projectName));
		}

	updateRDO(projectName) {
			this.getProjectInfo(projectName).RDO += 1;
		}
}

class ReportData {
	constructor(formObject) {
		this.formObject = formObject;
		this.reportInfo = new ReportInfo();
		this.name = this.getProjectName();
		this.date = this.getReportDate();
		this.rdo = this.getRDONumber() + 1;
		this.reportSpreadSheet;
		this.reportSpreadSheetFile;
	}

	getRDONumber() {
		return (this.reportInfo.getProjectInfo(this.name).RDO);
	}

	getClient() {
		return (this.reportInfo.getProjectInfo(this.name).Client);
	}

	getCNPJ() {
		return (this.reportInfo.getProjectInfo(this.name).CNPJ);
	}

	getProposal() {
		return (this.reportInfo.getProjectInfo(this.name).Proposal);
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
	
	searchFieldResponse(fieldName) {
			var itemResponses = this.formObject.getItemResponses();
			for (var i = 0; i < itemResponses.length; i++) {
				var itemResponse = itemResponses[i];
				if (itemResponse.getItem().getTitle() == fieldName)
					return (itemResponse.getResponse());
			}
		}

	getReportDate() {
			var date = this.searchFieldResponse(FormsFields.Date);
			var dateComponents = date.split("-");
			var day = dateComponents[2];
			var month = dateComponents[1];
			var year = dateComponents[0];
		
			return (day + '-' + month + '-' + year);
		}
		
		getProjectName() {
			return (this.searchFieldResponse(FormsFields.Project));
		}

		openReportSpreadSheet() {
			this.reportSpreadSheet = SpreadsheetApp.open(this.reportSpreadSheetFile);
		}
}

function	fillReportNightShift(reportData, reportFirstSheet) {
	var nightShiftFlag = reportData.searchFieldResponse(FormsFields.NightShift);

	if (nightShiftFlag === "Não")
		return ;
	
	var nightShiftStartTime = reportData.searchFieldResponse(FormsFields.NightShiftStartTime);
	var nightShiftExitTime = reportData.searchFieldResponse(FormsFields.NightShiftEndTime);
	var nightShiftDinnerTime = reportData.searchFieldResponse(FormsFields.TotalDinnerTime);
	var	nightShiftNumOfEmployees = reportData.searchFieldResponse(FormsFields.NightShiftNumOfEmployees);
	reportFirstSheet.getRange("D7").setValue(nightShiftStartTime);
	reportFirstSheet.getRange("D8").setValue(nightShiftExitTime);
	reportFirstSheet.getRange("H8").setValue(nightShiftDinnerTime);
	reportFirstSheet.getRange("L8").setValue(nightShiftNumOfEmployees);
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
	console.log("hourDifference: " + hourDifference)
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
	const saturdayFlag = reportData.reportInfo.getProjectInfo(reportData.name).IncludeSaturday;
	if (weekday > 0 && weekday < 5)
		return ("09:00");
	if (weekday == 5)
		return ("08:00");
	if (weekday == 6 && saturdayFlag)
		return ("08:00");
	return ("00:00");
}

function calculateOvertime(shiftTime, totalShiftTime) {
	return (getDiffHourAbs(hoursToHourString(totalShiftTime), shiftTime));
}

function calculateDayShiftTime(reportData) {
	const dayShiftStartTime = reportData.searchFieldResponse(FormsFields.DayShiftStartTime);
	const dayShiftExitTime = reportData.searchFieldResponse(FormsFields.DayShiftExitTime);
	const lunchInterval = reportData.searchFieldResponse(FormsFields.TotalLunchTime);
	const totalShiftTime = getDiffHour(dayShiftStartTime, dayShiftExitTime);
	const shiftTime = getDiffHourAbs(hoursToHourString(totalShiftTime), lunchInterval);
	return (shiftTime);
}

function calculateNightShiftTime(reportData) {
	const nightShiftStartTime = reportData.searchFieldResponse(FormsFields.NightShiftStartTime);
	const nightShiftExitTime = reportData.searchFieldResponse(FormsFields.NightShiftEndTime);
	const dinnerInterval = reportData.searchFieldResponse(FormsFields.TotalDinnerTime);
	const totalShiftTime = getDiffHour(nightShiftStartTime, nightShiftExitTime);
	const shiftTime = getDiffHourAbs(hoursToHourString(totalShiftTime), dinnerInterval);

	return (shiftTime);
}

function fillDayShiftOvertimeField(reportData, reportFirstSheet) {
	const dayShiftTime = calculateDayShiftTime(reportData);
	const shiftTime = getShiftTime(reportData);
	const overtime = calculateOvertime(shiftTime, dayShiftTime);
	if (overtime <= 0.5)
			return false;
	reportFirstSheet.getRange("D63").setValue(hoursToHourString(overtime));

	return (true);
}

function fillNightShiftOvertimeField(reportData, reportFirstSheet) {
	const nightShiftTime = calculateNightShiftTime(reportData);
	const shiftTime = getShiftTime(reportData);
	const overtime = calculateOvertime(shiftTime, nightShiftTime);
	console.log("night shift overtime: " + overtime);
	if (overtime <= 0.5)
			return false;
	reportFirstSheet.getRange("D64").setValue(hoursToHourString(overtime));
	
	return true
}

function fillStandByField(reportData, reportFirstSheet) {
	if (reportData.searchFieldResponse(FormsFields.StandByValidity) === "Não" || 
			reportData.searchFieldResponse(FormsFields.StandByFlag === "Não"))
			return ;
	const standByTime = reportData.searchFieldResponse(FormsFields.StandByTime);
	const standByMotive = reportData.searchFieldResponse(FormsFields.StandByMotive);
	console.log("standby motive: " + standByMotive);
	console.log("standby time: " + standByTime);
	reportFirstSheet.getRange("I63").setValue(standByTime);
	reportFirstSheet.getRange("I64").setValue(standByMotive);
}

function fillOvertimeCommentField(reportData, reportFirstSheet) {
	const overtimeComment = reportData.searchFieldResponse(FormsFields.OvertimeComment);
	reportFirstSheet.getRange("B65").setValue(overtimeComment);
}

function fillOvertimeField(reportData, reportFirstSheet) {
	const dayOvertime = fillDayShiftOvertimeField(reportData, reportFirstSheet);
	const NightShift = reportData.searchFieldResponse(FormsFields.NightShift);
	var	nightOvertime = false;
	if (NightShift === "Sim")
		nightOvertime = fillNightShiftOvertimeField(reportData, reportFirstSheet);
	if (dayOvertime || nightOvertime)
		fillOvertimeCommentField(reportData, reportFirstSheet);
}

function fillLeaderField(reportData, reportFirstSheet) {
	const leader = reportData.reportInfo.getProjectInfo(reportData.name).Leader;
	const position = reportData.reportInfo.getProjectInfo(reportData.name).Position;

	reportFirstSheet.getRange("B66").setValue(leader);
	reportFirstSheet.getRange("B67").setValue(position);
}

function fillClientLeaderField(reportData, reportFirstSheet) {
	const leader = reportData.reportInfo.getProjectInfo(reportData.name).ClientLeader;
	const position = reportData.reportInfo.getProjectInfo(reportData.name).ClientLeaderPosition;

	reportFirstSheet.getRange("H66").setValue(leader);
	reportFirstSheet.getRange("H67").setValue(position);
}

function fillActivities(reportData, reportFirstSheet) {
	const activities = reportData.searchFieldResponse(FormsFields.Activities)

	reportFirstSheet.getRange("C59").setValue(activities);
}

function fillReportFooter(reportData, reportFirstSheet) {
		fillOvertimeField(reportData, reportFirstSheet);
		fillStandByField(reportData, reportFirstSheet);
		fillLeaderField(reportData, reportFirstSheet);
		fillClientLeaderField(reportData, reportFirstSheet);
		fillActivities(reportData, reportFirstSheet);
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
	var	reportArriveTime = reportData.searchFieldResponse(FormsFields.DayShiftStartTime);
	var	reportExitTime = reportData.searchFieldResponse(FormsFields.DayShiftExitTime);
	var	reportLunchTime = reportData.searchFieldResponse(FormsFields.TotalLunchTime);
	var reportNumOfEmployees = reportData.searchFieldResponse(FormsFields.DayShiftNumOfEmployees);
	
	reportFirstSheet.getRange("B7").setValue(reportArriveTime);
	reportFirstSheet.getRange("B8").setValue(reportExitTime);
	reportFirstSheet.getRange("H7").setValue(reportLunchTime);
	reportFirstSheet.getRange("L7").setValue(reportNumOfEmployees);
}

function fillReportHeader(reportData, reportFirstSheet) {
	reportFirstSheet.getRange("J5").setValue(reportData.rdo);
	reportFirstSheet.getRange("L5").setValue(reportData.date);
	reportFirstSheet.getRange("B6").setValue(reportData.getClient());
	reportFirstSheet.getRange("F6").setValue(reportData.getCNPJ());
	reportFirstSheet.getRange("K6").setValue(reportData.getProposal());
}

function onFormSubmit(formData) {
	var formObject = formData.response
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
