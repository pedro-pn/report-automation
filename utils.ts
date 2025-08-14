function hourStringToDate(hourString: string): Date {
	const [hours, minutes] = hourString.split(':');
	const date = new Date();
	date.setHours(parseInt(hours, 10));
	date.setMinutes(parseInt(minutes, 10));
	
	return (date);
}

function getDiffHourAbs(hourStringOne: string, hourStringTwo: string): number {
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

function getDiffHour(startHourString: string, endHourString: string): number {
  console.log(`Start ${startHourString},   end: ${endHourString}`)
	const startTime = hourStringToDate(startHourString);
	const endTime = hourStringToDate(endHourString);
	if (endTime.getTime() < startTime.getTime())
		endTime.setTime(endTime.getTime() + 8.64E7); // add 24 hours
	const timeDifference = endTime.getTime() - startTime.getTime();
	const hourDifference = timeDifference / (1000 * 60 * 60);
	return (hourDifference);
}

const padNumber = (num) => ('00' + num).slice(-2);

function sumTimeString(time1: string, time2: string): string {
  // Split the time strings by ":"
  let [hours1, minutes1] = time1.split(":").map(Number);
  let [hours2, minutes2] = time2.split(":").map(Number);
  
  // Sum hours and minutes
  let totalMinutes = minutes1 + minutes2;
  let totalHours = hours1 + hours2;

  // If total minutes are 60 or more, add the extra hour
  totalHours += Math.floor(totalMinutes / 60);
  totalMinutes = totalMinutes % 60;  // Get remaining minutes

  // Return the result in "HH:MM" format
  return `${padNumber(totalHours)}:${padNumber(totalMinutes)}`;
}

/**
 * Converts a time stamp number to a time stamp string in the format "XX:XX".
 *
 * @param {number} hours
 * @return {string} 
 */
function hoursToHourString(hours: number): string {
	const wholeHours = Math.floor(hours);
	const minutes = Math.round((hours - wholeHours) * 60);

	const paddedHours = wholeHours < 10 ? '0' + wholeHours : wholeHours;
	const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;

	const hourString = `${paddedHours}:${paddedMinutes}`;

	return (hourString);
}

function parseDateString(dateString: string): string {
    const [year, month, day] = dateString.split("-");
    const formattedYear = year.startsWith("00") ? `20${year.slice(2)}` : year;
    return `${day}-${month}-${formattedYear}`;
}

function getShiftTime(reportData: ReportData): string {
	const weekday = reportData.getWeekDayNum();
	const saturdayFlag = reportData.getMissionInfos().IncludeSaturday;
	const sundayFlag = reportData.getMissionInfos().IncludeSunday;
	if (weekday > 0 && weekday < 5)
		return (reportData.shiftTime.weekdays);
	if (weekday == 5)
		return (reportData.shiftTime.weekend);
	if (weekday == 6 && saturdayFlag)
		return (reportData.shiftTime.weekend);
	if (weekday == 0 && sundayFlag)
		return (reportData.shiftTime.weekend)
	return ("00:00");
}

function fillTemplate(template: string, variables: Object): string {
	return template.replace(/\${(.*?)}/g, (match, p1) => variables[p1] || '');
}

function getExportUrlRequest(spreadSheetId: string, sheetId: number): string {
	return (fillTemplate(ServiceApi.URL_PDF_REQUEST, {
		reportSpreadsheetId: spreadSheetId,
		reportSheetId: sheetId}));
}

function getWeekDayNum(date: string): number {
	var dateStrings = date.split('-');
	var dateType = new Date(Number(dateStrings[2]), Number(dateStrings[1]) - 1, Number(dateStrings[0]));
	var weekDay = dateType.getDay();
	
	return (weekDay);
}

function getWeekDay(date: string): string {
	let weekDay = getWeekDayNum(date);
	return (Weekdays[weekDay]);
}

function sendPostRequest(formResponseId: string, reportInfoJSONString: string, reportType: ReportTypes, item: number, serviceObject: ServiceFieldResponses): ServiceFieldResponses {
	const reportState = ReportState.getInstance();
	var payload = {
		formResponseId: formResponseId,
		reportInfoJSONString: reportInfoJSONString,
		reportType: reportType,
		item: item,
		isEdit: reportState.getIsEdit(),
    	serviceObject: serviceObject
	};

	var options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
		'method': 'post',
		'contentType': 'application/json',
		'payload': JSON.stringify(payload),
		'headers': {
		'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()
		}
	};

	var response = UrlFetchApp.fetch(ServiceApi.SERVICE_API_URL, options);
	if (response.getResponseCode() !== 200) {
	  Logger.log('Error: Failed to fetch the data from the API');
	  return null;  // If not successful, return null
	}

	var responseObject = JSON.parse(response.getContentText())
	var serviceReportBlob = Utilities.newBlob(Utilities.base64Decode(responseObject.blob, Utilities.Charset.UTF_8), "application/pdf", responseObject.blobName);
	reportState.getReportBlobs().push(serviceReportBlob)
	reportState.addReportId(`,${responseObject.reportId}`);
  	return (responseObject.newService);
}

function cellStringToNumber(cellString: string): number[] {
    var columnLetter = cellString.charAt(0);
	  var columnNumber = columnLetter.charCodeAt(0) - 65;
	  var rowNumber = parseInt(cellString.substring(1)) - 1;

    return ([rowNumber, columnNumber]);
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

//#region SERVICE_UTILS
function getServiceFieldResponse(reportData: ReportData, field: string, item: number): fieldResponse {
    return (reportData.searchFieldResponse(field, item));
}

function getStatus(status: string): string {
	if (status === "Sim")
		return ("Finalizado");
	return ("Em andamento");
}

//#endregion

function showAllRespondsLink() {
	var form = FormApp.openById(FormId);
	var formResponds = form.getResponses();
	var index = 0;
	formResponds.forEach(function(formResponse) {
		Logger.log(formResponse.getItemResponses().map(function(itemResponse) {
			return (itemResponse.getResponse());}));
		console.log(formResponse.getEditResponseUrl());
		console.log(String(index++))
	})
}
