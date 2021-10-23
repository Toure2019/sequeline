/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  t_compte_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  t_filtre_compte_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true
  }
}

class FiltreCompte extends Model {}

FiltreCompte.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_filtre_compte',
  timestamps: false
})

export default FiltreCompte
