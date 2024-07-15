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
	const saturdayFlag = reportData.reportInfo.getMissionInfo(reportData.missionName).IncludeSaturday;
	const sundayFlag = reportData.reportInfo.getMissionInfo(reportData.missionName).IncludeSunday;
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

function fillTemplate(template, variables) {
	return template.replace(/\${(.*?)}/g, (match, p1) => variables[p1] || '');
}

function getExportUrlRequest(spreadSheetId, sheetId) {
	return (fillTemplate(urlRequestString, {
		reportSpreadsheetId: spreadSheetId,
		reportSheetId: sheetId}));
}

function sendPostRequest(formResponseId, isEdit=false) {
	var payload = {
	  formResponseId: formResponseId,
	  isEdit: isEdit
	};
  
	var options = {
	  'method': 'POST',
	  'contentType': 'application/json',
	  'payload': JSON.stringify(payload),
	  'headers': {
		'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()
	  }
	};
  
	var response = UrlFetchApp.fetch(serviceReportApi, options);
	Logger.log('Response from Script A: ' + response.getContentText());
  }

function showAllRespondsLink() {
	var form = FormApp.openById(formId);
	var formResponds = form.getResponses();
  var index = 0;
	formResponds.forEach(function(formResponse) {
		Logger.log(formResponse.getItemResponses().map(function(itemResponse) {
			return (itemResponse.getResponse());}));
		console.log(formResponse.getEditResponseUrl());
    console.log(index++)
	})
}
