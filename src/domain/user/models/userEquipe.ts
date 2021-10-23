/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../../database/connection'

export const modelFields = {
  t_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  t_equipe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  t_role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  date_effet: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    primaryKey: true
  },
  date_effet_end: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  version: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  }
}

class UserEquipe extends Model {}

UserEquipe.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_user_equipes',
  timestamps: false
})

export default UserEquipe
