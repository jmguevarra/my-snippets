/**
    * It updates the current date to the valid working days excluded Holidays in a calendar and weekends
    * @param date - current value date
    * @param excludedDates - dates
    * @returns - date
    */


moveToWorkingDaysWithExdates(date: Date, excludedDates: Date[]){
    if(excludedDates.length < 1) return date;

    const excludedDays = [0, 6]; // 0 is Sunday and 6 is Saturday
    let newDate = new Date(date);
    
    while (true) {
       let isExcludedDate = excludedDates.some((h) => h.toDateString() === newDate.toDateString());
       let isWeekend = excludedDays.includes(newDate.getDay());
       
       if (!isExcludedDate && !isWeekend) break;
       newDate.setDate(newDate.getDate() + 1);
    }

    return newDate;
}
