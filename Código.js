const greportModelID = "1stkfMCGdpIDEc1u4xfS3Ldl9qXirgR_4mPYMcCjSxBM" 
const reportInfoID = "1CEXqNgVBJOohszlvzw3B10nchUQ2eUIk"

const weekday = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];

class ReportData {
  constructor(formObject) {
    this.formObject = formObject;
    this.name = this.getProjectName(formObject);
    this.date = this.getReportDate(formObject);
    this.rdo = this.getRDONumber(this.name);
    this.reportSpreadSheet;
    this.reportSpreadSheetFile;
  }

  getRDONumber(reportName) {
    return (updateReportNumber(reportName, 1));
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

function reportHeader(reportData) {
  var reportSpreadSheet = reportData.reportSpreadSheet
  console.log(typeof reportSpreadSheet);
  var reportFirstSheet = reportSpreadSheet.getSheets()[0];
  reportFirstSheet.getRange("J5").setValue(reportData.rdo);
  reportFirstSheet.getRange("L5").setValue(reportData.date);
}

function onFormSubmit(formData) {
  var formObject = formData.response
  let reportData = new ReportData(formObject);
  reportData.reportSpreadSheetFile = createReportSpreadSheetFile(reportData);
  reportData.openReportSpreadSheet();
  reportHeader(reportData);
  console.log(reportData.name)
}

function updateReportNumber(reportName, type) {
  var reportFile = DriveApp.getFileById(reportInfoID);
  var reportInfoData = reportFile.getBlob().getDataAsString();
  let data = JSON.parse(reportInfoData);
  const reportNumberToUpdate = data.Projects.find(project => project.Name === reportName);

  if (reportNumberToUpdate) {
    switch (type){
      case (1):
        reportNumberToUpdate.RDO += 1;
    }
    const updatedInfoData = JSON.stringify(data, null, 2);
    reportFile.setContent(updatedInfoData);
  }
  return (reportNumberToUpdate.RDO);
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
