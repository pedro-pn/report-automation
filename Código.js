const greportModelID = "1stkfMCGdpIDEc1u4xfS3Ldl9qXirgR_4mPYMcCjSxBM"
const reportInfoID = "1CEXqNgVBJOohszlvzw3B10nchUQ2eUIk"
function onFormSubmit(formData) {
  var formObject = formData.response
  var reportObject = createReportSpreadSheet(formObject);


}

function updateReportNumber(formObject, type) {
  var reportFile = DriveApp.getFileById(reportInfoID);
  var reportInfoData = reportFile.getBlob().getDataAsString();
  let data = JSON.parse(reportInfoData);
  const projectToUpdate = getProjectName(formObject);
  const reportNumberToUpdate = data.Projects.find(project => project.Name === projectToUpdate);

  if (reportNumberToUpdate) {
    switch (type){
      case (1):
        reportNumberToUpdate.RDO += 1;
    }
    const updatedInfoData = JSON.stringify(data, null, 2);
    // var updatedBlob = Utilities.newBlob(updatedInfoData, 'application/json');
    reportFile.setContent(updatedInfoData);
  }
  return (reportNumberToUpdate.RDO);
}

function getRDONumber(formObject) {
  return (updateReportNumber(formObject, 1));
}

function searchColumnResponse(formObject, columnName) {
  var itemResponses = formObject.getItemResponses();
  
  // Log the form response details
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    console.log('Question: ' + itemResponse.getItem().getTitle());
    console.log('Response: ' + itemResponse.getResponse());
    if (itemResponse.getItem().getTitle() == columnName)
      return (itemResponse.getResponse());
  }
}

function getProjectName(formObject) {
  return (searchColumnResponse(formObject, "Projeto"));
}

function getReportDate(formObject) {
  var date = searchColumnResponse(formObject, "Data do relatório");
  var dateComponents = date.split('-');
  var day = dateComponents[2];
  var month = dateComponents[1];
  var year = dateComponents[0];

  return (day + '-' + month + '-' + year);
}
function createReportSpreadSheet(formObject) {
  var sourceSpreadsheet = SpreadsheetApp.openById(greportModelID);
  var copiedSpreadsheet = DriveApp.getFileById(sourceSpreadsheet.getId()).makeCopy();
  copiedSpreadsheet.setName(getProjectName(formObject) + ' - RDO ' + getRDONumber(formObject) + ' - ' + getReportDate(formObject) + '')

  return (copiedSpreadsheet)
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
