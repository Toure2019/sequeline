/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../database/connection'

export const modelFields = {
  bupc: {
    type: DataTypes.STRING(45),
    primaryKey: true
  },
  t_segment_gestion_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  date_effet: {
    type: DataTypes.DATE
  },
  date_effet_end: {
    type: DataTypes.DATE
  },
  enabled: {
    type: DataTypes.TINYINT
  },
  version: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}

class Bupc extends Model {}
Bupc.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_bupc_segment_gestion',
  timestamps: false
})

export default Bupc
