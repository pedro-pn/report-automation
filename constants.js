const weekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const ReportServiceStatements = {
	InicialAnalysis: "Análise inicial:",
	FinalAnalysis: "Análise final:",
	Volume: "Volume:",
	pipeMaterial: "Material da tubulação:",
	tankMaterial: "Material do tanque:",
	WorkPressure: "Pressão de trabalho:",
	TestPressure: "Pressão de teste:",
	Fluid: "Fluido:",
	Oil: "Óleo:"
}

const ReportHeaderCells = {
	DayShiftStartTime: "B7",
	DayShiftExitTime: "B8",
	DayShiftLunchTime: "I7",
	DayShiftNumOfEmployees: "N7",
	NightShiftStartTime: "D7",
	NightShiftExitTime: "D8",
	NightShiftDinnerTime: "I8",
	NightShiftNumOfEmployees: "N8",
	RdoNumber: "L5",
	Date: "N5",
	Client: "B6",
	CNPJ: "G6",
	Proposal: "M6",
	Activities: "C10"
}

const ReportFooterCells = {
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

const ReportServiceRespCells = {
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
		Steps: "B43",
		Obs: "B44"
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