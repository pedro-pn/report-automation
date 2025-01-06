const WeekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

enum ReportTypes {
    RDO = 0,
	RTP = 1,
	RLQ = 2,
	RCP = 3,
	RLR = 4,
	RLI = 5,
}

const SpreadsheetIds = {
    DATABASE: '17P66MgM18LxaFnCZO3h82ai0F7vkSscbo8Ngvr9h9u8',
    MODEL_IDS: {
        [ReportTypes.RDO]: "1stkfMCGdpIDEc1u4xfS3Ldl9qXirgR_4mPYMcCjSxBM",
        [ReportTypes.RTP]: "10LbzYMJzF-zMYsYk7N5zB1AgW7-9QQZ3nsZUWu-VKN4",
        [ReportTypes.RLQ]: "1QYn2H5EdIjyuMvSLLOMkkCrWItzN2fwb3KOJBqjYEyU",
        [ReportTypes.RCP]: "1QVU8O6Ucz6CruI1-U9vLG3m0OEptwtsv1v-1ZTcA3so",
        [ReportTypes.RLR]: "1j7mazWihCwPlkVw6VxRKrrd27YKFw6iCFqo4O7pPJU0",
        [ReportTypes.RLI]: "1hB2wU91fS_JazpKpQ98i0mPfrDgOWlqJE4xR5MUoaCg"
    },
}
const ReportSpreadSheetFolderIds = {
    REPORT_FOLDER_ID: "1Fal8CBjtATle0l7MnhmP1LSJqUk7cB-9",
    REPORT_STANDARD_FOLDER_ID: "10Yoluq2U6o5sQS-YGSMNs83a6GnwRru5"
}

const ReportJSONIds = {
    REPORT_INFO: '1CEXqNgVBJOohszlvzw3B10nchUQ2eUIk',
    SERVICE_DB_ID:"10HNrvBY8tx6VWzsOreN5HYV9Pdhq9eEB"
}

const DBSheetColumns = {
    FORM_RESPONSE_ID: 0,
    REPORT_ID: 1,
    MISSION_NAME: 2,
    REPORT_NUM: 3,
    DATE: 4,
    EDIT_URL: 5,
    STATUS: 6,
    MAKE_REPORT: 7,
};

type ReportServiceCells = {
    SERVICE: string,
    EQUIPAMENT: string,
    SYSTEM: string,
    START_TIME: string,
    END_TIME: string,
    STATUS: string,
    PARAM_ONE: string,
    PARA_TWO: string,
    INFO: string,
    PARAM_ONE_KEY: string,
    PARAM_TWO_KEY: string,
    INFO_KEY: string,
    STEPS: string,
    OBS: string
}

const ReportsRanges = {
    RDO: {
        CELLS: {
            HEADER: {
                DAY_SHIFT_START_TIME: "B7",
                DAY_SHIFT_EXIT_TIME: "B8",
                DAY_SHIFT_LUNCH_TIME: "I7",
                DAY_SHIFT_EMPLOYEES_NUM: "N7",
                NIGHT_SHIFT_START_TIME: "D7",
                NIGHT_SHIFT_EXIT_TIME: "D8",
                NIGHT_SHIFT_DINNER_TIME: "I8",
                NIGHT_SHIFT_EMPLOYEES_NUM: "N8",
                RDO_NUMBER: "L5",
                SERVICE_NUMBER: "J5", // VERIFICAR USO
                DATE: "N5",
                CLIENT: "B6",
                CNPJ: "G6",
                PROPOSAL: "M6",
                ACTIVITIES: "C10",
                MISSION_NAME: "F5"
            },
            FOOTER: {
                SIGNATURE: "B81",
                NIGHT_SHIFT_OVERTIME: "D77",
                DAY_SHIFT_OVERTIME: "D76",
                OVERTIME_COMMENT: "B78",
                STAND_BY_TIME: "J76",
                STAND_BY_MOTIVE: "J78",
                LEADER: "B79",
                POSITION: "B80"
            },
            SERVICES: {
                1: {
                    SERVICE: "C12",
                    EQUIPAMENT: "C13",
                    SYSTEM: "C14",
                    START_TIME: "I12",
                    END_TIME: "M12",
                    STATUS: "I14",
                    PARAM_ONE: "I13",
                    PARAM_TWO: "M13",
                    INFO: "M14",
                    PARAM_ONE_KEY: "G13",
                    PARAM_TWO_KEY: "K13",
                    INFO_KEY: "L14",
                    STEPS: "B16",
                    OBS: "B17"
            
                },
            
                2: {
                    SERVICE: "C19",
                    EQUIPAMENT: "C20",
                    SYSTEM: "C21",
                    START_TIME: "I19",
                    END_TIME: "M19",
                    STATUS: "I21",
                    PARAM_ONE: "I20",
                    PARAM_TWO: "M20",
                    INFO: "M21",
                    PARAM_ONE_KEY: "G20",
                    PARAM_TWO_KEY: "K20",
                    INFO_KEY: "L21",
                    STEPS: "B23",
                    OBS: "B24"
                },
            
                3: {
                    SERVICE: "C26",
                    EQUIPAMENT: "C27",
                    SYSTEM: "C28",
                    START_TIME: "I26",
                    END_TIME: "M26",
                    STATUS: "I28",
                    PARAM_ONE: "I27",
                    PARAM_TWO: "M27",
                    INFO: "M28",
                    PARAM_ONE_KEY: "G27",
                    PARAM_TWO_KEY: "K27",
                    INFO_KEY: "L28",
                    STEPS: "B30",
                    OBS: "B31"
                },
            
                4: {
                    SERVICE: "C33",
                    EQUIPAMENT: "C34",
                    SYSTEM: "C35",
                    START_TIME: "I33",
                    END_TIME: "M33",
                    STATUS: "I35",
                    PARAM_ONE: "I34",
                    PARAM_TWO: "M34",
                    INFO: "M35",
                    PARAM_ONE_KEY: "G34",
                    PARAM_TWO_KEY: "K34",
                    INFO_KEY: "L35",
                    STEPS: "B37",
                    OBS: "B38"
                },
            
                5: {
                    SERVICE: "C40",
                    EQUIPAMENT: "C41",
                    SYSTEM: "C42",
                    START_TIME: "I40",
                    END_TIME: "M40",
                    STATUS: "I42",
                    PARAM_ONE: "I41",
                    PARAM_TWO: "M41",
                    INFO: "M42",
                    PARAM_ONE_KEY: "G41",
                    PARAM_TWO_KEY: "K41",
                    INFO_KEY: "L42",
                    STEPS: "B44",
                    OBS: "B45"
                },	
            
                6: {
                    SERVICE: "C47",
                    EQUIPAMENT: "C48",
                    SYSTEM: "C49",
                    START_TIME: "I47",
                    END_TIME: "M47",
                    STATUS: "I49",
                    PARAM_ONE: "I48",
                    PARAM_TWO: "M48",
                    INFO: "M49",
                    PARAM_ONE_KEY: "G48",
                    PARAM_TWO_KEY: "K48",
                    INFO_KEY: "L49",
                    STEPS: "B51",
                    OBS: "B52"
                },
            
                7: {
                    SERVICE: "C54",
                    EQUIPAMENT: "C55",
                    SYSTEM: "C56",
                    START_TIME: "I54",
                    END_TIME: "M54",
                    STATUS: "I56",
                    PARAM_ONE: "I55",
                    PARAM_TWO: "M55",
                    INFO: "M56",
                    PARAM_ONE_KEY: "G55",
                    PARAM_TWO_KEY: "K55",
                    INFO_KEY: "L56",
                    STEPS: "B58",
                    OBS: "B59"
                },
            
                8: {
                    SERVICE: "C61",
                    EQUIPAMENT: "C62",
                    SYSTEM: "C63",
                    START_TIME: "I61",
                    END_TIME: "M61",
                    STATUS: "I63",
                    PARAM_ONE: "I62",
                    PARAM_TWO: "M62",
                    INFO: "M63",
                    PARAM_ONE_KEY: "G62",
                    PARAM_TWO_KEY: "K62",
                    INFO_KEY: "L63",
                    STEPS: "B65",
                    OBS: "B66"
                },
            
                9: {
                    SERVICE: "C68",
                    EQUIPAMENT: "C69",
                    SYSTEM: "C70",
                    START_TIME: "I68",
                    END_TIME: "M68",
                    STATUS: "I70",
                    PARAM_ONE: "I69",
                    PARAM_TWO: "M49",
                    INFO: "M70",
                    PARAM_ONE_KEY: "G69",
                    PARAM_TWO_KEY: "K69",
                    INFO_KEY: "L70",
                    STEPS: "B72",
                    OBS: "B73"
                }	
            }
        },
        SERVICES: {
            FIRST_ROWS: {
                1: 11,
                2: 18,
                3: 25,
                4: 32,
                5: 39,
                6: 46,
                7: 53,
                8: 60,
                9: 67,
                LAST_ROW: 73
            },
            STATEMENTS: {
                INICIAL_ANALYSIS: "Análise inicial:",
                FINAL_ANALYSIS: "Análise final:",
                VOLUME: "Volume:",
                PIPE_MATERIAL: "Material da tubulação:",
                TANK_MATERIAL: "Material do tanque:",
                WORK_PRESSURE: "Pressão de trabalho:",
                TEST_PRESSURE: "Pressão de teste:",
                FLUID_TYPE: "Fluido:",
                OIL: "Óleo:"
            }
        }
    }
}

const FormFields = {
    HEADER: {
        DATE: "Data do relatório",
        MISSION: "Missão",
        DAY_SHIFT_START_TIME: "Horário de chegada a obra",
        DAY_SHIFT_EXIT_TIME: "Horário de saída da obra",
        TOTAL_LUNCHTIME: "Tempo total de intervalo de almoço",
        DAY_SHIFT_EMPLOYEES_NUM: "Quantidade de colaboradores (apenas turno diurno)",
        NIGHT_SHIFT: "Houve turno noturno?",
        NIGHT_SHIFT_START_TIME: "Horário de inicio do turno noturno",
        NIGHT_SHIFT_EXIT_TIME: "Horário de saída do turno noturno",
        TOTAL_DINNER_TIME: "Tempo total de intervalo de janta",
        NIGHT_SHIFT_EMPLOYEES_NUM: "Quantidade de colaboradores no turno noturno",
        STAND_BY_FLAG: "Teve período ocioso (stand-by)",
        STAND_BY_VALIDITY: "O período de aguardo foi por causa do cliente?",
        STAND_BY_TIME: "Tempo total em stand-by",
        STAND_BY_MOTIVE: "Motivo do período ocioso",
        OVERTIME_COMMENT: "Em caso de hora extra, indicar o responsável a mesma",
        ACTIVITIES: "Atividades/Observações",
        ADD_SERVICE: "Selecione o tipo de serviço que deseja adicionar informações"
    },
    SERVICES: {
        SERVICE: "Selecione o tipo de serviço que deseja adicionar informações",
        EQUIPAMENT: "Nome do equipamento",
        SYSTEM: "Nome do sistema",
        SIZE: "Diâmetro e comprimento das tubulações",
        OIL: "Óleo (nome, marca e viscosidade)",
        FLUID_TYPE: "Fluido do teste?",
        FLUSHING_TYPE: "Tipo de Flushing",
        STATUS: "Serviço finalizado?",
        PROGRESS: "Este serviço começou em dias anteriores?",
        START_TIME: "Horário de início/continuação",
        END_TIME: "Horário de término/pausa",
        OIL_NORM: "Selecione a norma de análise utilizada",
        INICIAL_PART_COUNT: "Contagem de partículas inicial",
        FINAL_PART_COUNT: "Contagem de partículas final",
        WORK_PRESSURE: "Pressão de trabalho",
        TEST_PRESSURE: "Pressão de teste",
        PIPE_MATERIAL: "Material das tubulações",
        TANK_MATERIAL: "Material do reservatório",
        DEHYDRATION_IMG: "Análise de umidade/desidratação",
        STEPS: "Etapas realizadas no dia",
        VOLUME: "Volume de óleo",
        OBS: "Observações"
    },
    RLI: {
        SERVICE: "Selecione o tipo de serviço que deseja adicionar informações",
        EQUIPAMENT: "Nome do equipamento",
        SYSTEM: "Nome do sistema",
        DESCRIPTION: "Descrição",
        PIPE_DRAW: "Código do desenho da tubulação",
        MATERIAL: "Material das tubulações",
        SIZE: "Diâmetro e comprimento das tubulações",
        STATUS: "Serviço finalizado?",
        PROGRESS: "Este serviço começou em dias anteriores?",
        START: "Horário de início/continuação",
        END: "Horário de término/pausa",
        DEGREASING: "Houve desengraxe do sistema neste dia?",
        DEGREASING_DURATION: "Duração do desengraxe",
        DEGREASING_METHOD: "Método de desengraxe",
        DEGREASING_TEMPERATURE: "Temperatura durante o desengraxe",
        FLUSHING: "Houve flushing do sistema neste dia?",
        FLUSHING_DURATION: "Duração do flushing",
        FLUSHING_METHOD: "Método de flushing",
        FLUSHING_TEMPERATURE: "Temperatura durante o flushing",
        INIBITION: "Houve inibição do sistema neste dia?",
        INIBITION_DURATION: "Duração da inibição",
        INIBITION_METHOD: "Método de inibição",
        INIBITION_TEMPERATURE: "Temperatura durante a inibição",
        INSPECTION: "Tipo de inspeção",
        FILTER_IMGS: "Imagens do filtro",
        PLATE_IMGS: "Imagens das plaquetas",
        PHMETER_IMGS: "Imagens do phmetro",
        PIPE_CODE: "Código do desenho da tubulação",
        OBS: "Observações"
    }
} as const;

type fieldResponse = string[][] | string[] | string;

type FormFieldsKeys = keyof typeof FormFields['HEADER'];
type ServiceFieldsKeys = keyof typeof FormFields['SERVICES'];
type RliFieldsKeys = keyof typeof FormFields['RLI'];

type ServiceFieldResponses = {
	[key in FormFieldsKeys | ServiceFieldsKeys | RliFieldsKeys]?: fieldResponse;
	
};

type FormResponseDict = {
	[pageNumber: number]: {
		[field: string]: fieldResponse;
	};
}

const ServiceApi = {
    URL_REQUEST_STRING: "https://docs.google.com/spreadsheets/d/${reportSpreadsheetId}\
/export?format=pdf\
&size=A4\
&portrait=true\
&fitw=true\
&sheetnames=false&printtitle=false\
&pagenumbers=false&gridlines=false\
&fzr=false\
&scale=4\
&gid=${reportSheetId}",
    API_URL: "https://script.google.com/macros/s/AKfycbwtkYaL13TlGTMoHwSsyW5LaBzNtGgBeZwCKxvdUy0EHcMwBycbzU36dBc4hS-IeMugIA/exec"
}

const FormId = "15AIFLqOUbhvio4D1_eAG16XB8mzExiXd8-4tSW-PLNk";

const ValidationRules = {
    CHECKBOX: SpreadsheetApp.newDataValidation().requireCheckbox().build(),
};