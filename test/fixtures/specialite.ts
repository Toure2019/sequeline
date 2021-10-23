/* eslint-disable @typescript-eslint/camelcase */
import models from '../../src/domain'

export const insertSpecialiteFixtures = () => {
    const specialites = []
    let specialite = {
        id: 5,
        name: 'ALL'
    }
    specialites.push(specialite)
    specialite = {
        id: 3,
        name: 'CAT'
    }
    specialites.push(specialite)
    specialite = {
        id: 9,
        name: 'EALE'
    }
    specialites.push(specialite)
    specialite = {
        id: 10,
        name: 'MOET'
    }
    specialites.push(specialite)
    specialite = {
        id: 8,
        name: 'OA/OT'
    }
    specialites.push(specialite)
    specialite = {
        id: 2,
        name: 'SE'
    }
    specialites.push(specialite)
    specialite = {
        id: 6,
        name: 'SE - SM'
    }
    specialites.push(specialite)
    specialite = {
        id: 4,
        name: 'SM'
    }
    specialites.push(specialite)
    specialite = {
        id: 7,
        name: 'TELECOM'
    }
    specialites.push(specialite)
    specialite = {
        id: 1,
        name: 'VOIE'
    }
    specialites.push(specialite)
    specialite = {
        id: 11,
        name: 'NPM'
    }
    specialites.push(specialite)
    specialite = {
        id: 12,
        name: 'CIRCULATION'
    }
    specialites.push(specialite)
    specialite = {
        id: 13,
        name: 'INFORMATIQUE'
    }
    specialites.push(specialite)

  models.Specialite.bulkCreate(specialites)
}
