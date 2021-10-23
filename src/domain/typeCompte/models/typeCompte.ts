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

class TypeCompte extends Model {}
TypeCompte.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_type_compte',
  timestamps: false
})

export default TypeCompte
