//#region NIGHT SHIFT
function	fillReportNightShift(reportData: ReportData): void {
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

function calculateNightShiftTime(reportData: ReportData): number {
    const nightShiftStartTime = reportData.searchFieldResponse(HeaderFields.NightShiftStartTime) as string;
    const nightShiftExitTime = reportData.searchFieldResponse(HeaderFields.NightShiftEndTime) as string;
    const dinnerInterval = reportData.searchFieldResponse(HeaderFields.TotalDinnerTime) as string;
    const totalShiftTime = getDiffHour(nightShiftStartTime, nightShiftExitTime);
    const shiftTime = getDiffHourAbs(hoursToHourString(totalShiftTime), dinnerInterval);

    return (shiftTime);
}

function fillNightShiftOvertimeField(reportData: ReportData): boolean {
	const nightShiftTime = hoursToHourString(calculateNightShiftTime(reportData));
	const shiftTime = getShiftTime(reportData);
	const overtime = calculateOvertime(shiftTime, nightShiftTime);
	if (overtime <= 0.5)
			return false;
	setValueToBuffer(ReportFooterCells.NightShiftOvertime, hoursToHourString(overtime));
	
	return (true);
}
//#endregion

//#region DAY SHIFT
function calculateDayShiftTime(reportData: ReportData): number {
    const dayShiftStartTime = reportData.searchFieldResponse(HeaderFields.DayShiftStartTime) as string;
    const dayShiftExitTime = reportData.searchFieldResponse(HeaderFields.DayShiftExitTime) as string;
    const lunchInterval = reportData.searchFieldResponse(HeaderFields.TotalLunchTime) as string;
    const totalShiftTime = getDiffHour(dayShiftStartTime, dayShiftExitTime);
    const shiftTime = getDiffHourAbs(hoursToHourString(totalShiftTime), lunchInterval);

    return (shiftTime);
}

function fillDayShiftOvertimeField(reportData: ReportData): boolean {
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
function fillOvertimeCommentField(reportData: ReportData):void {
    const overtimeComment = reportData.searchFieldResponse(HeaderFields.OvertimeComment);
    setValueToBuffer(ReportFooterCells.OvertimeComment, overtimeComment);
}

function fillOvertimeField(reportData: ReportData): void {
    const dayOvertime = fillDayShiftOvertimeField(reportData);
    const NightShift = reportData.searchFieldResponse(HeaderFields.NightShift);
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
	if (reportData.searchFieldResponse(HeaderFields.StandByValidity) === "Não" || 
			reportData.searchFieldResponse(HeaderFields.StandByFlag) === "Não")
			return ;
	const standByTime = reportData.searchFieldResponse(HeaderFields.StandByTime);
	const standByMotive = reportData.searchFieldResponse(HeaderFields.StandByMotive);
	setValueToBuffer(ReportFooterCells.StandByTime, standByTime);
	setValueToBuffer(ReportFooterCells.StandByMotive, standByMotive);
}

function fillLeaderField(reportData: ReportData): void {
	const leaderId = reportData.getMissionInfos().Leader;
	const leaderInfo = reportData.getLeaderInfos();

	setValueToBuffer(ReportFooterCells.Leader, leaderInfo.Name);
	setValueToBuffer(ReportFooterCells.Position, leaderInfo.Position);
}

function fillClientLeaderField(reportData: ReportData): void {
	const leader = reportData.getMissionInfos().ClientLeader;
	const position = reportData.reportInfo.getMissionInfo(reportData.missionName).ClientLeaderPosition;

	setValueToBuffer(ReportFooterCells.ClientLeader, leader);
	setValueToBuffer(ReportFooterCells.ClientPosition, position);
}

function fillReportSubHeader(reportData: ReportData): void {
	var dayShiftStartTime = reportData.searchFieldResponse(HeaderFields.DayShiftStartTime);
	var dayShiftExitTime = reportData.searchFieldResponse(HeaderFields.DayShiftExitTime);
	var dayShiftLunchTime = reportData.searchFieldResponse(HeaderFields.TotalLunchTime);
	var dayShiftNumOfEmployees = reportData.searchFieldResponse(HeaderFields.DayShiftNumOfEmployees);
	
	setValueToBuffer(ReportHeaderCells.DayShiftStartTime, dayShiftStartTime);
	setValueToBuffer(ReportHeaderCells.DayShiftExitTime, dayShiftExitTime);
	setValueToBuffer(ReportHeaderCells.DayShiftLunchTime, dayShiftLunchTime);
	setValueToBuffer(ReportHeaderCells.DayShiftNumOfEmployees, dayShiftNumOfEmployees);
  }

function fillReportHeader(reportData: ReportData): void {
	setValueToBuffer(ReportHeaderCells.RdoNumber, reportData.reportNum);
	setValueToBuffer(ReportHeaderCells.Date, reportData.date);
	setValueToBuffer(ReportHeaderCells.Client, reportData.getClient());
	setValueToBuffer(ReportHeaderCells.CNPJ, reportData.getCNPJ());
	setValueToBuffer(ReportHeaderCells.Proposal, reportData.getProposal());
  setValueToBuffer(ReportHeaderCells.Mission, reportData.missionName);
}

function fillReportFooter(reportData: ReportData): void {
	fillOvertimeField(reportData);
	fillStandByField(reportData);
	fillLeaderField(reportData);
	fillClientLeaderField(reportData);
	fillSignField(reportData, ReportFooterCells.Ass, 100);
}

function fillActivities(reportData: ReportData): void {
    const activities = reportData.searchFieldResponse(HeaderFields.Activities)
	if (typeof activities === "string")
		setValueToBuffer(ReportHeaderCells.Activities, activities.replace(/\n{2,}/g, '\n'));
}

function fillSignField(reportData: ReportData, cell: string, width: number): void {
	let imageBlob = DriveApp.getFileById(reportData.getLeaderInfos().Ass).getBlob();
  let cellNum = cellStringToNumber(cell);
 
	let image = reportData.reportFirstSheet.insertImage(imageBlob, cellNum[1] + 1, cellNum[0] + 1);
	let ratio = image.getHeight() / image.getWidth();
	image.setWidth(width);
	image.setHeight(width * ratio);
}

//#endregion
