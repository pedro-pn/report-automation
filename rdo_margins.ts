//#region NIGHT SHIFT
function	fillReportNightShift(reportData: ReportData): void {
    var nightShiftFlag = reportData.searchFieldResponse(FormFields.HEADER.NIGHT_SHIFT);
    const reportState = ReportState.getInstance();

	if (nightShiftFlag === "Não")
		return ;
    
    var nightShiftStartTime = reportData.searchFieldResponse(FormFields.HEADER.NIGHT_SHIFT_START_TIME);
	var nightShiftExitTime = reportData.searchFieldResponse(FormFields.HEADER.NIGHT_SHIFT_EXIT_TIME);
	var dinnerTime = reportData.searchFieldResponse(FormFields.HEADER.TOTAL_DINNER_TIME);
	var	nightShiftEmployeesNum = reportData.searchFieldResponse(FormFields.HEADER.NIGHT_SHIFT_EMPLOYEES_NUM);
    
	reportState.setValueToBuffer(ReportCells.RDO.HEADER.NIGHT_SHIFT_START_TIME, nightShiftStartTime);
	reportState.setValueToBuffer(ReportCells.RDO.HEADER.NIGHT_SHIFT_EXIT_TIME, nightShiftExitTime);
	reportState.setValueToBuffer(ReportCells.RDO.HEADER.NIGHT_SHIFT_DINNER_TIME, dinnerTime);
	reportState.setValueToBuffer(ReportCells.RDO.HEADER.NIGHT_SHIFT_EMPLOYEES_NUM, nightShiftEmployeesNum);
}

function calculateNightShiftTime(reportData: ReportData): number {
    const nightShiftStartTime = reportData.searchFieldResponse(FormFields.HEADER.NIGHT_SHIFT_START_TIME) as string;
    const nightShiftExitTime = reportData.searchFieldResponse(FormFields.HEADER.NIGHT_SHIFT_EXIT_TIME) as string;
    const dinnerTime = reportData.searchFieldResponse(FormFields.HEADER.TOTAL_DINNER_TIME) as string;
    const totalShiftTime = getDiffHour(nightShiftStartTime, nightShiftExitTime);
    const shiftTime = getDiffHourAbs(hoursToHourString(totalShiftTime), dinnerTime);

    return (shiftTime);
}

function fillNightShiftOvertimeField(reportData: ReportData): boolean {
	const nightShiftTime = hoursToHourString(calculateNightShiftTime(reportData));
	const shiftTime = getShiftTime(reportData);
	const overtime = calculateOvertime(shiftTime, nightShiftTime);
	const reportState = ReportState.getInstance();

	if (overtime <= 0.5)
			return false;
	reportState.setValueToBuffer(ReportCells.RDO.FOOTER.NIGHT_SHIFT_OVERTIME, hoursToHourString(overtime));
	
	return (true);
}
//#endregion

//#region DAY SHIFT
function calculateDayShiftTime(reportData: ReportData): number {
    const dayShiftStartTime = reportData.searchFieldResponse(FormFields.HEADER.DAY_SHIFT_START_TIME) as string;
    const dayShiftExitTime = reportData.searchFieldResponse(FormFields.HEADER.DAY_SHIFT_EXIT_TIME) as string;
    const lunchtime = reportData.searchFieldResponse(FormFields.HEADER.TOTAL_LUNCHTIME) as string;
    const totalShiftTime = getDiffHour(dayShiftStartTime, dayShiftExitTime);
    const shiftTime = getDiffHourAbs(hoursToHourString(totalShiftTime), lunchtime);

    return (shiftTime);
}

function fillDayShiftOvertimeField(reportData: ReportData): boolean {
    const dayShiftTime = hoursToHourString(calculateDayShiftTime(reportData));
    const shiftTime = getShiftTime(reportData);
    const overtime = calculateOvertime(shiftTime, dayShiftTime);
	const reportState = ReportState.getInstance();

    if (overtime <= 0.5)
        return false;
    reportState.setValueToBuffer(ReportCells.RDO.FOOTER.DAY_SHIFT_OVERTIME, hoursToHourString(overtime))
    
    return (true);
}
//#endregion

//#region OVERTIME
function fillOvertimeCommentField(reportData: ReportData): void {
    const overtimeComment = reportData.searchFieldResponse(FormFields.HEADER.OVERTIME_COMMENT);
	const reportState = ReportState.getInstance();

    reportState.setValueToBuffer(ReportCells.RDO.FOOTER.OVERTIME_COMMENT, overtimeComment);
}

function fillOvertimeField(reportData: ReportData): void {
    const dayOvertime = fillDayShiftOvertimeField(reportData);
    const NightShift = reportData.searchFieldResponse(FormFields.HEADER.NIGHT_SHIFT);
    var	nightOvertime = false;
    if (NightShift === "Sim")
        nightOvertime = fillNightShiftOvertimeField(reportData);
    if (dayOvertime || nightOvertime)
        fillOvertimeCommentField(reportData);
}

function calculateOvertime(shiftTime: string, totalShiftTime: string): number {
    const overtime = getDiffHourAbs(totalShiftTime, shiftTime);
	if (totalShiftTime < shiftTime)
		return (-overtime)
    return (overtime);
}
//#endregion

//#region HEADER AND FOOTER
function fillStandByField(reportData: ReportData): void {
	if (reportData.searchFieldResponse(FormFields.HEADER.STAND_BY_VALIDITY) === "Não" || 
			reportData.searchFieldResponse(FormFields.HEADER.STAND_BY_FLAG) === "Não")
			return ;
	const standByTime = reportData.searchFieldResponse(FormFields.HEADER.STAND_BY_TIME);
	const standByMotive = reportData.searchFieldResponse(FormFields.HEADER.STAND_BY_MOTIVE); 
	const reportState = ReportState.getInstance();

	reportState.setValueToBuffer(ReportCells.RDO.FOOTER.STAND_BY_TIME, standByTime);
	reportState.setValueToBuffer(ReportCells.RDO.FOOTER.STAND_BY_MOTIVE, standByMotive);
}

function fillLeaderField(reportData: ReportData): void {
	const leaderInfo = reportData.getLeaderInfos();
	const reportState = ReportState.getInstance();

	reportState.setValueToBuffer(ReportCells.RDO.FOOTER.LEADER, leaderInfo.Name);
	reportState.setValueToBuffer(ReportCells.RDO.FOOTER.POSITION, leaderInfo.Position);
}

function fillReportSubHeader(reportData: ReportData): void {
	var dayShiftStartTime = reportData.searchFieldResponse(FormFields.HEADER.DAY_SHIFT_START_TIME);
	var dayShiftExitTime = reportData.searchFieldResponse(FormFields.HEADER.DAY_SHIFT_EXIT_TIME);
	var dayShiftLunchTime = reportData.searchFieldResponse(FormFields.HEADER.TOTAL_LUNCHTIME);
	var dayShiftNumOfEmployees = reportData.searchFieldResponse(FormFields.HEADER.DAY_SHIFT_EMPLOYEES_NUM);
	const reportState = ReportState.getInstance();

	reportState.setValueToBuffer(ReportCells.RDO.HEADER.DAY_SHIFT_START_TIME, dayShiftStartTime);
	reportState.setValueToBuffer(ReportCells.RDO.HEADER.DAY_SHIFT_EXIT_TIME, dayShiftExitTime);
	reportState.setValueToBuffer(ReportCells.RDO.HEADER.DAY_SHIFT_LUNCH_TIME, dayShiftLunchTime);
	reportState.setValueToBuffer(ReportCells.RDO.HEADER.DAY_SHIFT_EMPLOYEES_NUM, dayShiftNumOfEmployees);
  }

function fillReportHeader(reportData: ReportData): void {
	const reportState = ReportState.getInstance();

	reportState.setValueToBuffer(ReportCells.RDO.HEADER.RDO_NUMBER, reportData.reportNum);
	reportState.setValueToBuffer(ReportCells.RDO.HEADER.DATE, reportData.date);
	reportState.setValueToBuffer(ReportCells.RDO.HEADER.CLIENT, reportData.getClient());
	reportState.setValueToBuffer(ReportCells.RDO.HEADER.CNPJ, reportData.getCNPJ());
	reportState.setValueToBuffer(ReportCells.RDO.HEADER.PROPOSAL, reportData.getProposal());
  	reportState.setValueToBuffer(ReportCells.RDO.HEADER.MISSION_NAME, reportData.missionName);
}

function fillReportFooter(reportData: ReportData, spreadsheetManager: SpreadsheetManager): void {
	fillOvertimeField(reportData);
	fillStandByField(reportData);
	fillLeaderField(reportData);
	// fillClientLeaderField(reportData);
}

function fillActivities(reportData: ReportData): void {
    const activities = reportData.searchFieldResponse(FormFields.HEADER.ACTIVITIES)
	const reportState = ReportState.getInstance();

	if (typeof activities === "string")
		reportState.setValueToBuffer(ReportCells.RDO.HEADER.ACTIVITIES, activities.replace(/\n{2,}/g, '\n'));
}

function fillSignField(reportData: ReportData, spreadsheetManager: SpreadsheetManager, cell: string, width: number): void {
	let leaderAssId = reportData.getLeaderInfos().Ass
	if (leaderAssId == "")
		return ;
	let imageBlob = DriveApp.getFileById(leaderAssId).getBlob();
  	let cellNum = cellStringToNumber(cell);
 
	let image = spreadsheetManager.getFirstSheet().insertImage(imageBlob, cellNum[1] + 1, cellNum[0] + 1);
	let ratio = image.getHeight() / image.getWidth();
	image.setWidth(width);
	image.setHeight(width * ratio);
}

//#endregion
