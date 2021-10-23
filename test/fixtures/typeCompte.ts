/* eslint-disable @typescript-eslint/camelcase */
import models from '../../src/domain'

export const insertTypeCompteFixtures = () => {
    const typeComptes = []

    let typeCompte = {
        id: 1,
        name: 'Travaux'
    }
    typeComptes.push(typeCompte)
    typeCompte = {
        id: 2,
        name: 'Maintenance'
    }
    typeComptes.push(typeCompte)
    typeCompte = {
        id: 3,
        name: 'Non Productif'
    }
    typeComptes.push(typeCompte)
    typeCompte = {
        id: 4,
        name: 'Sinistre'
    }
    typeComptes.push(typeCompte)
    typeCompte = {
        id: 5,
        name: 'Projet'
    }
    typeComptes.push(typeCompte)
    typeCompte = {
        id: 6,
        name: 'Prestation URA'
    }
    typeComptes.push(typeCompte)
    typeCompte = {
        id: 7,
        name: 'Prestation diverse'
    }
    typeComptes.push(typeCompte)
    typeCompte = {
        id: 8,
        name: 'Entretien des engins'
    }
    typeComptes.push(typeCompte)
    typeCompte = {
        id: 9,
        name: 'OGE'
    }
    typeComptes.push(typeCompte)
    typeCompte = {
        id: 10,
        name: 'Tiers'
    }
    typeComptes.push(typeCompte)
  
  models.TypeCompte.bulkCreate(typeComptes)
}