export const getDurationFromMSec = (s: number) => ({
    h: Math.floor(s / 1000 / 3600),
    m: Math.floor(((s / 1000) % 3600) / 60)
})

/** ********************************************************************************************* */
/* Une semaine SNCF commence toujours le 1er Samedi de l'année */
/** ********************************************************************************************* */
const getSaturday = (y: number = 2021, step: number = 1) => {
    const d = new Date(`${y}-01-01 00:00:00`)
    while (d.getDay() !== 6) {
      d.setDate(d.getDate() + (step))
    }
    return d
  }
  
  export const getSNCFWeekNumber = (year: number, date: string, step: number = 1) => {
    const dateAtMidnight = `${date} 00:00:00`
    const startDate = getSaturday(year, step)
    const allSaturdays = []
    while (allSaturdays.length < 52) {
      allSaturdays.push(startDate.toJSON())
      startDate.setDate(startDate.getDate() + 7)
    }
    return allSaturdays.findIndex((d: string) => {
      const saturday = new Date(d)
      saturday.setDate(saturday.getDate() + 6)
      return (new Date(dateAtMidnight).toJSON() >= d) && (new Date(dateAtMidnight).toJSON() <= saturday.toJSON())
    })
  }
  
  // in JS week starts on Sunday and ends on Sturday
  export const getLastSaturday = (date: string | Date, rank: number = 6) => {
    const d = new Date(date)
    while (d.getDay() !== rank) {
      d.setDate(d.getDate() - 1)
    }
    return d
  }

  export const getYYYMMDD = (d: Date) => (
    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`
  )
  
  export const getMinutes = (value: string) => +(value.split(':')[0]) * 60 + +(value.split(':')[1]) // 07:45 => 465 minutes

  export const minutesToHHMM = (totalMinutes: number) => {
    const hours = Math.trunc(totalMinutes / 60)  
    const minutes = totalMinutes % 60
    return `${Math.abs(hours).toString().padStart(2, '0')}:${Math.abs(minutes).toString().padStart(2, '0')}`
  }