function onFormSubmit(e) {
    var formObject = e.response
    var reportObject = createReportSpreadSheet(formObject);


    //teste


}

// function searchColumn(formObject, columnName) {
//   var data = formObject.getDataRange().getValues();
//   for (var col = 0; col < data[0].length; col++) {
//     if (data[0][col] === columnName) {
//       // Column found, return its index
//       return (col + 1); // Adding 1 to convert to 1-based index
//     }
//   }
//   // Column not found
//   return -1;
// }

function searchColumnResponse(formResponse, columnName) {
  var itemResponses = formResponse.getItemResponses();
  
  // Log the form response details
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    if (itemResponse.getItem().getTitle() == columnName)
      return (itemResponse.getResponse());
    Logger.log('Question: ' + itemResponse.getItem().getTitle());
    Logger.log('Response: ' + itemResponse.getResponse());
  }
}

function getProjectName(formObject) {
  return (searchColumnResponse(formObject, "Projeto"));
}

// function getProjectName(formObject) {
//   var projectNameColumn = searchColumn(formObject, "Projeto");
//   return (projectNameColumn.getLastRow().getValue());
// }

function getReportDate(e) {


}
function createReportSpreadSheet(e) {
  // Replace 'SOURCE_SPREADSHEET_ID' with the ID of the spreadsheet you want to duplicate
  var sourceSpreadsheet = SpreadsheetApp.openById('198axqsZqkKf78v08HBMyaJhloO3p2rqRoBJfsaYOui0');
  // Duplicate the spreadsheet
  var copiedSpreadsheet = DriveApp.getFileById(sourceSpreadsheet.getId()).makeCopy();
  
  // Rename the duplicated spreadsheet if needed
  copiedSpreadsheet.setName('RDO - ' + getProjectName(e) + ' - 000')

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
