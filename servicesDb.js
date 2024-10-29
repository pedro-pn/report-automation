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

var RliServiceDbFields = {
    CompareFields: [
      FormRLIFields.Service,
      FormRLIFields.Equipament,
      FormRLIFields.System,
      FormRLIFields.PipeMaterial,
      FormRLIFields.Size
    ],
    ConcatenationFields: [
      FormRLIFields.DegreasingMethod,
      FormRLIFields.FlushingMethod,
      FormRLIFields.InibitionMethod,
      FormRLIFields.Inspection,
      FormRLIFields.FilterImgs,
      FormRLIFields.PlateImgs,
      FormRLIFields.PhmeterImgs

    ],
    TotalIntervalFields: [
      "DegreaseInterval",
      "FlushingInterval",
      "InibitionInterval"
    ]
}

var RtpServiceDbFields = {
    CompareFields: [
      FormServicesFields.Service,
      FormServicesFields.Equipament,
      FormServicesFields.System,
      FormServicesFields.WorkPressure
    ],
    ConcatenationFields: [
      FormServicesFields.Steps,
      "Selecione os manômetros utilizados",
      "Fotos dos manômetros (tag e escala)",
      "Foto do sistema"
    ],
    TotalTimeField: [
      "TotalTime"
     ]
}

var RcpServiceDbFields = {
    CompareFields: [
      FormServicesFields.Service,
      FormServicesFields.Equipament,
      FormServicesFields.System,
      FormServicesFields.Oil,
      FormServicesFields.Type,
    ],
    ConcatenationFields: [
      "Contagem de partículas",
      FormServicesFields.DehydrationImg
    ],
    SubstituitionFields: [
      FormServicesFields.InicialPartCount,
      "Umidade inicial",
    ],
    TotalTimeField: [
     "TotalTime"
    ]
}

var RlrServiceDbFields = {
  CompareFields: [
    FormServicesFields.Service,
    FormServicesFields.Equipament,
    FormServicesFields.System,
    FormServicesFields.Material
  ],
  ConcatenationFields: [
    FormServicesFields.Steps,
    "Imagens do reservatório",
    "Imagens da boroscopia"
  ]
}

function checkServiceProgress(reportData, item, fields) {
    isServiceNew = getServiceFieldResponse(reportData, FormServicesFields.Progress, item) === "Não (começou hoje)" ? true: false;
    isServiceFinished = getServiceFieldResponse(reportData, FormServicesFields.Status, item) === "Sim" ? true: false;

    if (isServiceNew && isServiceFinished === false) {
      storeServiceData(reportData, item);
      return ;
    }
    else if (isServiceNew === true)
      return ;

    var currentServiceObject = reportData.formResponsesDict[item];
    var dbStoredService = serviceDb[reportData.missionName];
    var compareUnits = getCompareUnits(currentServiceObject, fields.CompareFields)
    var bestScore = Infinity
    var dbCompareUnits = []
    var bestIndex = -1;

    for (var i = 0; i < dbStoredService.length; i++) {
      var score = calculateScore(compareUnits, dbStoredService[i], fields.CompareFields)
        if (score < bestScore) {
          bestScore = score;
          bestIndex = i;
        }
        dbCompareUnits.push(dbStoredService[i])
    }
    // console.log(`=====================================\nservicesStored: \n${servicesStored}\n\nService in question: \n${serviceObject}\n\n\nBest score: ${bestScore}\tBest Index: ${bestIndex}\n\nBestService: ${servicesStored[bestIndex]}\n===================================`);
    mergeServiceResponses(currentServiceObject, dbStoredService[bestIndex], fields)
    // reportData.formResponsesDict[item] = dbStoredService[bestIndex]
    console.log(reportData.formResponsesDict[item])
    if (isServiceFinished)
      dbStoredService.splice(bestIndex, 1)
}

function mergeServiceResponses(currentServiceObject, storedService, fields) {
  if (fields.hasOwnProperty("SubstituitionFields"))
    substituteServiceResponses(currentServiceObject, storedService, fields.SubstituitionFields)
  if (fields.hasOwnProperty("TotalTimeField"))
    sumTotalServiceTime(currentServiceObject, storedService, fields.TotalTimeField)
  if (fields.hasOwnProperty("TotalIntervalFields"))
    sumTotalIntervalFields(currentServiceObject, storedService, fields.TotalIntervalFields);
  concatenateServiceResponses(currentServiceObject, storedService, fields.ConcatenationFields);
}

function sumTotalIntervalFields(currentServiceObject, storedService, fields) {
  for (let i = 0; i < fields.length; i++) {
    let currentInterval = currentServiceObject[fields[i]] == "" ? "00:00": currentServiceObject[fields[i]];
    let storedInterval = storedService[fields[i]] == "" ? "00:00":storedService[fields[i]];
    let totalInterval = sumTimeString(currentInterval, storedInterval);

    currentServiceObject[fields[i]] = totalInterval;
    storedService[fields[i]] = totalInterval;
  }
}

function sumTotalServiceTime(currentServiceObject, storedService, field) {
  var currentTime = currentServiceObject[field[0]] == "" ? "00:00": currentServiceObject[field[0]] ;
  var storedTime = storedService[field[0]] == "" ? "00:00":storedService[field[0]];
  var totalTime = sumTimeString(currentTime, storedTime)
  storedService[field[0]] = totalTime
  currentServiceObject[field[0]] = totalTime
}

function substituteServiceResponses(currentServiceObject, storedService, fields) {
  for (let i = 0; i < fields.length; i++) {
    var storeField = storedService[fields[i]];
    var serviceField = currentServiceObject[fields[i]]
    if (!(serviceField && storeField))
      continue ;
    if (currentServiceObject.hasOwnProperty(fields[i]) && storedService.hasOwnProperty(fields[i])) {
      if (storeField !== "Não realizada")
        currentServiceObject[fields[i]] = storeField;
    }
  }
}

function concatenateServiceResponses(currentServiceObject, storedService, fields) {
  for (let i = 0; i < fields.length; i++) {
    var storedField = storedService[fields[i]];
    var serviceField = currentServiceObject[fields[i]]
    // if (!(serviceField && storedField))
    //   continue ;
    var concatenateService = (storedField ?? []).concat(serviceField ?? [])
    var fieldSet = new Set(concatenateService);
    var fieldArray = Array.from(fieldSet);
    storedService[fields[i]] = fieldArray
    currentServiceObject[fields[i]] = fieldArray

  }
}

function storeServiceData(reportData, item) {
    var serviceObject = reportData.formResponsesDict[item];
    
    if (serviceDb.hasOwnProperty(reportData.missionName))
      serviceDb[reportData.missionName].push(serviceObject);
    else 
      serviceDb[reportData.missionName] = [serviceObject];
}


function calculateScore(compareUnits, serviceStored, fields) {
  var storedCompareUnits = getCompareUnits(serviceStored, fields);
  var score = 0;

  if (storedCompareUnits[0] !== compareUnits[0])
    return (Infinity)
  for (let i = 1; i < compareUnits.length; i++) {
    if (compareUnits[i])
      score += Levenshtein(compareUnits[i], storedCompareUnits[i]);
  }
  
  return (score);
}

function getCompareUnits(currentServiceObject, fields) {
  var compareUnits = [];

  for (let i = 0; i < fields.length; i++) {
    if (currentServiceObject.hasOwnProperty(fields[i]) == false)
        continue ;
    var unit = currentServiceObject[fields[i]];
    compareUnits.push(unit)
  }

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
