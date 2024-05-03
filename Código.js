const greportModelID = "1stkfMCGdpIDEc1u4xfS3Ldl9qXirgR_4mPYMcCjSxBM" 
const reportInfoID = "1CEXqNgVBJOohszlvzw3B10nchUQ2eUIk"

const weekday = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];

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

  getWeekDay() {
    var dateStrings = this.date.split('-');
    var dateType = new Date(dateStrings[2], dateStrings[1] - 1, dateStrings[0]);
    var weekDay = dateType.getDay()
    return (weekday[weekDay]);
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
      var date = this.searchFieldResponse("Data do relatório");
      var dateComponents = date.split('-');
      var day = dateComponents[2];
      var month = dateComponents[1];
      var year = dateComponents[0];
    
      return (day + '-' + month + '-' + year);
    }
    
    getProjectName() {
      return (this.searchFieldResponse("Projeto"));
    }

    openReportSpreadSheet() {
      this.reportSpreadSheet = SpreadsheetApp.open(this.reportSpreadSheetFile);
    }
}

function	fillReportNightShift(reportData, reportFirstSheet) {
	var nightShiftFlag = reportData.searchFieldResponse("Houve turno noturno?");

	if (nightShiftFlag === "Não")
		return ;
	
	var nightShiftStartTime = reportData.searchFieldResponse("Horário de inicio do turno noturno");
	var nightShiftExitTime = reportData.searchFieldResponse("Horário de saída do turno noturno");
	var nightShiftDinnerTime = reportData.searchFieldResponse("Tempo total de intervalo de janta");
	var	nightShiftNumOfEmployees = reportData.searchFieldResponse("Quantidade de colaboradores no turno noturno");
	console.log(nightShiftFlag);
	console.log(nightShiftStartTime);
	console.log(nightShiftExitTime);
	console.log(nightShiftDinnerTime);
	console.log(nightShiftNumOfEmployees);
	reportFirstSheet.getRange("D7").setValue(nightShiftStartTime);
	reportFirstSheet.getRange("D8").setValue(nightShiftExitTime);
	reportFirstSheet.getRange("H8").setValue(nightShiftDinnerTime);
	reportFirstSheet.getRange("L8").setValue(nightShiftNumOfEmployees);
}

function  fillReport(reportData) {
  var reportSpreadSheet = reportData.reportSpreadSheet;
  var reportFirstSheet = reportSpreadSheet.getSheets()[0];

  fillReportHeader(reportData, reportFirstSheet);
  fillReportSubHeader(reportData, reportFirstSheet);
  fillReportNightShift(reportData, reportFirstSheet);
}

function  fillReportSubHeader(reportData, reportFirstSheet) {
	var	reportArriveTime = reportData.searchFieldResponse("Horário de chegada a obra");
	var	reportExitTime = reportData.searchFieldResponse("Horário de saída da obra");
	var	reportLunchTime = reportData.searchFieldResponse("Tempo total de intervalo de almoço");
	var reportNumOfEmployees = reportData.searchFieldResponse("Quantidade de colaboradores (apenas turno diurno)");
	
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
