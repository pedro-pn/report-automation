//#region NIGHT SHIFT
function	fillReportNightShift(reportData: ReportData): void {
    var nightShiftFlag = reportData.searchFieldResponse(FormFields.HEADER.NIGHT_SHIFT);
    
	if (nightShiftFlag === "Não")
		return ;
    
    var nightShiftStartTime = reportData.searchFieldResponse(FormFields.HEADER.NIGHT_SHIFT_START_TIME);
	var nightShiftExitTime = reportData.searchFieldResponse(FormFields.HEADER.NIGHT_SHIFT_EXIT_TIME);
	var dinnerTime = reportData.searchFieldResponse(FormFields.HEADER.TOTAL_DINNER_TIME);
	var	nightShiftEmployeesNum = reportData.searchFieldResponse(FormFields.HEADER.NIGHT_SHIFT_EMPLOYEES_NUM);
    
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.HEADER.NIGHT_SHIFT_START_TIME, nightShiftStartTime);
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.HEADER.DAY_SHIFT_EXIT_TIME, nightShiftExitTime);
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.HEADER.NIGHT_SHIFT_DINNER_TIME, dinnerTime);
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.HEADER.NIGHT_SHIFT_EMPLOYEES_NUM, nightShiftEmployeesNum);
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
	if (overtime <= 0.5)
			return false;
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.FOOTER.NIGHT_SHIFT_OVERTIME, hoursToHourString(overtime));
	
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
    if (overtime <= 0.5)
        return false;
    ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.FOOTER.DAY_SHIFT_OVERTIME, hoursToHourString(overtime))
    
    return (true);
}
//#endregion

//#region OVERTIME
function fillOvertimeCommentField(reportData: ReportData): void {
    const overtimeComment = reportData.searchFieldResponse(FormFields.HEADER.OVERTIME_COMMENT);
    ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.FOOTER.OVERTIME_COMMENT, overtimeComment);
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
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.FOOTER.STAND_BY_TIME, standByTime);
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.FOOTER.STAND_BY_MOTIVE, standByMotive);
}

function fillLeaderField(reportData: ReportData): void {
	const leaderInfo = reportData.getLeaderInfos();

	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.FOOTER.LEADER, leaderInfo.Name);
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.FOOTER.POSITION, leaderInfo.Position);
}

function fillReportSubHeader(reportData: ReportData): void {
	var dayShiftStartTime = reportData.searchFieldResponse(FormFields.HEADER.DAY_SHIFT_START_TIME);
	var dayShiftExitTime = reportData.searchFieldResponse(FormFields.HEADER.DAY_SHIFT_EXIT_TIME);
	var dayShiftLunchTime = reportData.searchFieldResponse(FormFields.HEADER.TOTAL_LUNCHTIME);
	var dayShiftNumOfEmployees = reportData.searchFieldResponse(FormFields.HEADER.DAY_SHIFT_EMPLOYEES_NUM);
	
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.HEADER.DAY_SHIFT_START_TIME, dayShiftStartTime);
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.HEADER.DAY_SHIFT_EXIT_TIME, dayShiftExitTime);
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.HEADER.DAY_SHIFT_LUNCH_TIME, dayShiftLunchTime);
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.HEADER.DAY_SHIFT_EMPLOYEES_NUM, dayShiftNumOfEmployees);
  }

function fillReportHeader(reportData: ReportData): void {
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.HEADER.RDO_NUMBER, reportData.reportNum);
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.HEADER.DATE, reportData.date);
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.HEADER.CLIENT, reportData.getClient());
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.HEADER.CNPJ, reportData.getCNPJ());
	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.HEADER.PROPOSAL, reportData.getProposal());
  	ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.HEADER.MISSION_NAME, reportData.missionName);
}

function fillReportFooter(reportData: ReportData, spreadsheetManager: SpreadsheetManager): void {
	fillOvertimeField(reportData);
	fillStandByField(reportData);
	fillLeaderField(reportData);
	// fillClientLeaderField(reportData);
}

function fillActivities(reportData: ReportData): void {
    const activities = reportData.searchFieldResponse(FormFields.HEADER.ACTIVITIES)
	if (typeof activities === "string")
		ReportState.setValueToBuffer(ReportsRanges.RDO.CELLS.HEADER.ACTIVITIES, activities.replace(/\n{2,}/g, '\n'));
}

function fillSignField(reportData: ReportData, spreadsheetManager: SpreadsheetManager, cell: string, width: number): void {
	let imageBlob = DriveApp.getFileById(reportData.getLeaderInfos().Ass).getBlob();
  	let cellNum = cellStringToNumber(cell);
 
	let image = spreadsheetManager.getFirstSheet().insertImage(imageBlob, cellNum[1] + 1, cellNum[0] + 1);
	let ratio = image.getHeight() / image.getWidth();
	image.setWidth(width);
	image.setHeight(width * ratio);
}

//#endregion
