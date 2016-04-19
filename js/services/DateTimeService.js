/* global mario */

mario.service('dateTime', [ function () {
  this.modelDate = function (model, newDate) {
    model.date = {
      hours: newDate.getHours(),
      minutes: newDate.getMinutes(),
      days: newDate.getDate(),
      months: newDate.getMonth() + 1,
      years: newDate.getFullYear()}
  }

  this.updateDate = function (model) {
    let newDate = new Date()
    this.modelDate(model, newDate)
  }
  this.changeDate = function (model, index, direction) {
    let oldDate = model.date
    let newDate = new Date(
      index === 4 ? oldDate.years + direction : oldDate.years,
      index === 3 ? oldDate.months + direction : oldDate.months - 1,
      index === 2 ? oldDate.days + direction : oldDate.days,
      index === 0 ? oldDate.hours + direction : oldDate.hours,
      index === 1 ? oldDate.minutes + direction : oldDate.minutes)
    this.modelDate(model, newDate)
  }
}])
