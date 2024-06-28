const HeaderFields = {
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

const FormServicesFields = {
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
		Service: "C22",
		Equipament: "C23",
		System: "C24",
		StartTime: "I22",
		EndTime: "M22",
		Status: "I24",
		ParamOne: "I23",
		ParamTwo: "M23",
		Info: "M24",
		ParamOneKey: "G23",
		ParamTwoKey: "K23",
		InfoKey: "L24",
		Steps: "B26",
		Obs: "B27"
	},
	
	3: {
		Service: "C30",
		Equipament: "C31",
		System: "C32",
		StartTime: "I30",
		EndTime: "M30",
		Status: "I32",
		ParamOne: "I31",
		ParamTwo: "M31",
		Info: "M32",
		ParamOneKey: "G31",
		ParamTwoKey: "K31",
		InfoKey: "L32",
		Steps: "B34",
		Obs: "B35"
	},
	
	4: {
		Service: "C38",
		Equipament: "C39",
		System: "C40",
		StartTime: "I38",
		EndTime: "M38",
		Status: "I40",
		ParamOne: "I39",
		ParamTwo: "M39",
		Info: "M40",
		ParamOneKey: "G39",
		ParamTwoKey: "K39",
		InfoKey: "L40",
		Steps: "B42",
		Obs: "B43"
	},
	
	5: {
		Service: "C46",
		Equipament: "C47",
		System: "C48",
		StartTime: "I46",
		EndTime: "M46",
		Status: "I48",
		ParamOne: "I47",
		ParamTwo: "M47",
		Info: "M48",
		ParamOneKey: "G47",
		ParamTwoKey: "K47",
		InfoKey: "L48",
		Steps: "B49",
		Obs: "B50"
	},
	
	6: {
		Service: "C54",
		Equipament: "C55",
		System: "C56",
		StartTime: "I54",
		EndTime: "M54",
		Status: "I56",
		ParamOne: "I55",
		ParamTwo: "M55",
		Info: "M56",
		ParamOneKey: "G55",
		ParamTwoKey: "K55",
		InfoKey: "L56",
		Steps: "B58",
		Obs: "B59"
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
