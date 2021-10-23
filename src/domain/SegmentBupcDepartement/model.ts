/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../database/connection'

export const modelFields = {
  t_departement_code: {
    type: DataTypes.STRING(45),
    primaryKey: true
  },
  t_segment_gestion_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  t_etablissement_code: {
    type: DataTypes.STRING(45)
  },
  to_client: {
    type: DataTypes.SMALLINT,
    primaryKey: true
  },
  version: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}

class DepartementSegmentGestion extends Model {}
DepartementSegmentGestion.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_departement_segment_gestion',
  timestamps: false
})

export default DepartementSegmentGestion
