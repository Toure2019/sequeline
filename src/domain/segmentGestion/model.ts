/* eslint-disable @typescript-eslint/camelcase */
import { Model, DataTypes } from 'sequelize'
import sequelize from '../../database/connection'

export const modelFields = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(45)
  },
  nom: {
    type: DataTypes.STRING(150)
  },
  visible: {
    type: DataTypes.SMALLINT
  }
}

class Segment extends Model {}
Segment.init(modelFields, {
  sequelize,
  underscored: true,
  freezeTableName: true,
  modelName: 't_segment_gestion',
  timestamps: false
})

export default Segment
