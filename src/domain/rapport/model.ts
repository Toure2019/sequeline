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
  date_rapport: {
    type: DataTypes.DATE,
    
  },
  t_inter_chantier_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date_update: {
    type: DataTypes.DATE
  },
  t_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  photos_delete: {
    type: DataTypes.STRING(45)
  },
  set_auto: {
    type: DataTypes.TINYINT
  },
  version: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}

class Rapport extends Model {}
Rapport.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_rapport_inter_chantier',
  timestamps: false
})

export default Rapport
