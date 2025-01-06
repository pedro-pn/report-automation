class FormResponseProcessor {
    constructor(private formResponse: GoogleAppsScript.Forms.FormResponse) {}

    getResponsesAsDictionary(): FormResponseDict {
        const responses: FormResponseDict = {}; // está como const, mas talvez recisa ser alterado devido ao ReportDb.
        let index = 0;
    
        this.formResponse.getItemResponses().forEach(response => {
            const title = response.getItem().getTitle().trim();
            if (title === FormFields.HEADER.ADD_SERVICE)
                index++;
            else if (title === FormFields.HEADER.OVERTIME_COMMENT)
                index = 0;
            else if (title === FormFields.HEADER.ACTIVITIES)
                index = 0;
            if (!responses[index])
                responses[index] = {};
            responses[index][title] = response.getResponse();
        
        });

        return (responses);
        }
}