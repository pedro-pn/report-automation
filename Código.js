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

  getClient(projectName) {
      return (this.getProjectInfo(projectName).Client)
  }

  updateRDO(projectName) {
    this.getProjectInfo(projectName).RDO += 1;
  }

  getCNPJ(projectName) {
    return (this.getProjectInfo(projectName).CNPJ)
  }

  getRDO(projectName) {
    return (this.getProjectInfo(projectName).RDO)
  }

  getProposal(projectName) {
    return (this.getProjectInfo(projectName).Proposal)
  }
}

class ReportData {
  constructor(formObject) {
    this.formObject = formObject;
    this.reportInfo = new ReportInfo();
    this.name = this.getProjectName(formObject);
    this.date = this.getReportDate(formObject);
    this.rdo = this.getRDONumber(this.name) + 1;
    this.reportSpreadSheet;
    this.reportSpreadSheetFile;
  }

  getRDONumber(reportName) {
    return (this.reportInfo.getRDO(reportName));
  }

  getWeekDay() {
    var dateStrings = this.date.split('-');
    var dateType = new Date(dateStrings[2], dateStrings[1] - 1, dateStrings[0]);
    var weekDay = dateType.getDay()
    return (weekday[weekDay]);
  }
  
  searchColumnResponse(formObject, columnName) {
      var itemResponses = formObject.getItemResponses();
      for (var i = 0; i < itemResponses.length; i++) {
        var itemResponse = itemResponses[i];
        console.log('Question: ' + itemResponse.getItem().getTitle());
        console.log('Response: ' + itemResponse.getResponse());
        if (itemResponse.getItem().getTitle() == columnName)
          return (itemResponse.getResponse());
      }
    }

  getReportDate(formObject) {
      var date = this.searchColumnResponse(formObject, "Data do relatório");
      var dateComponents = date.split('-');
      var day = dateComponents[2];
      var month = dateComponents[1];
      var year = dateComponents[0];
    
      return (day + '-' + month + '-' + year);
    }
    
    getProjectName(formObject) {
      return (this.searchColumnResponse(formObject, "Projeto"));
    }

    openReportSpreadSheet() {
      this.reportSpreadSheet = SpreadsheetApp.open(this.reportSpreadSheetFile);
    }
}

function fillReportHeader(reportData) {
  var reportSpreadSheet = reportData.reportSpreadSheet
  var reportFirstSheet = reportSpreadSheet.getSheets()[0];

  reportFirstSheet.getRange("J5").setValue(reportData.rdo);
  reportFirstSheet.getRange("L5").setValue(reportData.date);
}

function onFormSubmit(formData) {
  var formObject = formData.response
  let reportData = new ReportData(formObject);
  reportData.reportSpreadSheetFile = createReportSpreadSheetFile(reportData);
  reportData.openReportSpreadSheet();
  fillReportHeader(reportData);

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
