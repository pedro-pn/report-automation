const Weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

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

/**@deprecated Specific case for 5663. Might be removed in the future */
const SpreadsheetIds5663 = {
    [ReportTypes.RDO]: "17e0EbLOVua6fWXacg9YZb0UfNHBo8H28aQ1M63WpcuA"
}

const ReportFolderIds = {
    REPORT_FOLDER_ID: "1Fal8CBjtATle0l7MnhmP1LSJqUk7cB-9",
    REPORT_STANDARD_FOLDER_ID: "10Yoluq2U6o5sQS-YGSMNs83a6GnwRru5"
}

const ReportJSONIds = {
    REPORT_INFO: '1CEXqNgVBJOohszlvzw3B10nchUQ2eUIk',
    SERVICE_DB_ID:"10HNrvBY8tx6VWzsOreN5HYV9Pdhq9eEB"
}

const DbSheetColumns = {
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

const ReportCells = {
    RDO: {
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
        },
        SERVICES_ROWS: {
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
        },
        FIRST_PAGE_INFO_ROWS: {
            START_ROW: 55,
            TOTAL: 3
        },
        SECOND_PAGE_HEADER_ROWS: {
            START_ROW: 7,
            TOTAL: 2
        }
    },
    SERVICES: {
        COMMON: {
            REPORT_NUM: "M5",
            MISSION: "F5",
            ASS: "B57",
            DATE: "O5",
            CLIENT: "B6",
            EQUIPAMENT: "C8",
            SYSTEM: "C9",
            PROPOSAL: "L6",
            OBS: "C5",
            LEADER: "B60",
            APPROVAL: "I53",
            REAPPROVAL: "L53"
        },
        RTP: {
            BODY: {
                EQUIPAMENT: "C8",
                SYSTEM: "C9",
                DESCRIPTION: "C10",
                MATERIAL: "C11",
                FLUID: "C12",
                PROJECT_PRESSURE: "K10",
                TEST_PRESSURE: "O10",
                START_TIME: "K11",
                END_TIME: "O11",
            },
            MANOMETER_INFO_CELLS: {
                0: ["C18", "F18", "J18", "L18"],
                1: ["C19", "F19", "J19", "L19"],
                2: ["C20", "F20", "J20", "L20"],
                3: ["C21", "F21", "J21", "L21"]
            },
            MANOMETER_IMG_CELLS: [
                "F25",
                "I25",
                "D25",
                "L25",
                "A25"
            ],
            SYSTEM_IMG_CELLS: [
                "F38",
                "I38",
                "C38",
                "L38"
            ]
        },
        RLQ: {
            BODY: {
                EQUIPAMENT: "C8",
                SYSTEM: "C9",
                DESCRIPTION: "C10",
                MATERIAL: "C12",
                PIPE_DRAW: "C13",
                BOROSCOPY_INSPECTION: "J9",
                VISUAL_INSPECTION: "L9",
                TEST_BODY: "N9",
                PRESSURIZED_CLEANING: "J11",
                IMERSION_CLEANING: "L11",
                FILLMENT_CLEANING: "N11",
                PULVERIZED_CLEANING: "J12"
            },
            STEPS:  [
                "I18",
                "I19",
                "I20",
                "I21",
                "L18",
                "L19",
                "L20",
                "L21",
            ],
            METHODS: [
                "J11",
                "L11",
                "N11",
                "J12"
            ],
            BODY_TEST: [
                "B25",
                "E25",
                "I25",
                "L25"
            ],
            SYSTEM_IMG: [
                "B38",
                "E38",
                "H38",
                "L38",
                "B51",
                "E51",
                "H51",
                "L51",
            ],
            PRODUCTS: [
                "C18",
                "C19",
                "C20",
                "C21",
                "C22",
                "F18",
                "F19",
                "F20",
                "F21",
                "F22",
            ]
        },
        RCP: {
            BODY: {
                EQUIPAMENT: "C8",
                SYSTEM: "C9",
                DESCRIPTION: "C10",
                OIL: "C11",
                VOLUME: "C12",
                "LCM 20": "J9",
                "LCM 30": "L9",
                "LASPAC I": "N9",
                DURATION: "D21",
                PRIMARY_FLUSH: "J11",
                SECONDARY_FLUSH: "J12",
                DEHYDRATION: "L12",
                FILTRATION: "N11",
                OIL_NORM: "D18",
                INICIAL_PART_COUNT: "D19",
                FINAL_PART_COUNT: "D20",
                INICIAL_HUMIDITY: "M19",
                FINAL_HUMIDITY: "M20"
            },
            PARTICLE_COUNT_IMGS: [
                "F25",
                "J25",
                "D25",
                "L25",
                "A25",
            ],
            DEHYDRATION_IMGS: [
                "E38",
                "I38",
                "A38",
                "L38"
            ]
        },
        RLR: {
            BODY: {
                EQUIPAMENT: "C8",
                SYSTEM: "C9",
                VOLUME: "C11",
                MATERIAL: "C12",
                BOROSCOPY: "C13",
                VISUAL: "E13"
            },
            TANK_IMG: [
                "B18",
                "E18",
                "I18",
                "M18"
            ],
            CLEANING_STEPS: [
                "I10",
                "I11",
                "I12",
                "I13",
                "L10",
                "L11",
                "L12",
                "L13"
            ],
            TANK_BOROSCOPY: [
                "B38",
                "E38",
                "I38",
                "M38",
                "B51",
                "E51",
                "I51",
                "M51",
            ]
        },
        RLI: {
            BODY: {
                EQUIPAMENT: "C8",
                SYSTEM: "C9",
                DESCRIPTION: "C10",
                MATERIAL: "C11",
                PIPE_DRAW: "C12",
                BOROSCOPY_INPSECTION: "J9",
                VISUAL_INSPECTION: "L9",
                TEST_BODY: "N9",
                PRESSURIZED_CLEANING: "J11",
                IMERSION_CLEANING: "L11",
                FILLMENT_CLEANING: "N11",
                PULVERIZED_CLEANING: "J12"
            },
            INIBITION_STEPS: [
                ["D18", "F18", "I18", "K18", "L18"],
                ["D19", "F19", "I19", "K19", "L19"],
                ["D20", "F20", "I20", "K20", "L20"]
            ],
            INIBITION_PLATE_IMGS: [
                "A38",
                "E38",
                "I38",
                "L38",
                "A45",
                "E45",
                "I45",
                "L45"
            ],
            INIBITION_FILTER_IMGS: [
                "E25",
                "I25",
                "A25",
                "L25"
            ],
            INIBITION_PHMETER_IMG: [
                "E52",
                "I52",
                "A52",
                "L52"
            ]
        },
    }
}

const ReportStatements = {
    RDO: {
        INICIAL_ANALYSIS: "Análise inicial:",
        FINAL_ANALYSIS: "Análise final:",
        VOLUME: "Volume:",
        PIPE_MATERIAL: "Material da tubulação:",
        TANK_MATERIAL: "Material do tanque:",
        WORK_PRESSURE: "Pressão de trabalho:",
        TEST_PRESSURE: "Pressão de teste:",
        FLUID_TYPE: "Fluido:",
        OIL: "Óleo:"
    },
    RLQ: {
        INSPECT: {
            VISUAL: "Visual",
            TEST_BODY: "Corpo de prova",
            BOROSCOPY: "Vídeo boroscopia",
        },
        STEPS: [
            "Montagem do Sistema",
            "Teste de estanqueidade",
            "Desengraxe",
            "Fase ácida",
            "Fase neutralizante",
            "Fase passivante",
            "Secagem",
            "Desmontagem do sistema"
        ],
        CHEMICAL_REAGENTS: {
            DEGREASE_ONE: "Hidróxido de sódio",
            DEGREASE_TWO: "Metassilicato de sódio",
            DEGREASE_THREE: "Tripolifosfato de sódio",
            CARBONIC_ACID_PHASE: "Ácido cítrico/fosfórico",
            STAINLESS_ACID_PHASE_ONE: "Ácido nítrico",
            STAINLESS_ACID_PHASE_TWO: "Ácido fluorídrico",
            NEUT_PHASE: "Carbonato de sódio",
            PASS_PHASE: "Nitrito de sódio"
        },
        CLEANING_METHODS: [
            "Circulação pressurizada",
            "Imersão",
            "Enchimento",
            "Pulverização"
        ]
    },
    RLR: {
        STEPS: [
        "Montagem de peças",
        "Drenagem do reservatório",
        "Secagem do reservatório",
        "Aspiração do reservatório",
        "Inspeção por boroscopia",
        "Abastecimento do reservatório",
        "Medição de gases",
        "Ventilação"
        ],
        INSPECTION: {
            BOROSCOPY: "Inspeção por boroscopia",
            VISUAL: "Inspeção visual"
        }
    },
    RLI: {
        CLEANING_METHODS: [
            "Circulação pressurizada",
            "Imersão",
            "Enchimento",
            "Pulverização"
        ]
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
        NIGHT_SHIFT_START_TIME: "Horário de início do turno noturno",
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
        COMMON: {
            SERVICE: "Selecione o tipo de serviço que deseja adicionar informações",
            EQUIPAMENT: "Nome do equipamento",
            SYSTEM: "Nome do sistema",
            SIZE: "Diâmetro e comprimento das tubulações",
            OIL: "Óleo (nome, marca e viscosidade)",
            STATUS: "Serviço finalizado?",
            PIPE_MATERIAL: "Material das tubulações",
            PROGRESS: "Este serviço começou em dias anteriores?",
            START_TIME: "Horário de início/continuação",
            END_TIME: "Horário de término/pausa",
            OBS: "Observações",
            APPROVATION: "Serviço aprovado pelo cliente?",
            STEPS: "Etapas realizadas no dia",
        },
        RTP: {
            WORK_PRESSURE: "Pressão de trabalho",
            TEST_PRESSURE: "Pressão de teste",
            FLUID_TYPE: "Fluido do teste?",
            MANOMETERS: "Selecione os manômetros utilizados",
            MANOMETER_IMG: "Fotos dos manômetros (tag e escala) e sistema",
        },
        RLQ: {
            PIPE_DRAW: "Código do desenho da tubulação",
            CLEANING_METHODS: "Método de limpeza",
            TEST_BODY: "Imagens de corpo de prova",
            INSPECTION: "Tipo de inspeção",
            PIPE_IMG: "Imagens da tubulação",
            MOUNTING: "Montagem do Sistema",
            TIGHTNESS: "Teste de estanqueidade",
            DEGREASE: "Desengraxe",
            ACID_PHASE: "Fase ácida",
            NEUT_PHASE: "Fase neutralizante",
            PASS_PHASE: "Fase passivante",
            DRYING: "Secagem",
            UNMOUNTING: "Desmontagem do sistema",
            BOROSCOPY: "Inspeção por boroscopia",
            SAMPLE: "Coleta de amostra"
        },
        RCP: {
            VOLUME: "Volume de óleo",
            FLUSHING_TYPE: "Tipo de Flushing",
            OIL_NORM: "Selecione a norma de análise utilizada",
            LASER_COUNT: "Equipamento de inspeção",
            COUNT_IMG: "Contagem de partículas",
            INICIAL_PART_COUNT: "Contagem de partículas inicial",
            FINAL_PART_COUNT: "Contagem de partículas final",
            DEHYDRATION: "Foi realizada desidratação do óleo?",
            DEHYDRATION_IMG: "Análise de umidade/desidratação",
            INICIAL_HUMIDITY: "Umidade inicial",
	        FINAL_HUMIDITY: "Umidade final",
            
        },
        RLR: {
            VOLUME: "Volume do reservatório",
            IMAGE: "Imagens do reservatório",
            TANK_MATERIAL: "Material do reservatório",
            BOROSCOPY_IMG: "Imagens da boroscopia",
            OBS: "Observações"
        }

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
};

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
    URL_PDF_REQUEST: "https://docs.google.com/spreadsheets/d/${reportSpreadsheetId}\
/export?format=pdf\
&size=A4\
&portrait=true\
&fitw=true\
&sheetnames=false&printtitle=false\
&pagenumbers=false&gridlines=false\
&fzr=false\
&scale=4",
    SERVICE_API_URL: "https://script.google.com/macros/s/AKfycbwtkYaL13TlGTMoHwSsyW5LaBzNtGgBeZwCKxvdUy0EHcMwBycbzU36dBc4hS-IeMugIA/exec"
}

const FormId = "15AIFLqOUbhvio4D1_eAG16XB8mzExiXd8-4tSW-PLNk";

const ValidationRules = {
    CHECKBOX: SpreadsheetApp.newDataValidation().requireCheckbox().build(),
};