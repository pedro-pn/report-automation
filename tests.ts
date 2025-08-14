//#region Test

function showAllResponses() {
	var form = FormApp.openById(FormId);
	var responses = form.getResponses();
	
	responses.forEach(function(response) {
	  Logger.log(response.getItemResponses().map(function(itemResponse) {
		return itemResponse.getResponse();
	  }));
	});
	return responses;
  }

  function remakeReports() {
    var form = FormApp.openById(FormId); // Replace with your form ID
    // var responses = form.getResponses();
    var responsesNumber = [137, 139];
    var responsesIds = [
        "2_ABaOnucpHPbSAAXOcpdALWZGINlxntrFzaSOfReSeyyFjOTnA-8bo--bmbsnvnsUeHRXE9U"
    ];
	const fakeUser = {
		getEmail: () => "",
		getUserLoginId: () => "",
		getName: () => "",
	};
    if (responsesIds.length > 0) {
        for (var i = 0; i < responsesIds.length; i++) {
            var testResponse = form.getResponse(responsesIds[i]);
            // Create a fake event object
            var fakeEvent = {
                response: testResponse,
                source: form,
				authMode: null,
				triggerUid: "",
				user: fakeUser,
            };
            // Call form submission handler with the fake event
            onFormSubmit(fakeEvent);
            // ReportState.reportBuffer = null;
            // ReportState.reportIds = "";
            // ReportState.isEdit = false;
            // ReportState.reportBlobs = [];
            // ReportState.reportType = 0;
            // ReportState.serviceDb = {}
            // ReportState.newService = false;
            // ReportState.debug = false;
        }
    }
    else {
        Logger.log('No responses found.');
    }
}

function testWithPreviousResponse() {
var form = FormApp.openById(FormId); // Replace with your form ID
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
//   ReportState.debug = true;
	var form = FormApp.openById(FormId); // Replace with your form ID
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

// function testReportData() {
// 	var form = FormApp.openById(FormId); // Replace with your form ID
// 	var testResponse = form.getResponse("2_ABaOnucGwar2bzniLD6REM7NVxCHc3u-QJM97sEftF0XBp0kAK_vjZTYASZSborYRWHSl98");

	
// 	var reportData = new ReportData(testResponse);
// 	console.log(`RDO number: ${reportData.reportNum}`);
// 	ReportState.reportType = ReportTypes.RLQ;
// 	console.log(`RLQ should be 2: ${reportData.getReportNumber(ReportTypes.RLQ)}`)
// }


function assCellTest() {
	let assImage = DriveApp.getFileById("1PJYmqohN7Jr1JHZXKvid_lUTkM2lw8En").getBlob();
	let reportSpreadSheet = SpreadsheetApp.openById(SpreadsheetIds.MODEL_IDS[ReportTypes[2]]);
	let reportSheet = reportSpreadSheet.getSheets()[0];
	let range = reportSheet.getRange("B57");
  
	var image = reportSheet.insertImage(assImage, range.getColumn(), range.getRow())
  
	let imageRatio = image.getHeight()/image.getWidth();
	image.setWidth(150);
	image.setHeight(150 * imageRatio);
	
}
