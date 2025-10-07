// Declares the Master model used as a parent catalogue for SubMasters.
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import type { ModelRegistry } from './model.types';

enum TableNames {
  Masters = 'masters',
}

export interface MasterAttributes {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  sequence: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type MasterCreationAttributes = Optional<MasterAttributes, 'id' | 'isActive' | 'sequence' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class Master extends Model<MasterAttributes, MasterCreationAttributes> implements MasterAttributes {
  public id!: number;
  public name!: string;
  public code!: string;
  public isActive!: boolean;
  public sequence!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  static initialize(sequelize: Sequelize): void {
    Master.init(
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
        tableName: TableNames.Masters,
        modelName: 'Master',
        underscored: true,
        freezeTableName: true,
        paranoid: true,
      }
    );
  }

  static associate(models: ModelRegistry): void {
    Master.hasMany(models.SubMaster, { foreignKey: 'masterId', as: 'subMasters' });
  }
}
