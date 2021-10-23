import Departement from './departement/model'
import Etablissement from './etablissement/models/etablissement'
import Division from './division/model'
import UO from './uo/models/uo'
import Rg from './Rg/model'
import Bugl from './bugl/model'
import UoFavoris from './uoFavoris/model'
import SousEquipe from './sousEquipe/model'
import User from './auth/model'
import UserRole from './user/models/userRole'
import UserProperties from './user/models/userProperties'
import Engin from './engin/model'
import Bupc from './SegmentBupc/model'
import DepartementSegmentGestion from './SegmentBupcDepartement/model'
import Segment from './segmentGestion/model'
import Compte from './compte/model/compte'
import CompteErp from './compte/model/compteErp'
import CompteAccessible from './compte/model/compteAccessible'
import CompteVisible from './compte/model/compteVisible'
import TypeCompte from './typeCompte/models/typeCompte'
import Specialite from './specialite/models/specialite'
import NiveauUo from './uo/models/niveauUo'
import TypeUO from './uo/models/typeUo'
import RgData from './Rg/typeModel'
import CodeAbsence from './codeAbsence/model'
import Evs from './evs/models/evs'
import EvsData from './evs/models/evsData'
import EvsWeek from './evs/models/evsWeek'
import EvsFieldRules from './evs/models/fieldRulesModel'
import EvsGroupSettings from './evs/models/evsGroupSettings'
import EvsGroupRapport from './evs/models/evsGroupRapport'
import CruMonthPeriod from './cru/CruMonthPeriodModel'
import Chantier from './chantier/models/chantier'
import HoursUserPlanning from './userPlanning/models/hoursUserPlanning'
import PlanningDataCalc from './userPlanning/models/planningCalcData'
import UserPlanning from './userPlanning/models/userPlanning'
import PlanningDefault from './userPlanning/models/planningDefault'
import Hours from './userPlanning/models/hours'
import ChantierDataCalc from './chantier/models/chantierDataCalc'
import UserChantier from './chantier/models/userChantier'
import EnginChantier from './chantier/models/enginChantier'
import TypeEtablissement from './etablissement/typeEtablissement'
import EtablissementData from './etablissement/models/etablissementData'
import FiltreCompte from './user/models/filtreCompte'
import CodeAbsenceUserChantier from './userPlanning/models/codeAbsenceUserChantier'
import UserEquipe from './user/models/userEquipe'
import MainOeuvreCedee from './mainOeuvreCedee/models/MainOeuvreCedee'
import MainOeuvreCedeeWeek from './mainOeuvreCedee/models/MainOeuvreCedeeWeek'
import UserPlanningDataCalc from './userPlanning/models/userPlanningDataCalc'
import CodeRessource from './codeRessource/model'
import EmploiRepere from './EmploiRepere/model'
import EmploiRepereCodeRessource from './EmploiRepereCodeRessource/model'
import Role from './user/models/roles'
import Rapport from './rapport/model'
import RapportData from './rapport/RapportData/model'

const models: any = {}

models.Role = Role
models.Division = Division
models.UO = UO
models.Rg = Rg
models.RgData = RgData
models.Departement = Departement
models.Etablissement = Etablissement
models.Bugl = Bugl
models.UoFavoris = UoFavoris
models.SousEquipe = SousEquipe
models.User = User
models.UserRole = UserRole
models.UserProperties = UserProperties
models.Engin = Engin
models.SegmentBUPC = Bupc
models.DepartementSegmentGestion = DepartementSegmentGestion
models.SegmentGestion = Segment
models.Compte = Compte
models.FiltreCompte = FiltreCompte
models.TypeCompte = TypeCompte
models.Specialite = Specialite
models.NiveauUo = NiveauUo
models.TypeUo = TypeUO
models.CodeAbsence = CodeAbsence
models.Evs = Evs
models.EvsData = EvsData
models.EvsWeek = EvsWeek
models.EvsFieldRules = EvsFieldRules
models.EvsGroupSettings = EvsGroupSettings
models.EvsGroupRapport = EvsGroupRapport
models.CruMonthPeriod = CruMonthPeriod
models.Chantier = Chantier
models.HoursUserPlanning = HoursUserPlanning
models.PlanningDataCalc = PlanningDataCalc
models.UserPlanning = UserPlanning
models.PlanningDefault = PlanningDefault
models.Hours = Hours
models.ChantierDataCalc = ChantierDataCalc
models.UserChantier = UserChantier
models.EnginChantier = EnginChantier
models.TypeEtablissement = TypeEtablissement
models.EtablissementData = EtablissementData
models.CompteErp = CompteErp
models.CompteAccessible = CompteAccessible
models.CompteVisible = CompteVisible
models.CodeAbsenceUserChantier = CodeAbsenceUserChantier
models.UserEquipe = UserEquipe
models.MainOeuvreCedee = MainOeuvreCedee
models.MainOeuvreCedeeWeek = MainOeuvreCedeeWeek
models.UserPlanningDataCalc = UserPlanningDataCalc
models.CodeRessource = CodeRessource
models.EmploiRepere = EmploiRepere
models.EmploiRepereCodeRessource = EmploiRepereCodeRessource
models.Rapport = Rapport
models.RapportData = RapportData

models.Rapport.hasMany(models.RapportData, {
  foreignKey: 't_rapport_inter_chantier_id',
  sourceKey: 'id'
})

models.RapportData.belongsTo(models.Rapport, {
  foreignKey: 't_rapport_inter_chantier_id',
  targetKey: 'id'
})

models.UserChantier.belongsTo(models.Chantier, {
  targetKey: 'id',
  foreignKey: 't_inter_chantier_id',
  constraints: false
})

models.CodeAbsenceUserChantier.belongsTo(models.CodeAbsence, {
  targetKey: 'id',
  foreignKey: 't_code_absence_id',
  constraints: false
})

models.MainOeuvreCedee.belongsTo(models.UO, {
  targetKey: 'code',
  foreignKey: 't_uo_code',
  constraints: false
})

models.MainOeuvreCedeeWeek.belongsTo(models.UO, {
  targetKey: 'code',
  foreignKey: 't_uo_code',
  constraints: false
})

models.User.hasMany(models.UserEquipe, {
  sourceKey: 'id',
  foreignKey: 't_user_id',
  constraints: false
})

models.SousEquipe.hasMany(models.UserEquipe, {
  sourceKey: 'id',
  foreignKey: 't_equipe_id',
  constraints: false
})

models.UserEquipe.belongsTo(models.SousEquipe, {
  targetKey: 'id',
  foreignKey: 't_equipe_id',
  constraints: false
})

models.Chantier.belongsTo(models.Engin, {
  targetKey: 'id',
  foreignKey: 't_engin_id',
  constraints: false
})

models.Compte.hasMany(models.FiltreCompte, {
  sourceKey: 'id',
  foreignKey: 't_compte_id',
  constraints: false
})

models.FiltreCompte.belongsTo(models.Compte, {
  targetKey: 'id',
  foreignKey: 't_compte_id'
})

models.Chantier.belongsTo(models.Compte, {
  targetKey: 'id',
  foreignKey: 't_compte_id'
})

models.Chantier.belongsTo(models.SousEquipe, {
  targetKey: 'id',
  foreignKey: 't_equipe_id'
})

models.Chantier.belongsTo(models.CompteErp, {
  targetKey: 'id',
  foreignKey: 't_compte_erp_id'
})

models.Chantier.belongsTo(models.SegmentGestion, {
  targetKey: 'id',
  foreignKey: 't_segment_gestion_id'
})

models.Chantier.belongsTo(models.ChantierDataCalc, {
  targetKey: 't_inter_chantier_id',
  foreignKey: 'id'
})

models.Etablissement.hasMany(models.EtablissementData, {
  sourceKey: 'code',
  foreignKey: 't_etablissement_code',
  constraints: false
})

models.TypeEtablissement.hasMany(models.Etablissement, {
  sourceKey: 'code',
  foreignKey: 't_type_etablissement_code',
  constraints: false
})
models.PlanningDataCalc.belongsTo(models.User, {
  targetKey: 'id',
  foreignKey: 't_user_id',
  constraints: false
})

models.UoFavoris.belongsTo(models.UO, {
  foreignKey: 't_uo_code',
  targetKey: 'code',
  constraints: false
})

models.UserProperties.belongsTo(models.SousEquipe, {
  foreignKey: 't_equipe_id',
  targetKey: 'id',
  constraints: false
})

models.UserProperties.belongsTo(models.User, {
  foreignKey: 't_user_id',
  targetKey: 'id',
  constraints: false
})

models.UserProperties.belongsTo(models.CodeRessource, {
  foreignKey: 't_code_ressource_code',
  targetKey: 'code',
  constraints: false
})

models.UserProperties.belongsTo(models.EmploiRepere, {
  foreignKey: 't_emploi_repere_code',
  targetKey: 'code',
  constraints: false
})

models.EmploiRepere.hasMany(models.UserProperties, {
  foreignKey: 't_emploi_repere_code',
  sourceKey: 'code',
  constraints: false
})

models.EmploiRepereCodeRessource.belongsTo(models.EmploiRepere, {
  foreignKey: 't_emploi_repere_code',
  targetKey: 'code',
  constraints: false
})

models.EmploiRepere.hasMany(models.EmploiRepereCodeRessource, {
  foreignKey: 't_emploi_repere_code',
  sourceKey: 'code',
  constraints: false
})

models.User.hasMany(models.UserProperties, {
  foreignKey: 't_user_id',
  sourceKey: 'id',
  constraints: false
})

models.UserRole.belongsTo(models.User, {
  foreignKey: 't_user_id',
  targetKey: 'id',
  constraints: false
})

models.UserRole.belongsTo(models.Role, {
  foreignKey: 't_role_id',
  targetKey: 'id',
  constraints: false
})

models.User.hasMany(models.UserRole, {
  foreignKey: 't_user_id',
  sourceKey: 'id',
  constraints: false
})

models.PlanningDefault.hasOne(models.Hours, {
  targetKey: 'code_hour',
  foreignKey: 'code_hour',
  constraints: false
})

models.PlanningDefault.belongsTo(models.User, {
  targetKey: 'id',
  foreignKey: 't_user_id',
  constraints: false
})

models.PlanningDataCalc.belongsTo(models.User, {
  targetKey: 'id',
  foreignKey: 't_user_id',
  constraints: false
})

models.HoursUserPlanning.belongsTo(models.User, {
  targetKey: 'id',
  foreignKey: 't_user_planning_t_user_id',
  constraints: false
})

models.UserPlanning.belongsTo(models.User, {
  targetKey: 'id',
  foreignKey: 't_user_id',
  constraints: false
})

models.EvsFieldRules.belongsTo(models.EvsGroupSettings, {
  targetKey: 'id',
  foreignKey: 't_evs_group_settings_id',
  constraints: false
})

models.Evs.hasMany(models.EvsData, {
  sourceKey: 'date',
  foreignKey: 'date',
  constraints: false
})

models.Evs.hasOne(models.EvsWeek, {
  sourceKey: 't_user_id',
  foreignKey: 't_user_id',
  constraints: true
})

models.EvsGroupSettings.hasMany(models.EvsFieldRules, {
  sourceKey: 'id',
  foreignKey: 't_evs_group_settings_id',
  constraints: false
})

models.EvsGroupRapport.hasMany(models.EvsFieldRules, {
  sourceKey: 'id',
  foreignKey: 't_evs_group_rapport_id',
  constraints: false
})

models.EvsFieldRules.belongsTo(models.EvsGroupRapport, {
  targetKey: 'id',
  foreignKey: 't_evs_group_rapport_id',
  constraints: false
})

models.EvsFieldRules.belongsTo(models.Etablissement, {
  targetKey: 'code',
  foreignKey: 't_etablissement_code',
  constraints: false
})

models.DepartementSegmentGestion.hasOne(models.Departement, {
  sourceKey: 't_departement_code',
  foreignKey: 'code',
  constraints: false
})

models.UO.hasMany(models.UserProperties, {
  foreignKey: 't_uo_code',
  targetKey: 'code',
  constraints: false
})

models.UserProperties.belongsTo(models.UO, {
  foreignKey: 't_uo_code',
  targetKey: 'code',
  constraints: false
})

models.TypeUo.hasMany(models.UO, {
  foreignKey: 't_type_uo_code',
  targetKey: 'code',
  constraints: false
})

models.UO.belongsTo(models.TypeUo, {
  sourceKey: 't_type_uo_code',
  targetKey: 'code',
  constraints: false
})

models.NiveauUo.hasMany(models.TypeUo, {
  foreignKey: 't_niveau_uo_code',
  targetKey: 'code',
  constraints: false
})

models.TypeUo.belongsTo(models.NiveauUo, {
  sourceKey: 't_niveau_uo_code',
  targetKey: 'code',
  constraints: false
})

models.Specialite.hasMany(models.Compte, {
  foreignKey: 't_specialite_id',
  sourceKey: 'id',
  constraints: false
})

models.Compte.belongsTo(models.Specialite, {
  foreignKey: 't_specialite_id',
  targetKey: 'id',
  constraints: false
})

models.TypeCompte.hasMany(Compte, {
  foreignKey: 't_type_compte_id',
  sourceKey: 'id',
  constraints: false
})

models.Compte.belongsTo(TypeCompte, {
  foreignKey: 't_type_compte_id',
  targetKey: 'id',
  constraints: false
})

models.SegmentGestion.hasMany(models.SegmentBUPC, {
  foreignKey: 't_segment_gestion_id',
  sourceKey: 'id',
  constraints: false
})

models.SegmentBUPC.belongsTo(models.SegmentGestion, {
  foreignKey: 't_segment_gestion_id',
  targetKey: 'id',
  constraints: false
})

models.SegmentGestion.hasMany(models.DepartementSegmentGestion, {
  foreignKey: 't_segment_gestion_id',
  sourceKey: 'id',
  constraints: false
})

models.DepartementSegmentGestion.belongsTo(models.SegmentGestion, {
  foreignKey: 't_segment_gestion_id',
  targetKey: 'id',
  constraints: false
})

models.User.hasMany(models.SousEquipe, {
  foreignKey: 't_user_id_create',
  sourceKey: 'id',
  constraints: false
})

models.User.belongsTo(models.UO, {
  foreignKey: 't_uo_code_assistant',
  targetKey: 'code',
  constraints: false
})

models.SousEquipe.belongsTo(models.User, {
  foreignKey: 't_user_id_create',
  target: 'id',
  constraints: false
})

models.Departement.hasMany(UO, {
  as: 'uos',
  foreignKey: 't_departement_code',
  sourceKey: 'code',
  constraints: false
})

models.Departement.hasMany(SousEquipe, {
  foreignKey: 't_departement_code',
  sourceKey: 'code',
  constraints: false
})

models.UO.hasMany(SousEquipe, {
  as: 'sousEquipes',
  foreignKey: 't_uo_code',
  sourceKey: 'code',
  constraints: false
})

models.Departement.belongsTo(Rg, {
  foreignKey: 't_rg_code',
  targetKey: 'code',
  constraints: false
})

models.Etablissement.hasMany(UO, {
  foreignKey: 't_etablissement_code',
  sourceKey: 'code',
  constraints: false
})

models.Division.belongsTo(Bugl, {
  foreignKey: 't_bugl_code',
  targetKey: 'code',
  constraints: false
})

models.Bugl.hasMany(Division, {
  foreignKey: 't_bugl_code',
  sourceKey: 'code',
  constraints: false
})

models.Division.hasMany(Rg, {
  foreignKey: 't_division_code',
  sourceKey: 'code',
  constraints: false
})

models.UO.belongsTo(Departement, {
  foreignKey: 't_departement_code',
  targetKey: 'code',
  constraints: false
})

models.UO.belongsTo(Etablissement, {
  foreignKey: 't_etablissement_code',
  targetKey: 'code',
  constraints: false
})

models.UO.hasMany(User, {
  foreignKey: 't_uo_code_assistant',
  targetKey: 'code',
  constraints: false
})

models.UO.hasOne(UO, {
  as: 'parentUO',
  constraints: false,
  targetKey: 't_uo_code_parent',
  foreignKey: 'code'
})

models.Rg.hasMany(Departement, {
  foreignKey: 't_rg_code',
  sourceKey: 'code',
  constraints: false
})

models.Rg.belongsTo(Division, {
  foreignKey: 't_division_code',
  targetKey: 'code',
  constraints: false
})

models.Rg.hasOne(RgData, {
  foreignKey: 't_rg_code',
  targetKey: 'code'
})

models.SousEquipe.belongsTo(Departement, {
  foreignKey: 't_departement_code',
  targetKey: 'code',
  constraints: false
})

models.SousEquipe.belongsTo(UO, {
  foreignKey: 't_uo_code',
  targetKey: 'code',
  constraints: false
})

models.SousEquipe.belongsTo(User, {
  foreignKey: 't_user_id_create',
  as: 'validateur',
  targetKey: 'id'
})

export default models
