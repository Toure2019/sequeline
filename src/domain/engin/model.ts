/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../database/connection'

export const modelFields = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(45)
  },
  libelle: {
    type: DataTypes.STRING(150)
  },
  unite: {
    type: DataTypes.SMALLINT
  },
  statut: {
    type: DataTypes.SMALLINT
  },
  version: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}

class Engin extends Model {}
Engin.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_engin',
  timestamps: false
})

export default Engin
