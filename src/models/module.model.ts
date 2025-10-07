// Declares the Module model representing course modules.
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import type { ModelRegistry } from './model.types';

enum TableNames {
  Modules = 'modules',
}

export interface ModuleAttributes {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type ModuleCreationAttributes = Optional<ModuleAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class Module
  extends Model<ModuleAttributes, ModuleCreationAttributes>
  implements ModuleAttributes
{
  public id!: number;
  public courseId!: number;
  public title!: string;
  public description!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  static initialize(sequelize: Sequelize): void {
    Module.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        courseId: {
          field: 'course_id',
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
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
        tableName: TableNames.Modules,
        modelName: 'Module',
        underscored: true,
        freezeTableName: true,
        paranoid: true,
      }
    );
  }

  static associate(models: ModelRegistry): void {
    Module.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
  }
}
