// Declares the SubMaster model representing hierarchical catalogue entries linked to a Master.
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import type { ModelRegistry } from './model.types';

enum TableNames {
  SubMasters = 'sub_masters',
}

export interface SubMasterAttributes {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  masterId: number;
  parentId: number | null;
  sequence: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type SubMasterCreationAttributes = Optional<SubMasterAttributes, 'id' | 'isActive' | 'parentId' | 'sequence' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class SubMaster
  extends Model<SubMasterAttributes, SubMasterCreationAttributes>
  implements SubMasterAttributes
{
  public id!: number;
  public name!: string;
  public code!: string;
  public isActive!: boolean;
  public masterId!: number;
  public parentId!: number | null;
  public sequence!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  static initialize(sequelize: Sequelize): void {
    SubMaster.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        code: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
        },
        isActive: {
          field: 'is_active',
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        masterId: {
          field: 'master_id',
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        parentId: {
          field: 'parent_id',
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        sequence: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        createdAt: {
          field: 'created_at',
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          field: 'updated_at',
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        deletedAt: {
          field: 'deleted_at',
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: TableNames.SubMasters,
        modelName: 'SubMaster',
        underscored: true,
        freezeTableName: true,
        paranoid: true,
      }
    );
  }

  static associate(models: ModelRegistry): void {
    SubMaster.belongsTo(models.Master, { foreignKey: 'masterId', as: 'master' });
    SubMaster.belongsTo(models.SubMaster, { foreignKey: 'parentId', as: 'parent' });
    SubMaster.hasMany(models.SubMaster, { foreignKey: 'parentId', as: 'children' });
    SubMaster.hasMany(models.Employee, { foreignKey: 'subMasterId', as: 'employees' });
  }
}
