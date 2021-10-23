import express from 'express'
import compression from 'compression' // compresses requests
import bodyParser from 'body-parser'
import path from 'path'
import cors from 'cors'
import * as moment from 'moment'
import auth from './middleware/auth'

// Controllers (route handlers)
import { authWithToken, login } from './controllers/auth.controller'
import {
  getUserInformations,
  getAllUtilisateursByListEquipe
} from './domain/user/controller/user'

import {
  getUserHistorique,
} from './domain/user/controller/userProperties'

import {
  getEtablissements,
} from './domain/etablissement/controller'

import { getAllDepartementsUos } from './domain/uo/controller'
import { getPlanning, profilePlanning, updatePlanning } from './domain/planning/controller'
import { getUserListsBySousEquipe, getUsersList, updateUserMailAndPhone } from './controllers/user.controller'
import { getUOsList } from './controllers/uo.controller'
import { getSousEquipesList } from './controllers/sousEquipe.controller'
import {
  getChantiersList,
  getComptes,
  getConditionsIntervention,
  getFamilles,
  getNatures,
  getSpecialites,
  getTypesChantier,
  insertChantier,
  getPlanningChantier,
  updateChantierCommentaire,
  updateImputationChantier,
} from './controllers/chantier.controller'

// Create Express server
const app = express()

// Express configuration
app.set('port', process.env.PORT || 3000)
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

// Configuration de moment
moment.locale('fr', {
  week: {
    dow: 6, // First day of week is Saturday
    doy: 12 // Used to determine first week of the year
  }
})

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }))

const router = express.Router()

/**
 * Primary app routes.
 */
 app.use('/api', router)

/**
 * Public routes
*/
router.post('/auth/login', login)
router.post('/auth/token', authWithToken)

/**
 * Protected routes
*/

// Administration
router.get(
  '/etablissement/all',
  auth('Super User', 'Administrateur RH', 'Administrateur comptable'),
  getEtablissements
)
router.get('/departements/uos', auth(), getAllDepartementsUos)

router.get('/utilisateurs', auth('Super User', 'Administrateur RH', 'Administrateur comptable'), getUsersList)
router.get('/utilisateur', auth(), getUserInformations)
router.put('/utilisateur', auth(), updateUserMailAndPhone)
router.get('/utilisateur/historique', auth(), getUserHistorique)
router.get('/equipes/utilisateurs', auth(), getAllUtilisateursByListEquipe)
router.get('/utilisateurs/equipe', auth(), getUserListsBySousEquipe)

router.get('/uos', auth('Super User', 'Administrateur RH', 'Administrateur comptable'), getUOsList)

router.get('/equipes', auth('Super User', 'Administrateur RH', 'Administrateur comptable'), getSousEquipesList)

// Chantiers
router.get('/typesChantier', auth(), getTypesChantier)
router.get('/specialites', auth(), getSpecialites)
router.get('/familles', auth(), getFamilles)
router.get('/natures', auth(), getNatures)
router.get('/conditionsIntervention', auth(), getConditionsIntervention)
router.get('/comptes', auth(), getComptes)
router.post('/chantier', auth(), insertChantier)
router.get('/chantiers', auth(), getChantiersList)
router.get('/planningChantier', auth(), getPlanningChantier)
router.put('/chantier/commentaire/update', auth(), updateChantierCommentaire)
router.post('/imputationChantier', auth(), updateImputationChantier)

// Planning import V2
router.post('/import/planning/profile', auth(), profilePlanning)
router.post('/import/planning/update', auth(), updatePlanning)
router.get('/weekPlanning', auth(), getPlanning)

export default app

// router.get('/bugl', auth('Super User', 'Administrateur RH', 'Administrateur comptable'), getAllBugl)
// router.get('/division', auth(), getAllDivisions)
// router.put(
//   '/etablissement',
//   auth('Super User', 'Administrateur RH', 'Administrateur comptable'),
//   updateEtablissement
// )
// router.get(
//   '/etablissement',
//   auth('Super User', 'Administrateur RH', 'Administrateur comptable'),
//   getAllEtablissements
// )

// router.get(
//   '/etablissement/types',
//   auth('Super User', 'Administrateur RH', 'Administrateur comptable'),
//   getAllTypesEtablissements
// )
// router.put('/rg', auth('Super User', 'Administrateur RH', 'Administrateur comptable'), updateTypeRg)
// router.get('/rg', auth('Super User', 'Administrateur RH', 'Administrateur comptable'), getAllRg)
// router.get(
//   '/rg/details',
//   auth('Super User', 'Administrateur RH', 'Administrateur comptable'),
//   getRgByCode
// )

// router.delete('/rg', auth('Super User', 'Administrateur RH', 'Administrateur comptable'), deleteRg)
// router.put(
//   '/departement',
//   auth('Super User', 'Administrateur RH', 'Administrateur comptable'),
//   updateDepartement
// )
// router.get(
//   '/departement',
//   auth('Super User', 'Administrateur RH', 'Administrateur comptable'),
//   getAllDepartements
// )

// router.get('/uoFavoris', auth(), getAllUoFavoris)
// router.post('/uoFavoris', auth(), createUoFavoris)
// router.get('/uo', auth(), getAllUo)
// router.get('/equipe', auth(), getAllSousEquipe)
// router.put('/equipe', auth(), updateSousEquipe)
// router.post('/equipe', auth(), addSousEquipe)
// router.get('/utilisateur/details', auth(), getUserById)

// router.get(
//   '/utilisateurs',
//   auth('Super User', 'Administrateur RH', 'Administrateur comptable'),
//   getAllUtilisateurs
// )

// router.get('/utilisateurs/codeRessources', auth(), getAllCodeRessources)
// router.get('/utilisateursExterieurs', auth(), getUsersExterieurs)
// router.delete('/utilisateur', auth(), deleteUserProperties)
// router.get('/user/roles', auth(), getUserRolesAccessibles)
// router.get('/role/edit', auth(), changeRole)
// router.get('/roles', auth(), getAllRoles)

// router.delete('/engin', auth('Super User', 'Administrateur comptable'), deleteEngin)
// router.put('/engin', auth('Super User', 'Administrateur comptable'), updateEngin)
// router.get('/engin', auth('Super User', 'Administrateur comptable'), getAllEngin)
// router.post('/engin', auth('Super User', 'Administrateur comptable'), addEngin)

// router.get('/segment', auth('Super User', 'Administrateur comptable'), getAllSegments)
// router.put('/segment', auth('Super User', 'Administrateur comptable'), updateSegment)

// router.get('/compte', auth(), getAllComptes)
// router.put('/compte', auth(), updateCompte)
// router.post('/compte', auth(), addCompte)
// router.get('/compte/filter', auth(), getFilter)
// router.get('/compte/filterValues', auth(), getFilterCompteValues)
// router.get('/compte/specialites', auth(), getSpecialite)
// router.get('/compte/typecomptes', auth(), getTypeCompte)
// router.get('/compte/withFilters', auth(), getComptesWithFilters)
// router.get('/compte/localisable', auth(), isCompteLocalisable)
// router.get('/compte/codeAbsence', auth(), getCompteCodeAbsence)

// router.get('/codeAbsence', auth(), getAllCodesAbsence)
// router.get('/codeAbsenceEtablissement', auth(), getAllCodesAbsenceBy)
// router.get('/codeAbsence/:id', auth(), getOneCodeAbsence)
// router.put('/codeAbsence', auth(), updateCodeAbsence)
// router.post('/codeAbsence', auth(), createCodeAbsence)

// router.post('/evs/default', auth(), setDefaultValues)
// router.put('/evs', auth(), updateFieldRules)
// router.put('/evs/position', auth(), updateFieldRulesPosition)
// router.get('/evs', auth(), getAllEvsRules)
// router.get('/evsData', getEvsbyUserWeek)
// router.post('/evsData', postEvsbyUserWeek)
// router.get('/chantier', auth(), getAllChantier)
// router.get('/chantier/users', auth(), getAllUsersInChantier)
// router.get('/chantierCalc', auth(), getAllCalculations)
// router.get('/chantierCalcAllChantier', auth(), getAllCalculationsForWeek)
// router.put('/chantier', auth(), updateChantier)
// router.post('/chantier', auth(), addChantier)
// router.get('/chantier/details', auth(), getDetailChantier)
// router.delete('/chantier', auth(), deleteChantier)
// router.put('/chantier/commentaire', auth(), updateChantierCommentaire)
// router.post('/userChantiers', auth(), addUserChantier)
// router.put('/userChantier', auth(), updateUserChantier)
// router.delete('/userChantier', auth(), deleteUserChantier)
// router.get('/userChantier', auth(), findOneById)
// router.get('/userChantiers', auth(), findAllChantierByUser)
// router.post('/ressourceChantiers', auth(), addRessourceChantier)
// router.get('/chantier/sousEquipe', auth(), getSousEquipeChantier)
// router.get('/chantier/engin', auth(), getEnginChantier)
// router.get('/chantier/departement', auth(), getDepartementChantier)
// router.get('/chantier/rg', auth(), getAllRgForChantier)
// router.get('/chantier/rgType', auth(), getEquipeRgType)
// router.get('/chantier/segmentGestion', auth(), getSegmentGestionChantier)
// router.get('/groupSettings', auth(), getAllGroupSettings)
// router.get('/groupRapport', auth(), getAllGroupRapport)
// router.put('/groupSettings', auth(), updateGroupSettings)
// router.put('/groupRapport', auth(), updateGroupRapport)
// router.post('/groupSettings', auth(), addGroupSettings)
// router.post('/groupRapport', auth(), addGroupRapport)
// router.delete('/groupSettings', auth(), deleteGroupSettings)
// router.delete('/groupRapport', auth(), deleteGroupRapport)
// router.get('/cru', auth(), getAllMonthPeriod)
// router.put('/cru', auth(), updatePeriod)
// router.post('/cru', auth(), addMonthPeriod)
// router.delete('/cru', auth(), deleteMonthPeriod)
// router.get('/productivite', auth(), getCalculationsProductivite)
// router.post('/productivite', auth(), updatePlanningProductivite)
// router.post('/productivite/absence', auth(), saveCodeAbsenceUserChantier)
// router.delete('/productivite/absence', auth(), deleteCodeAbsenceUserChantier)
// router.get('/productivite/absence', auth(), getAllAbsenceUser)
// router.get('/mainOeuvreCedee', auth(), getMainOeuvreCedee)
// router.get('/mainsOeuvreCedee', auth(), getAllMainOeuvreCedee)
// router.get('/mainsOeuvreCedeeWeek', auth(), getAllMainOeuvreCedeeWeek)
// router.post('/mainOeuvreCedee', auth(), saveMainOeuvreCedee)
// router.post('/mainOeuvreCedeeWeek', auth(), saveMainOeuvreCedeeWeek)
// router.delete('/mainOeuvreCedee', auth(), deleteMainOeuvreCedee)
// router.delete('/mainOeuvreCedeeWeek', auth(), deleteMainOeuvreCedeeWeek)
// router.get('/codeJs', auth(), getCodeJsByCode)
// router.get('/chantier/rapports', auth(), getAllChantierRapports)
// router.get('/rapports', auth(), getRapports)
// router.post('/rapport', auth(), upsertRapport)
// router.delete('/removeRapports', auth(), removeRapports)

// // Exportation
// router.get('/exportation/users', auth(), exportUsers)
// router.get('/exportation/comptes', auth(), exportComptes)
// router.get('/exportation/engins', auth(), exportEngins)
// router.get('/exportation/segment-gestions', auth(), exportSegmentGestions)

// // Duplicate
// router.post('/duplicate', auth(), duplicate)
