var reportBuffer;
var isEdit = false;

var reportInfoID = "1CEXqNgVBJOohszlvzw3B10nchUQ2eUIk"
var formId = "15AIFLqOUbhvio4D1_eAG16XB8mzExiXd8-4tSW-PLNk"
var reportFolderID = "1Fal8CBjtATle0l7MnhmP1LSJqUk7cB-9"
var reportStandardFolderID = "10Yoluq2U6o5sQS-YGSMNs83a6GnwRru5"
var spreadsheetDbId = "17P66MgM18LxaFnCZO3h82ai0F7vkSscbo8Ngvr9h9u8"

var ReportModelIds = {
	0: "1stkfMCGdpIDEc1u4xfS3Ldl9qXirgR_4mPYMcCjSxBM", // RDO
	2: "1QYn2H5EdIjyuMvSLLOMkkCrWItzN2fwb3KOJBqjYEyU" // RLQ

}

var reportTypes = {
	RDO: 0,
	RTP: 1,
	RLQ: 2,
	RCP: 3,
	RLR: 4,
}

var reportType = 0;

var counters = {
	TP: 0,
	LQ: 0,
	FLU: 0,
	FIL: 0,
	PC1: 0,
	PC2: 0,
	LR: 0
}

var HeaderFields = {
	Date: "Data do relatório",
	Mission: "Missão",
	DayShiftStartTime: "Horário de chegada a obra",
	DayShiftExitTime: "Horário de saída da obra",
	TotalLunchTime: "Tempo total de intervalo de almoço",
	DayShiftNumOfEmployees: "Quantidade de colaboradores (apenas turno diurno)",
	NightShift: "Houve turno noturno?",
	NightShiftStartTime: "Horário de inicio do turno noturno",
	NightShiftEndTime: "Horário de saída do turno noturno",
	TotalDinnerTime: "Tempo total de intervalo de janta",
	NightShiftNumOfEmployees: "Quantidade de colaboradores no turno noturno",
	StandByFlag: "Teve período ocioso (stand-by)",
	StandByValidity: "O período de aguardo foi por causa do cliente?",
	StandByTime: "Tempo total em stand-by",
	StandByMotive: "Motivo do período ocioso",
	OvertimeComment: "Em caso de hora extra, indicar o responsável a mesma",
	Activities: "Atividades/Observações",
	AddService: "Selecione o tipo de serviço que deseja adicionar informações"
}

var FormServicesFields = {
	Service: "Selecione o tipo de serviço que deseja adicionar informações",
	Equipament: "Nome do equipamento",
	System: "Nome do sistema",
	Size: "Diâmetro e comprimento das tubulações",
	Oil: "Óleo (nome, marca e viscosidade)",
	Fluid: "Fluido do teste?",
	Type: "Tipo de Flushing",
	Status: "Serviço finalizado?",
	Start: "Horário de início/continuação",
	End: "Horário de término/pausa",
	Inversion: "Inversão de fluxo",
	InicialPartCount: "Contagem de partículas inicial",
	FinalPartCount: "Contagem de partículas final",
	WorkPressure: "Pressão de trabalho",
	TestPressure: "Pressão de teste",
	PipeMaterial: "Material das tubulações",
	TankMaterial: "Material do reservatório",
	Steps: "Etapas realizadas no dia",
	Volume: "Volume de óleo",
	Obs: "Observações"
}

function setValueToBuffer(cellString, content) {
	var columnLetter = cellString.charAt(0);
	var columnNumber = columnLetter.charCodeAt(0) - 65;
	var rowNumber = parseInt(cellString.substring(1)) - 1;
	reportBuffer[rowNumber][columnNumber] = content;
}

function getValueFromBuffer(cellString) {
	let columnLetter = cellString.charAt(0);
	let columnNumber = columnLetter.charCodeAt(0) - 65;
	let rowNumber = parseInt(cellString.substring(1)) - 1;
	let value = reportBuffer[rowNumber][columnNumber];

	return (value);
};

function setAllValuesToZero(obj) {
	Object.keys(obj).forEach(key => {
	  obj[key] = 0;
	});
}
