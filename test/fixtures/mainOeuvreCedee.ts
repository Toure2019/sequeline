import { DATEFORMAT } from './../../src/util/util'
/* eslint-disable @typescript-eslint/camelcase */
import faker from 'faker'
import models from '../../src/domain'
import moment from 'moment'

const generateDuration = (): string => {
  let result = faker.random.number({min:0, max:23}).toString().padStart(2, '0')
  result += ':'
  result += faker.random.number({min:0, max:23}).toString().padStart(2, '0')
  result += ':00'
  return result
}

export const insertMainOeuvreFixtures = async (
  weekNumber: number,
  yearNumber: number,
  numberOfUser: number,
  codeUo: string) => {
  const mainOeuvreCedeeWeekArray = []
  const mainOeuvreCedeeArray = []

  for (let i = 0; i < numberOfUser; i++) {
    const idUser = i

    const momentDate = moment().week(weekNumber).year(yearNumber).startOf('week')

    const mainOeuvreCedeeWeek = {
      num_semaine: weekNumber,
      annee: yearNumber,
      t_uo_code: codeUo,
      t_user_id: i,
      commentaire: faker.random.word()
    }

    for (let y = 0; y < 7; y++) {
      const mainOeuvreCedee = {
        date: momentDate.format(DATEFORMAT), 
        t_uo_code: codeUo,
        t_user_id: idUser,
        duration: generateDuration(),
        commentaire: faker.random.word()
      }
      mainOeuvreCedeeArray.push(mainOeuvreCedee)
      momentDate.add(1,'days')
    }

    mainOeuvreCedeeWeekArray.push(mainOeuvreCedeeWeek)
  }

  await models.MainOeuvreCedeeWeek.bulkCreate(mainOeuvreCedeeWeekArray).catch(err => console.error(err))
  await models.MainOeuvreCedee.bulkCreate(mainOeuvreCedeeArray).catch(err => console.error(err))
}
