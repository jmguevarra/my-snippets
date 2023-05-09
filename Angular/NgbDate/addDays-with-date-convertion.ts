convertDateToNgbDate(date: Date): NgbDate{
    return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }
  convertNgbDateToDate(date: NgbDate): Date{
    return new Date(date.year, date.month - 1, date.day);
  }

  addWorkingDaysByNgbDate(date: Date, addDays: number = 0): NgbDate{
    let currentNbgDate  = this.convertDateToNgbDate(date);
    if(addDays < 1) return currentNbgDate ;
    if(addDays == 1) return this.calendar.getNext(currentNbgDate);
    console.log(currentNbgDate, "verd");
    console.log(this.calendar.getNext(currentNbgDate), currentNbgDate, "testt");

    let addedDays = currentNbgDate;
    for (let i = 0; i <= addDays; i++) {
      addedDays = this.calendar.getNext(addedDays);
      const dayOfWeek = this.calendar.getWeekday(addedDays);
      if (dayOfWeek === 6  || dayOfWeek === 0 ) {
        i--;
        continue;
      }
    }
    return addedDays;
  }
