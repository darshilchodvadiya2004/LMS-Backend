// Declares the SystemEntity model representing configurable entities within the platform.
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import type { ModelRegistry } from './model.types';

enum TableNames {
  SystemEntities = 'system_entities',
}

export interface SystemEntityAttributes {
  id: number;
  name: string;
  code: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type SystemEntityCreationAttributes = Optional<SystemEntityAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class SystemEntity
  extends Model<SystemEntityAttributes, SystemEntityCreationAttributes>
  implements SystemEntityAttributes
{
  public id!: number;
  public name!: string;
  public code!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  static initialize(sequelize: Sequelize): void {
    SystemEntity.init(
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
        tableName: TableNames.SystemEntities,
        modelName: 'SystemEntity',
        underscored: true,
        freezeTableName: true,
        paranoid: true,
      }
    );
  }

  static associate(_models: ModelRegistry): void {
    // Associations handled in related models such as EmployeePermission.
  }
}
