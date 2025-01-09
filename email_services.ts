function sendReportViaEmail(reportData: ReportData, reportState: ReportState) {
    var recipient = reportData.getParameterInfos().Recipient;
    var subject = generateEmailSubject(reportData, reportState);
    var cc = reportData.getLeaderInfos().Email;
    var bcc = reportData.getParameterInfos().Bcc;
    var body = generateEmailBody(reportData);

    try {
      if (reportState.getDebug()) {
        MailApp.sendEmail( {
          to: bcc,
          subject: subject,
          htmlBody: body,
          attachments: reportState.getReportBlobs(),
        })
        return ;
      }
      MailApp.sendEmail( {
          to: recipient,
          cc: cc,
          bcc: bcc,
          subject: subject,
          htmlBody: body,
          attachments: reportState.getReportBlobs(),
      })
    } catch {
      console.log("Cannot send more e-mails today.")
    }
}

function generateEmailSubject(reportData: ReportData, reportState: ReportState) {
    var subjectTemplate = reportData.getParameterInfos().EmailSubject;
    var subject = fillTemplate(subjectTemplate, {
        type: ReportTypes[reportState.getReportType()],
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
