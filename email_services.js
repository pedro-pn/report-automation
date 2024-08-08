function sendReportViaEmail(reportData) {
    var recipient = reportData.getLeaderInfos().Email;
    var subject = generateEmailSubject(reportData);
    var body = generateEmailBody(reportData);

    MailApp.sendEmail( {
        to: recipient,
        subject: subject,
        htmlBody: body,
        attachments: [reportData.reportBlob],
    })
}

function generateEmailSubject(reportData) {
    var subjectTemplate = reportData.reportParams.EmailSubject;
    var subject = fillTemplate(subjectTemplate, {
        type: reportTypesString[reportType],
        number: reportData.reportNum,
        reportName: reportData.missionName
    });
    return (subject);
}

function generateEmailBody(reportData) {
    var bodyTemplate = reportData.reportParams.EmailBody;
    var body = fillTemplate(bodyTemplate, {
        reportEditLink: reportData.formResponse.getEditResponseUrl()
    });

    return (body);
}
