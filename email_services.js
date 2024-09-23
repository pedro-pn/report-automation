function sendReportViaEmail(reportData) {
    var recipient = reportData.getLeaderInfos().Email;
    var subject = generateEmailSubject(reportData);
    var cc = reportData.reportParams.Cc;
    var bcc = reportData.reportParams.Bcc;
    var body = generateEmailBody(reportData);

    if (debug) {
      MailApp.sendEmail( {
        to: bcc,
        subject: subject,
        htmlBody: body,
        attachments: reportBlobs,
       })
      return ;
    }
    MailApp.sendEmail( {
        to: recipient,
        cc: cc,
        bcc: bcc,
        subject: subject,
        htmlBody: body,
        attachments: reportBlobs,
    })
}

function generateEmailSubject(reportData) {
    var subjectTemplate = reportData.reportParams.EmailSubject;
    var subject = fillTemplate(subjectTemplate, {
        type: ReportTypesString[reportType],
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
