function addItemToSpecificSectionAndPlace() {
    // Open the Google Form by its ID
    var form = FormApp.openById('15AIFLqOUbhvio4D1_eAG16XB8mzExiXd8-4tSW-PLNk');
  
    // Get all the items in the form
  
    // Define the section title where you want to add the item
    var sectionTitle = "Teste de pressão";
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
      var newItem = form.addCheckboxItem();
      newItem.setTitle('Selecione os manômetros utilizados').setHelpText("O código PI pode ser encontrado na lateral do manômetro")
            .setChoices([
              newItem.createChoice('PI-04'),
              newItem.createChoice('PI-05'),
              newItem.createChoice('PI-19'),
              newItem.createChoice('PI-22'),
              newItem.createChoice('PI-26'),
              newItem.createChoice('PI-32'),
              newItem.createChoice('PI-33'),
              newItem.createChoice('PI-34'),
              newItem.createChoice('PI-35'),
              newItem.createChoice('PI-36'),
              newItem.createChoice('PI-37'),
              newItem.createChoice('PI-38'),
              newItem.createChoice('PI-39'),
              newItem.createChoice('PI-40'),
              newItem.createChoice('PI-41'),
              newItem.createChoice('PI-43'),
              newItem.createChoice('PI-44'),
              newItem.createChoice('PI-45'),
              newItem.createChoice('PI-46'),
              newItem.createChoice('PI-47'),
              newItem.createChoice('PI-48'),
              newItem.createChoice('PI-49'),
              newItem.createChoice('PI-50'),
              newItem.createChoice('PI-51'),
              newItem.createChoice('PI-52'),
              newItem.createChoice('PI-53'),
              newItem.createChoice('PI-54'),
              newItem.createChoice('PI-55'),
              newItem.createChoice('PI-56'),
              newItem.createChoice('PI-57'),
              newItem.createChoice('PI-59'),
              newItem.createChoice('PI-60'),
              newItem.createChoice('PI-61'),
            ]).isRequired(true);
    
      // Get the items again, including the newly created one
      items = form.getItems();
    
      // Calculate the new item's position
      // targetSectionIndex + 1 places the item immediately after the section
      var newItemIndex = targetSectionIndex + 1;
    
      // Reorder the items
      form.moveItem(items.length - 1, newItemIndex + 12);
      }
    
  }

function editItemOfSpecificSections() {
  var form = FormApp.openById('15AIFLqOUbhvio4D1_eAG16XB8mzExiXd8-4tSW-PLNk');
  var sectionTitle = "Limpeza química";
  var questionTitle = "Imagens da tubulação "
  var sectionPosition = false;
  var items = form.getItems();

  for (var i = 0; i < items.length; i++) {
      if (items[i].getTitle() === sectionTitle && items[i].getType() === FormApp.ItemType.PAGE_BREAK)
        sectionPosition = true
      if (sectionPosition && items[i].getTitle() == questionTitle) {
        items[i].setHelpText("Adicionar fotos antes e depois da decapagem. Não é necessário repetir fotos já adicionadas, caso tenham sido adicionadas em dias anteriores.\nCada RLQ só aceita até 8 imagens.")
        sectionPosition = false;
      }
  }
}
