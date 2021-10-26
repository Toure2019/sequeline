import moment from 'moment'

export const DAYNTERVAL = 1000 * 60 * 60 * 24
export const DATEFORMAT = 'YYYY-MM-DD'
export const DATEFORMATL = 'YYYY-MM-DD HH:mm'

export const removeUndefined = (obj: any) => {
  for (const m in obj) {
    if (obj[m] == undefined) {
      delete obj[m]
    }
  }
}

export const now = (format) => {
  return moment().tz('Europe/Paris')
        .format(format)
}

function processDate(startDate, endDate, interval, format) {
  const duration = endDate - startDate
  const steps = duration / interval
  return Array.from(
    { length: steps + 1 },
    (v, i) =>
      `'${moment(new Date(startDate.valueOf() + interval * i))
        .tz('Europe/Paris')
        .format(format)}'`
  )
}

export const getDates = (startDate, endDate, interval) => {
  return processDate(startDate,endDate,interval,'YYYY-MM-DD HH:mm:ss')
}

export const getDatesShort = (startDate, endDate, interval) => {
  return processDate(startDate,endDate,interval,'YYYY-MM-DD')
}

/**
 * @param date date in format 'YYYY-MM-DD'
 * @return list of date in format 'YYYY-MM-DD' in the week without ''...
 */
export const getDatesWeek = (date: string): string[] => {
  const result = []
  const firstDate = moment(date, DATEFORMAT).startOf('week')
  for (let i = 0; i < 7; i++) {
    result.push(firstDate.format(DATEFORMAT))
    firstDate.add(1, 'days')
  }
  return result
}

/**
 * @param time 'HH:mm(:ss)'
 * @return number of second from midnight
 */
export const getDurationSecondFromTime = (time: string): number => {
  if (!time) {
    return 0
  }
  return (+time.slice(0, 2) * 60 * 60) + (+time.slice(3, 5) * 60)
}

export const get422Error = (response) => {
  return {
    type: 'unProcessableEntity',
    message: 'Erreur de validation',
    userMessage:
      'Des erreurs ont été détectées sur ce formulaire, veuillez les verifier avant de continuer.',
    error: response.error
  }
}
