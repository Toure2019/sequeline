/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(45),
    allowNull: false
  }
}

class Specialite extends Model {}
Specialite.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_specialite',
  timestamps: false
})

export default Specialite
