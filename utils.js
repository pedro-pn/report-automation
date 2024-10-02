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
  console.log(`Start ${startHourString},   end: ${endHourString}`)
	const startTime = hourStringToDate(startHourString);
	const endTime = hourStringToDate(endHourString);
	if (endTime.getTime() < startTime.getTime())
		endTime.setTime(endTime.getTime() + 8.64E7); // add 24 hours
	const timeDifference = endTime.getTime() - startTime.getTime();
	const hourDifference = timeDifference / (1000 * 60 * 60);
	return (hourDifference);
}

function sumTimeString(time1, time2) {
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
  return `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}`;
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

function sendPostRequest(formResponseId, reportNumber, reportType, item, serviceObject) {
	var payload = {
		formResponseId: formResponseId,
		reportNumber: reportNumber,
		reportType: reportType,
		item: item,
		isEdit: isEdit,
    	serviceObject: serviceObject
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
	// Logger.log('Response from Script A: ' + response.getContentText());
	if (response.status === false)
		return ;

	var responseObject = JSON.parse(response)
	var serviceReportBlob = Utilities.newBlob(Utilities.base64Decode(responseObject.blob, Utilities.Charset.UTF_8), "application/pdf", responseObject.blobName);
	reportBlobs.push(serviceReportBlob)
	reportIds += `,${responseObject.reportId}`;
  return (responseObject.newService);
}

function cellStringToNumber(cellString) {
    var columnLetter = cellString.charAt(0);
	  var columnNumber = columnLetter.charCodeAt(0) - 65;
	  var rowNumber = parseInt(cellString.substring(1)) - 1;

    return ([rowNumber, columnNumber]);
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
