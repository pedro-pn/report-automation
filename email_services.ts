function sendReportViaEmail(reportData: ReportData) {
    var recipient = reportData.getParameterInfos().Recipient;
    var subject = generateEmailSubject(reportData);
    var cc = reportData.getLeaderInfos().Email;
    var bcc = reportData.getParameterInfos().Bcc;
    var body = generateEmailBody(reportData);

    try {
      if (ReportState.debug) {
        MailApp.sendEmail( {
          to: bcc,
          subject: subject,
          htmlBody: body,
          attachments: ReportState.reportBlobs,
        })
        return ;
      }
      MailApp.sendEmail( {
          to: recipient,
          cc: cc,
          bcc: bcc,
          subject: subject,
          htmlBody: body,
          attachments: ReportState.reportBlobs,
      })
    } catch {
      console.log("Cannot send more e-mails today.")
    }
}

function generateEmailSubject(reportData: ReportData) {
    var subjectTemplate = reportData.getParameterInfos().EmailSubject;
    var subject = fillTemplate(subjectTemplate, {
        type: ReportTypes[ReportState.reportType],
        number: reportData.reportNum,
        reportName: reportData.missionName
    });
    return (subject);
}

function generateEmailBody(reportData: ReportData) {
    var bodyTemplate = reportData.getParameterInfos().EmailBody;
    var body = fillTemplate(bodyTemplate, {
        reportEditLink: reportData.getResponseEditLink()
    });

    return (body);
}
