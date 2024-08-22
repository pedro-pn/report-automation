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
	var responses = form.getResponses();
	var responsesNumber = [68, 85, 69, 87, 78, 84, 86, ]
	if (responses.length > 0) {
		for (var i = 0; i < responsesNumber.length; i++) {
			var testResponse = responses[responsesNumber[i]];

			// Create a fake event object
			var fakeEvent = {
			response: testResponse,
			source: form
			}
			// Call form submission handler with the fake event
			onFormSubmit(fakeEvent);
			setAllValuesToZero(counters);
			setAllValuesToZero(reportBuffer);
			reportBuffer.fill(0);
      reportIds = ["", "", "", "", "", ""];
			isEdit = false;
      reportBlobs = [];
      reportType = 0;
		}
	} else {
		Logger.log('No responses found.');
	}
}

function testWithPreviousResponse() {
var form = FormApp.openById(formId); // Replace with your form ID
var responses = form.getResponses();
	if (responses.length > 0) {
		var testResponse = responses[86];
		
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
	var form = FormApp.openById(formId); // Replace with your form ID
	var responses = form.getResponses();
	var testResponse = responses[42];
	var fakeEvent = {
		response: testResponse,
		source: form
	}
	var reportData = new ReportData(testResponse);
}

function showResponsesAndTitle() {
	var form = FormApp.openById(formId); // Replace with your form ID
  var responses = form.getResponses();
	  if (responses.length > 0) {
		  var testResponse = responses[0];
	  var formResponses = testResponse.getItemResponses()
		  
  
		  // Call form submission handler with the fake event
	  console.log("formResponse length: " + formResponses.length)
		  for (var i = 0; i < formResponses.length; i++) {
		formResponse = formResponses[i];
		  console.log("Tittle: " + formResponse.getItem().getTitle() + "\n" + "Response: " + formResponse.getResponse() + "\n\n")
	  }
	  } else {
		  Logger.log('No responses found.');
	  }
  }

function testSearchResponse() {
	var form = FormApp.openById(formId); // Replace with your form ID
	var responses = form.getResponses();
	var testResponse = responses[69];
	let reportData = new ReportData.ReportData(testResponse);

	console.log(reportData.searchFieldResponse(FormServicesFields.InicialPartCount, 0));
	console.log(reportData.searchFieldResponse(FormServicesFields.InicialPartCount, 1));
	console.log(reportData.searchFieldResponse(FormServicesFields.FinalPartCount, 0));
	console.log(reportData.searchFieldResponse(FormServicesFields.FinalPartCount, 1));

	sendPostRequest(testResponse.getId());
}

//#endregion
