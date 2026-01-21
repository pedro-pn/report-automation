interface ServiceDbTypeFields {
  CompareFields: string[];
  ConcatenationFields: string[];
  SubstituitionFields?: string[];
  TotalIntervalFields?: string[];
  TotalTimeField?: string[];
}

const RlqServiceDbFields: ServiceDbTypeFields = {
    CompareFields: [
      FormFields.SERVICES.COMMON.SERVICE,
      FormFields.SERVICES.COMMON.EQUIPAMENT,
      FormFields.SERVICES.COMMON.SYSTEM,
      FormFields.SERVICES.COMMON.PIPE_MATERIAL,
      FormFields.SERVICES.COMMON.SIZE,
    ],
    ConcatenationFields: [
      "Tipo de inspeção",
      "Método de limpeza",
      FormFields.SERVICES.COMMON.STEPS,
      "Imagens de corpo de prova",
      "Imagens da tubulação"
    ]
}

const RliServiceDbFields: ServiceDbTypeFields = {
    CompareFields: [

      FormFields.SERVICES.RLI.SERVICE,
      FormFields.SERVICES.RLI.ID,
      FormFields.SERVICES.RLI.SYSTEM,
      FormFields.SERVICES.RLI.SERVICE_STEP
    ],
    ConcatenationFields: [
      FormFields.SERVICES.RLI.FILTER_IMGS,
      FormFields.SERVICES.RLI.PLATE_IMGS,
      FormFields.SERVICES.COMMON.STEPS
    ],
    SubstituitionFields: [
      FormFields.SERVICES.RLI.LINES
    ]
}

const RtpServiceDbFields: ServiceDbTypeFields = {
    CompareFields: [
      FormFields.SERVICES.COMMON.SERVICE,
      FormFields.SERVICES.COMMON.EQUIPAMENT,
      FormFields.SERVICES.COMMON.SYSTEM,
      FormFields.SERVICES.RTP.WORK_PRESSURE
    ],
    ConcatenationFields: [
      FormFields.SERVICES.COMMON.STEPS,
      "Selecione os manômetros utilizados",
      "Fotos dos manômetros (tag e escala) e sistema",
    ],
    TotalTimeField: [
      "TotalTime"
     ]
}

const RcpServiceDbFields: ServiceDbTypeFields = {
    CompareFields: [
      FormFields.SERVICES.COMMON.SERVICE,
      FormFields.SERVICES.COMMON.EQUIPAMENT,
      FormFields.SERVICES.COMMON.SYSTEM,
      FormFields.SERVICES.COMMON.OIL,
      FormFields.SERVICES.RCP.FLUSHING_TYPE,
    ],
    ConcatenationFields: [
      "Contagem de partículas",
      FormFields.SERVICES.RCP.DEHYDRATION_IMG
    ],
    SubstituitionFields: [
      FormFields.SERVICES.RCP.INICIAL_PART_COUNT,
      "Umidade inicial",
    ],
    TotalTimeField: [
     "TotalTime"
    ]
}

const RlrServiceDbFields: ServiceDbTypeFields = {
  CompareFields: [
    FormFields.SERVICES.COMMON.SERVICE,
    FormFields.SERVICES.COMMON.EQUIPAMENT,
    FormFields.SERVICES.COMMON.SYSTEM,
    FormFields.SERVICES.RLM.MATERIAL
  ],
  ConcatenationFields: [
    FormFields.SERVICES.COMMON.STEPS,
    "Imagens do reservatório",
    "Imagens da boroscopia"
  ]
}

function checkServiceProgress(reportData: ReportData, item: number, fields: ServiceDbTypeFields, serviceFieldResponseDb: ServiceFieldResponses): void {
    var isServiceNew = getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.PROGRESS, item) === "Não (começou hoje)" ? true: false;
    var isServiceFinished = getServiceFieldResponse(reportData, FormFields.SERVICES.COMMON.STATUS, item) === "Sim" ? true: false;

    if (isServiceNew && isServiceFinished === false) {
      storeServiceData(reportData, item, serviceFieldResponseDb);
      return ;
    }
    else if (isServiceNew === true)
      return ;

    var currentServiceObject = reportData.formResponsesDict[item];
    var dbStoredService = serviceFieldResponseDb[reportData.missionName];
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

function mergeServiceResponses(currentServiceObject, storedService, fields: ServiceDbTypeFields) {
  if (fields.hasOwnProperty("SubstituitionFields"))
    substituteServiceResponses(currentServiceObject, storedService, fields.SubstituitionFields)
  if (fields.hasOwnProperty("TotalTimeField"))
    sumTotalServiceTime(currentServiceObject, storedService, fields.TotalTimeField)
  if (fields.hasOwnProperty("TotalIntervalFields"))
    sumTotalIntervalFields(currentServiceObject, storedService, fields.TotalIntervalFields);
  concatenateServiceResponses(currentServiceObject, storedService, fields.ConcatenationFields);
}

function sumTotalIntervalFields(currentServiceObject, storedService, field: string[]) {
  for (let i = 0; i < field.length; i++) {
    let currentInterval = currentServiceObject[field[i]] == "" ? "00:00": currentServiceObject[field[i]];
    let storedInterval = storedService[field[i]] == "" ? "00:00":storedService[field[i]];
    let totalInterval = sumTimeString(currentInterval, storedInterval);

    currentServiceObject[field[i]] = totalInterval;
    storedService[field[i]] = totalInterval;
  }
}

function sumTotalServiceTime(currentServiceObject, storedService, field: string[]) {
  var currentTime = currentServiceObject[field[0]] == "" ? "00:00": currentServiceObject[field[0]] ;
  var storedTime = storedService[field[0]] == "" ? "00:00":storedService[field[0]];
  var totalTime = sumTimeString(currentTime, storedTime)
  storedService[field[0]] = totalTime
  currentServiceObject[field[0]] = totalTime
}

function substituteServiceResponses(currentServiceObject, storedService, field: string[]) {
  for (let i = 0; i < field.length; i++) {
      var storedField = storedService[field[i]] ?? "";
      var serviceField = currentServiceObject[field[i]] ?? "";
      if (storedField === "" && serviceField === "")
        continue ;
      else if (storedField === "" && serviceField !== "") // se não tiver nada armazenado e o atual for um valor, armazena este valor.
        storedService[field[i]] = serviceField;
      else if (serviceField === "" && storedField !== "") // se o atual for vazio e tiver algo armazenado, passa o valor armazenado para o atual.
        currentServiceObject[field[i]] = storedField;
      else if (storedField < currentServiceObject[field[i]]) // se o valor armazenado for menor que o valor atual, armazenar o valor atual.
        storedService[field[i]] = serviceField;
  }
}

function concatenateServiceResponses(currentServiceObject, storedService, field: string[]) {
  for (let i = 0; i < field.length; i++) {
    var storedField = storedService[field[i]];
    var serviceField = currentServiceObject[field[i]]
    if (serviceField === false && storedField === false)
      continue ;
    var concatenateService = (storedField || []).concat(serviceField || [])
    var fieldSet = new Set(concatenateService);
    var fieldArray =  Array.from(fieldSet);
    storedService[field[i]] = fieldArray
    currentServiceObject[field[i]] = fieldArray
  }
}

function storeServiceData(reportData: ReportData, item: number, serviceFieldResponseDb: ServiceFieldResponses) {
    var serviceObject = reportData.formResponsesDict[item];
    
    if (serviceFieldResponseDb.hasOwnProperty(reportData.missionName))
      serviceFieldResponseDb[reportData.missionName].push(serviceObject);
    else 
    serviceFieldResponseDb[reportData.missionName] = [serviceObject];
}


function calculateScore(compareUnits, serviceStored, field: string[]) {
  var storedCompareUnits = getCompareUnits(serviceStored, field);
  var score = 0;

  if (storedCompareUnits[0] !== compareUnits[0])
    return (Infinity)
  for (let i = 1; i < compareUnits.length; i++) {
    if (compareUnits[i])
      score += Levenshtein(compareUnits[i], storedCompareUnits[i]);
  }
  
  return (score);
}

function getCompareUnits(currentServiceObject, field: string[]) {
  var compareUnits = [];

  for (let i = 0; i < field.length; i++) {
    if (currentServiceObject.hasOwnProperty(field[i]) == false)
        continue ;
    var unit = currentServiceObject[field[i]];
    compareUnits.push(unit)
  }

  return (compareUnits);
}

function Levenshtein(string: string, stringEntries: string): number {
  var tmp;
  if (string.length === 0) { return stringEntries.length; }
  if (stringEntries.length === 0) { return string.length; }
  if (string.length > stringEntries.length) { tmp = string; string = stringEntries; stringEntries = tmp; }

  var i: number, j: number, score: number, alen: number = string.length, blen = stringEntries.length, row = Array(alen);
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
