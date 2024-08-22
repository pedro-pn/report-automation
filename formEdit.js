function addItemToSpecificSectionAndPlace() {
    // Open the Google Form by its ID
    var form = FormApp.openById('15AIFLqOUbhvio4D1_eAG16XB8mzExiXd8-4tSW-PLNk');
  
    // Get all the items in the form
  
    // Define the section title where you want to add the item
    var sectionTitle = "Flushing";
    var targetSectionIndex = -1;
    
    // Loop through items to find the target section
    for (var service = 0; service < 6; service++) {
      var items = form.getItems();
      var serviceCount = 0;
          for (var i = 0; i < items.length; i++) {
              if (items[i].getTitle() === sectionTitle && items[i].getType() === FormApp.ItemType.PAGE_BREAK) {
                  if (serviceCount == service) {
                      targetSectionIndex = i;
                      break;
                  }
                  serviceCount++;
              }
          }
      if (targetSectionIndex === -1) {
        Logger.log('Section not found');
        return;
      }
    
      // Create a new multiple-choice item
      var newItem = form.addMultipleChoiceItem();
      newItem.setTitle('Serviço aprovado pelo cliente?')
            .setChoices([
              newItem.createChoice("Sim"),
              newItem.createChoice('Não'),
            ]);
    
      // Get the items again, including the newly created one
      items = form.getItems();
    
      // Calculate the new item's position
      // targetSectionIndex + 1 places the item immediately after the section
      var newItemIndex = targetSectionIndex + 1;
    
      // Reorder the items
      form.moveItem(items.length - 1, newItemIndex + 9);
      }
    
  }

function editItemOfSpecificSections() {
  var form = FormApp.openById('15AIFLqOUbhvio4D1_eAG16XB8mzExiXd8-4tSW-PLNk');
  var sectionTitle = "Limpeza química";
  var questionTitle = "Tipo de inspeção"
  var sectionPosition = false;
  var items = form.getItems();

  for (var i = 0; i < items.length; i++) {
      if (items[i].getTitle() === sectionTitle && items[i].getType() === FormApp.ItemType.PAGE_BREAK)
        sectionPosition = true
      if (sectionPosition && items[i].getTitle() == questionTitle) {
        form.deleteItem(items[i])
        sectionPosition = false;
      }
  }
}
