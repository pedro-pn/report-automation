//#region Test

function showAllResponses() {
	var form = FormApp.openById(formId);
	var responses = form.getResponses();
	
	responses.forEach(function(response) {
	  Logger.log(response.getItemResponses().map(function(itemResponse) {
		return itemResponse.getResponse();
	  }));
	});
	return responses;
  }

function remakeReports() {
	var form = FormApp.openById(formId); // Replace with your form ID
	// var responses = form.getResponses();
	var responsesNumber = [137, 139]
  var responsesIds = [
"Could not read API credentials. Are you logged in locally?"
  ]
	if (responsesIds.length > 0) {
		for (var i = 0; i < responsesIds.length; i++) {
			var testResponse = form.getResponse(responsesIds[i]);

			// Create a fake event object
			var fakeEvent = {
			response: testResponse,
			source: form
			}
			// Call form submission handler with the fake event
			onFormSubmit(fakeEvent as GoogleAppsScript.Events.FormsOnFormSubmit);
			reportBuffer = null;
      reportIds = "";
			isEdit = false;
      reportBlobs = [];
      reportType = 0;
      serviceDb = {}
      newService = false;
      debug = false;
		}
	} else {
		Logger.log('No responses found.');
	}
}

function testWithPreviousResponse() {
var form = FormApp.openById(formId); // Replace with your form ID
var responses = form.getResponses();
	if (responses.length > 0) {
		var testResponse = responses[137];
		
		// Create a fake event object
		var fakeEvent = {
		response: testResponse,
		source: form
		}
		// Call form submission handler with the fake event
		onFormSubmit(fakeEvent as GoogleAppsScript.Events.FormsOnFormSubmit);
	} else {
		Logger.log('No responses found.');
	}
}

function testWithPreviousResponseDEBBUG() {
  debug = true;
	var form = FormApp.openById(formId); // Replace with your form ID
	var responses = form.getResponses();
		if (responses.length > 0) {
			var testResponse = form.getResponse("2_ABaOnudd728UG0s4KXxUVibnLeiJXd0QXBAYyfUgU2DkCmFxEK869pZ6i4k1kLZ4uVtZxr0");
			
			// Create a fake event object
			var fakeEvent = {
			response: testResponse,
			source: form
			}
			// Call form submission handler with the fake event
			onFormSubmit(fakeEvent as GoogleAppsScript.Events.FormsOnFormSubmit);
		} else {
			Logger.log('No responses found.');
		}
	}

function testReportData() {
	var form = FormApp.openById(formId); // Replace with your form ID
	var responses = form.getResponses();
	var testResponse = responses[42];
	var fakeEvent = {
		response: testResponse,
		source: form
	}
	var reportData = new ReportData.ReportData(testResponse);
}

function testSearchResponse() {
	var form = FormApp.openById(formId); // Replace with your form ID
	var responses = form.getResponses();
	var testResponse = responses[91];
	let reportData = new ReportData.ReportData(testResponse);

	console.log(reportData.searchFieldResponse(FormServicesFields.Type, 3));
	console.log(reportData.searchFieldResponse(FormServicesFields.Type, 4));
	// console.log(reportData.searchFieldResponse(FormServicesFields.FinalPartCount, 0));
	// console.log(reportData.searchFieldResponse(FormServicesFields.FinalPartCount, 1));

	// sendPostRequest(testResponse.getId());
}

function assCellTest() {
	let assImage = DriveApp.getFileById("1PJYmqohN7Jr1JHZXKvid_lUTkM2lw8En").getBlob();
	let reportSpreadSheet = SpreadsheetApp.openById(ReportModelIds[2]);
	let reportSheet = reportSpreadSheet.getSheets()[0];
	let range = reportSheet.getRange("B57");
  
	var image = reportSheet.insertImage(assImage, range.getColumn(), range.getRow())
  
	let imageRatio = image.getHeight()/image.getWidth();
	image.setWidth(150);
	image.setHeight(150 * imageRatio);
	
}
