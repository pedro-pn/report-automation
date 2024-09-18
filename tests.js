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
	var responsesNumber = [121]
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
			setAllValuesToZero(reportBuffer);
			reportBuffer.fill(0);
      reportIds = "";
			isEdit = false;
      reportBlobs = [];
      reportType = 0;
      serviceDb = {}
		}
	} else {
		Logger.log('No responses found.');
	}
}

function testWithPreviousResponse() {
var form = FormApp.openById(formId); // Replace with your form ID
var responses = form.getResponses();
	if (responses.length > 0) {
		var testResponse = responses[128];
		
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

function testWithPreviousResponseDEBBUG() {
	var form = FormApp.openById(formId); // Replace with your form ID
	var responses = form.getResponses();
		if (responses.length > 0) {
			var testResponse = form.getResponse("2_ABaOnue64kTWlvDasOiyrF1IdSQbAjV99M2hfx8i5ttkeoJ44kpVFTb_bqaToVreRASSlII");
			
			// Create a fake event object
			var fakeEvent = {
			response: testResponse,
			source: form
			}
			// Call form submission handler with the fake event
			onFormSubmitDEBUG(fakeEvent);
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
	var testResponse = responses[91];
	let reportData = new ReportData.ReportData(testResponse);

	console.log(reportData.searchFieldResponse(FormServicesFields.Type, 3));
	console.log(reportData.searchFieldResponse(FormServicesFields.Type, 4));
	// console.log(reportData.searchFieldResponse(FormServicesFields.FinalPartCount, 0));
	// console.log(reportData.searchFieldResponse(FormServicesFields.FinalPartCount, 1));

	// sendPostRequest(testResponse.getId());
}

function newDataStructTest() { 
  var responses = form.getResponses();
	  if (responses.length > 0) {
		  var testResponse = responses[79].getItemResponses();

    var items = form.getItems();
  console.log(testResponse)
  var responseDict = new Array(items.length).fill({});
  testResponse.forEach( response => {
    let responseItem = response.getItem();
    let responseDict = {};
    let responseIndex = items.findIndex(item => 
      item.getId() === responseItem.getId()
    );
    if (responseIndex !== -1) {
      responseDict[responseItem.getTitle()] = response.getResponse()
      responseDict[responseIndex] = responseDict;
    }
  })

  
  console.log(responseDict); 

	}
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

// function showDiameters() {
// 	var form = FormApp.openById(formId);
// 	var formResponds = form.getResponses();
// 	var index = 0;
// 	var sectionPosition = false
// 	var questionTitle = "Diâmetro e comprimento das tubulações"
// 	formResponds.forEach(function(formResponse) {
// 		Logger.log(formResponse.getItemResponses().map(function(itemResponse) {
//       if (itemResponse.getTitle === "Missão" || )
// 			if (itemResponse.getItem().getTitle() === "Limpeza química" && itemResponse.getItem().getType() === FormApp.ItemType.PAGE_BREAK)
// 				sectionPosition = true
// 			  if (sectionPosition && itemResponse.getItem().getTitle() == questionTitle) {
// 				console.log(itemResponse.getResponse())
// 				sectionPosition = false;
// 			  }
// 			return (itemResponse.getResponse());}));

// 	})
// }

function getSpecificAnswers() {
  // Open the form by its ID
  var form = FormApp.openById(formId); // Replace with your form's ID
  var responses = form.getResponses(); // Get all responses
  
  // Variables to hold the desired responses
  var specificAnswers = [];

  // Iterate through all form responses
  for (var i = 0; i < responses.length; i++) {
    if ([98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 133].includes(i) === false)
      continue ;
    var response = responses[i]
    var itemResponses = response.getItemResponses(); // Get item responses for each form submission
    // var foundSection = false;
    var missaoIsGPS = false;
    var tamanhoAnswer = "";

    // Loop through each item response in the form submission
    itemResponses.forEach(function(itemResponse) {
      var item = itemResponse.getItem(); // Get the form item (question)
      var title = item.getTitle();       // Get the title of the question

      // Check for "Missão" field with value "GPS"
      if (title === "Missão" && itemResponse.getResponse() === "Missão 5623 - UHE Monte Claro - GPS") {
        missaoIsGPS = true;
      }

      // Check for the section with title "Limpeza Química"
      // if (item.getHelpText() === "Limpeza química") {
      //   foundSection = true;
      // }

      // Capture the "Tamanho" field response if found
      if (title === "Diâmetro e comprimento das tubulações") {
        tamanhoAnswer = itemResponse.getResponse();
      }
    });

    // Store the answer if both the section and Missão conditions are met
    if (missaoIsGPS && tamanhoAnswer !== "") {
      specificAnswers.push(tamanhoAnswer);
    }
  };

  // Log all specific answers
  Logger.log("Specific Answers for 'Tamanho' where 'Missão' is 'GPS' and Section is 'Limpeza Química': ");
  Logger.log(specificAnswers);
}
//#endregion
