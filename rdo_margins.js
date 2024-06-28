//#region NIGHT SHIFT
function	fillReportNightShift(reportData) {
    var nightShiftFlag = reportData.searchFieldResponse(HeaderFields.NightShift);
    
	if (nightShiftFlag === "Não")
		return ;
    
    var nightShiftStartTime = reportData.searchFieldResponse(HeaderFields.NightShiftStartTime);
	var nightShiftExitTime = reportData.searchFieldResponse(HeaderFields.NightShiftEndTime);
	var nightShiftDinnerTime = reportData.searchFieldResponse(HeaderFields.TotalDinnerTime);
	var	nightShiftNumOfEmployees = reportData.searchFieldResponse(HeaderFields.NightShiftNumOfEmployees);
    
	setValueToBuffer(ReportHeaderCells.NightShiftStartTime, nightShiftStartTime);
	setValueToBuffer(ReportHeaderCells.NightShiftExitTime, nightShiftExitTime);
	setValueToBuffer(ReportHeaderCells.NightShiftDinnerTime, nightShiftDinnerTime);
	setValueToBuffer(ReportHeaderCells.NightShiftNumOfEmployees, nightShiftNumOfEmployees);
}

function calculateNightShiftTime(reportData) {
    const nightShiftStartTime = reportData.searchFieldResponse(HeaderFields.NightShiftStartTime);
    const nightShiftExitTime = reportData.searchFieldResponse(HeaderFields.NightShiftEndTime);
    const dinnerInterval = reportData.searchFieldResponse(HeaderFields.TotalDinnerTime);
    const totalShiftTime = getDiffHour(nightShiftStartTime, nightShiftExitTime);
    const shiftTime = getDiffHourAbs(hoursToHourString(totalShiftTime), dinnerInterval);

    return (shiftTime);
}

function fillNightShiftOvertimeField(reportData) {
	const nightShiftTime = hoursToHourString(calculateNightShiftTime(reportData));
	const shiftTime = getShiftTime(reportData);
	const overtime = calculateOvertime(shiftTime, nightShiftTime);
	if (overtime <= 0.5)
			return false;
	setValueToBuffer("D63", hoursToHourString(overtime));
	
	return (true);
}
//#endregion

//#region DAY SHIFT
function calculateDayShiftTime(reportData) {
    const dayShiftStartTime = reportData.searchFieldResponse(HeaderFields.DayShiftStartTime);
    const dayShiftExitTime = reportData.searchFieldResponse(HeaderFields.DayShiftExitTime);
    const lunchInterval = reportData.searchFieldResponse(HeaderFields.TotalLunchTime);
    const totalShiftTime = getDiffHour(dayShiftStartTime, dayShiftExitTime);
    const shiftTime = getDiffHourAbs(hoursToHourString(totalShiftTime), lunchInterval);

    return (shiftTime);
}

function fillDayShiftOvertimeField(reportData) {
    const dayShiftTime = hoursToHourString(calculateDayShiftTime(reportData));
    const shiftTime = getShiftTime(reportData);
    const overtime = calculateOvertime(shiftTime, dayShiftTime);
    if (overtime <= 0.5)
        return false;
    setValueToBuffer(ReportFooterCells.DayShiftOvertime, hoursToHourString(overtime))
    
    return (true);
}
//#endregion

//#region OVERTIME
function fillOvertimeCommentField(reportData) {
    const overtimeComment = reportData.searchFieldResponse(HeaderFields.OvertimeComment);
    setValueToBuffer(ReportFooterCells.OvertimeComment, overtimeComment);
}

function fillOvertimeField(reportData) {
    const dayOvertime = fillDayShiftOvertimeField(reportData);
    const NightShift = reportData.searchFieldResponse(HeaderFields.NightShift);
    var	nightOvertime = false;
    if (NightShift === "Sim")
        nightOvertime = fillNightShiftOvertimeField(reportData);
    if (dayOvertime || nightOvertime)
        fillOvertimeCommentField(reportData);
}

function calculateOvertime(shiftTime, totalShiftTime) {
    const overtime = getDiffHourAbs(totalShiftTime, shiftTime);
	if (totalShiftTime < shiftTime)
		return (-overtime)
    return (overtime);
}
//#endregion

//#region HEADER AND FOOTER
function fillStandByField(reportData) {
	if (reportData.searchFieldResponse(HeaderFields.StandByValidity) === "Não" || 
			reportData.searchFieldResponse(HeaderFields.StandByFlag === "Não"))
			return ;
	const standByTime = reportData.searchFieldResponse(HeaderFields.StandByTime);
	const standByMotive = reportData.searchFieldResponse(HeaderFields.StandByMotive);
	setValueToBuffer(ReportFooterCells.StandByTime, standByTime);
	setValueToBuffer(ReportFooterCells.StandByMotive, standByMotive);
}


function fillLeaderField(reportData) {
	const leader = reportData.reportInfo.getMissionInfo(reportData.name).Leader;
	const position = reportData.reportInfo.getMissionInfo(reportData.name).Position;

	setValueToBuffer(ReportFooterCells.Leader, leader);
	setValueToBuffer(ReportFooterCells.Position, position);
}

function fillClientLeaderField(reportData) {
	const leader = reportData.reportInfo.getMissionInfo(reportData.name).ClientLeader;
	const position = reportData.reportInfo.getMissionInfo(reportData.name).ClientLeaderPosition;

	setValueToBuffer(ReportFooterCells.ClientLeader, leader);
	setValueToBuffer(ReportFooterCells.ClientPosition, position);
}

function fillReportSubHeader(reportData) {
	var dayShiftStartTime = reportData.searchFieldResponse(HeaderFields.DayShiftStartTime);
	var dayShiftExitTime = reportData.searchFieldResponse(HeaderFields.DayShiftExitTime);
	var dayShiftLunchTime = reportData.searchFieldResponse(HeaderFields.TotalLunchTime);
	var dayShiftNumOfEmployees = reportData.searchFieldResponse(HeaderFields.DayShiftNumOfEmployees);
	
	setValueToBuffer(ReportHeaderCells.DayShiftStartTime, dayShiftStartTime);
	setValueToBuffer(ReportHeaderCells.DayShiftExitTime, dayShiftExitTime);
	setValueToBuffer(ReportHeaderCells.DayShiftLunchTime, dayShiftLunchTime);
	setValueToBuffer(ReportHeaderCells.DayShiftNumOfEmployees, dayShiftNumOfEmployees);
  }

function fillReportHeader(reportData) {
	setValueToBuffer(ReportHeaderCells.RdoNumber, reportData.rdo);
	setValueToBuffer(ReportHeaderCells.Date, reportData.date);
	setValueToBuffer(ReportHeaderCells.Client, reportData.getClient());
	setValueToBuffer(ReportHeaderCells.CNPJ, reportData.getCNPJ());
	setValueToBuffer(ReportHeaderCells.Proposal, reportData.getProposal());
}

function fillReportFooter(reportData) {
	fillOvertimeField(reportData);
	fillStandByField(reportData);
	fillLeaderField(reportData);
	fillClientLeaderField(reportData);
}

function fillActivities(reportData) {
    const activities = reportData.searchFieldResponse(HeaderFields.Activities)
	setValueToBuffer(ReportHeaderCells.Activities, activities.replace(/\n{2,}/g, '\n'));
}
//#endregion
