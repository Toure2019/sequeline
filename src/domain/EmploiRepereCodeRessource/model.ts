/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../database/connection'

export const modelFields = {
  t_emploi_repere_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  t_type_etablissement_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date_effet: {
    type: DataTypes.DATE,
    allowNull: false
  },
  t_code_ressource_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date_effet_end: {
    type: DataTypes.DATE,
    allowNull: false
  },
  version: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.DATE
  }
}

class EmploiRepereCodeRessource extends Model {}
EmploiRepereCodeRessource.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_emploi_repere_code_ressource',
  timestamps: false
})

export default EmploiRepereCodeRessource
