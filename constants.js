const weekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

var ReportTypes = {
	RDO: 0,
	RTP: 1,
	RLQ: 2,
	RCP: 3,
	RLR: 4,
}

var ReportTypesString = {
	0: "RDO",
	1: "RTP",
	2: "RLQ",
	3: "RCP",
	4: "RLR",
}

var ReportModelIds = {
	0: "1stkfMCGdpIDEc1u4xfS3Ldl9qXirgR_4mPYMcCjSxBM", // RDO
	1: "10LbzYMJzF-zMYsYk7N5zB1AgW7-9QQZ3nsZUWu-VKN4", // RTP
	2: "1QYn2H5EdIjyuMvSLLOMkkCrWItzN2fwb3KOJBqjYEyU", // RLQ
	3: "1QVU8O6Ucz6CruI1-U9vLG3m0OEptwtsv1v-1ZTcA3so", // RCPU
}

var ReportServiceStatements = {
	InicialAnalysis: "Análise inicial:",
	FinalAnalysis: "Análise final:",
	Volume: "Volume:",
	PipeMaterial: "Material da tubulação:",
	TankMaterial: "Material do tanque:",
	WorkPressure: "Pressão de trabalho:",
	TestPressure: "Pressão de teste:",
	Fluid: "Fluido:",
	Oil: "Óleo:"
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


var ReportHeaderCells = {
	DayShiftStartTime: "B7",
	DayShiftExitTime: "B8",
	DayShiftLunchTime: "I7",
	DayShiftNumOfEmployees: "N7",
	NightShiftStartTime: "D7",
	NightShiftExitTime: "D8",
	NightShiftDinnerTime: "I8",
	NightShiftNumOfEmployees: "N8",
	RdoNumber: "L5",
	ServiceNumber: "J5",
	Date: "N5",
	Client: "B6",
	CNPJ: "G6",
	Proposal: "M6",
	Activities: "C10"
}

var ReportFooterCells = {
	Ass: "B60",
	NightShiftOvertime: "D56",
	DayShiftOvertime: "D55",
	OvertimeComment: "B57",
	StandByTime: "J55",
	StandByMotive: "J56",
	Leader: "B58",
	Position: "B59",
	ClientLeader: "I58",
	ClientPosition: "I59"
}

var ReportServiceRespCells = {
	1: {
		Service: "C12",
		Equipament: "C13",
		System: "C14",
		StartTime: "I12",
		EndTime: "M12",
		Status: "I14",
		ParamOne: "I13",
		ParamTwo: "M13",
		Info: "M14",
		ParamOneKey: "G13",
		ParamTwoKey: "K13",
		InfoKey: "L14",
		Steps: "B16",
		Obs: "B17"

	},

	2: {
		Service: "C19",
		Equipament: "C20",
		System: "C21",
		StartTime: "I19",
		EndTime: "M19",
		Status: "I21",
		ParamOne: "I20",
		ParamTwo: "M20",
		Info: "M21",
		ParamOneKey: "G20",
		ParamTwoKey: "K20",
		InfoKey: "L21",
		Steps: "B23",
		Obs: "B24"
	},

	3: {
		Service: "C26",
		Equipament: "C27",
		System: "C28",
		StartTime: "I26",
		EndTime: "M26",
		Status: "I28",
		ParamOne: "I27",
		ParamTwo: "M27",
		Info: "M28",
		ParamOneKey: "G27",
		ParamTwoKey: "K27",
		InfoKey: "L28",
		Steps: "B30",
		Obs: "B31"
	},

	4: {
		Service: "C33",
		Equipament: "C34",
		System: "C35",
		StartTime: "I33",
		EndTime: "M33",
		Status: "I35",
		ParamOne: "I34",
		ParamTwo: "M34",
		Info: "M35",
		ParamOneKey: "G34",
		ParamTwoKey: "K34",
		InfoKey: "L35",
		Steps: "B37",
		Obs: "B38"
	},

	5: {
		Service: "C40",
		Equipament: "C41",
		System: "C42",
		StartTime: "I40",
		EndTime: "M40",
		Status: "I42",
		ParamOne: "I41",
		ParamTwo: "M41",
		Info: "M42",
		ParamOneKey: "G41",
		ParamTwoKey: "K41",
		InfoKey: "L42",
		Steps: "B44",
		Obs: "B45"
	},	

	6: {
		Service: "C47",
		Equipament: "C48",
		System: "C49",
		StartTime: "I47",
		EndTime: "M47",
		Status: "I49",
		ParamOne: "I48",
		ParamTwo: "M48",
		Info: "M49",
		ParamOneKey: "G48",
		ParamTwoKey: "K48",
		InfoKey: "L49",
		Steps: "B51",
		Obs: "B52"
	}	
}

const ServiceRows = {
	1: 11,
	2: 18,
	3: 25,
	4: 32,
	5: 39,
	6: 46,
	LastRow: 52
}

var reportInfoID = "1CEXqNgVBJOohszlvzw3B10nchUQ2eUIk"
var formId = "15AIFLqOUbhvio4D1_eAG16XB8mzExiXd8-4tSW-PLNk"
var reportFolderID = "1Fal8CBjtATle0l7MnhmP1LSJqUk7cB-9"
var reportStandardFolderID = "10Yoluq2U6o5sQS-YGSMNs83a6GnwRru5"
var spreadsheetDbId = "17P66MgM18LxaFnCZO3h82ai0F7vkSscbo8Ngvr9h9u8"

const urlRequestString = "https://docs.google.com/spreadsheets/d/${reportSpreadsheetId}\
/export?format=pdf\
&size=A4\
&portrait=true\
&fitw=true\
&sheetnames=false&printtitle=false\
&pagenumbers=false&gridlines=false\
&fzr=false\
&scale=4\
&gid=${reportSheetId}"

const serviceReportApi = "https://script.google.com/macros/s/AKfycbwtkYaL13TlGTMoHwSsyW5LaBzNtGgBeZwCKxvdUy0EHcMwBycbzU36dBc4hS-IeMugIA/exec";
