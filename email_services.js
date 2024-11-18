function sendReportViaEmail(reportData) {
    var recipient = reportData.reportParams.Recipient;
    var subject = generateEmailSubject(reportData);
    var cc = reportData.getLeaderInfos().Email;
    var bcc = reportData.reportParams.Bcc;
    var body = generateEmailBody(reportData);

    try {
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
    } catch {
      console.log("Cannot send more e-mails today.")
    }
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
