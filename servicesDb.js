var RlqServiceDbFields = {
    CompareFields: [
      FormServicesFields.Service,
      FormServicesFields.Equipament,
      FormServicesFields.System,
      FormServicesFields.PipeMaterial,
      FormServicesFields.Size
    ],
    ConcatenationFields: [
      "Tipo de inspeção",
      "Método de limpeza",
      FormServicesFields.Steps,
      "Imagens de corpo de prova",
      "Imagens da tubulação"
    ]
}

var RlqConcatenationFields = [
  "Tipo de inspeção",
  "Método de limpeza",
  FormServicesFields.Steps,
  "Imagens de corpo de prova",
  "Imagens da tubulação"
]

function concatenateServiceResponses(serviceObject, storedService, fields) {
  for (let i = 0; i < fields.length; i++) {
    console.log(`Dentro do concatenate loop: \nOriginal: `)
    console.log(serviceObject[fields[i]])
    let storeField = storedService[fields[i]];
    let serviceField = serviceObject[fields[i]]
    if (!(serviceField && storeField))
      continue ;
    let concatenateService = storeField.concat(serviceField)
    let fieldSet = new Set(concatenateService);
    serviceField = Array.from(fieldSet);
    console.log(`Stored: ${storeField}\nConcatenate: ${serviceField}`)
  }
}

function storeServiceData(reportData, item) {
    var serviceObject = reportData.formResponsesDict[item];
    
    if (serviceDb.hasOwnProperty(reportData.missionName))
      serviceDb[reportData.missionName].push(serviceObject);
    else 
      serviceDb[reportData.missionName] = [serviceObject];
}

function checkServiceProgress(reportData, item, fields) {
    if (getServiceFieldResponse(reportData, FormServicesFields.Progress, item) === "Não (começou hoje)")
      return ;
    var serviceObject = reportData.formResponsesDict[item];
    var servicesStored = serviceDb[reportData.missionName];
    var compareUnits = getCompareUnits(serviceObject, fields.CompareFields)
    var bestScore = Infinity
    var dbCompareUnits = []
    var bestIndex = -1;

    for (var i = 0; i < servicesStored.length; i++) {
      let score = calculateScore(compareUnits, servicesStored[i], fields.CompareFields)
        if (score < bestScore) {
          bestScore = score;
          bestIndex = i;
        }
        dbCompareUnits.push(servicesStored[i])
    }
    console.log(`=====================================\nservicesStored: \n${servicesStored}\n\nService in question: \n${serviceObject}\n\n\nBest score: ${bestScore}\tBest Index: ${bestIndex}\n\nBestService: ${servicesStored[bestIndex]}\n===================================`);
    concatenateServiceResponses(serviceObject, servicesStored[bestIndex], fields.ConcatenationFields)
    servicesStored.splice(bestIndex, 1)
}

function calculateScore(compareUnits, serviceStored, fields) {
  console.log(compareUnits)
  console.log(serviceStored)
  var storedCompareUnits = getCompareUnits(serviceStored, fields);
  var score = 0;

  if (storedCompareUnits[0] !== compareUnits[0])
    return (Infinity)
  for (let i = 1; i < compareUnits.length; i++) {
    score += Levenshtein(compareUnits[i], storedCompareUnits[i]);
  }
  
  return (score);
}

function getCompareUnits(serviceObject, fields) {
  var compareUnits = [];

  for (let i = 0; i < fields.length; i++)
    compareUnits.push(serviceObject[fields[i]])

  return (compareUnits);
}

function Levenshtein(string, stringEntries) {
  var tmp;
  if (string.length === 0) { return stringEntries.length; }
  if (stringEntries.length === 0) { return string.length; }
  if (string.length > stringEntries.length) { tmp = string; string = stringEntries; stringEntries = tmp; }

  var i, j, score, alen = string.length, blen = stringEntries.length, row = Array(alen);
  for (i = 0; i <= alen; i++) { row[i] = i; }

  for (i = 1; i <= blen; i++) {
    score = i;
    for (j = 1; j <= alen; j++) {
      tmp = row[j - 1];
      row[j - 1] = score;
      score = stringEntries[i - 1] === string[j - 1] ? tmp : Math.min(tmp + 1, Math.min(score + 1, row[j] + 1));
    }
  }
  return (score);
  }
