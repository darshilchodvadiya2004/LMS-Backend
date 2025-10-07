// Declares the Employee model used for linking SubMasters and permissions.
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import type { ModelRegistry } from './model.types';

enum TableNames {
  Employees = 'employees',
}

export interface EmployeeAttributes {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
  subMasterId: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type EmployeeCreationAttributes = Optional<EmployeeAttributes, 'id' | 'lastName' | 'subMasterId' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class Employee
  extends Model<EmployeeAttributes, EmployeeCreationAttributes>
  implements EmployeeAttributes
{
  public id!: number;
  public firstName!: string;
  public lastName!: string | null;
  public email!: string;
  public subMasterId!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  static initialize(sequelize: Sequelize): void {
    Employee.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        firstName: {
          field: 'first_name',
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        lastName: {
          field: 'last_name',
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(150),
          allowNull: false,
          unique: true,
        },
        subMasterId: {
          field: 'sub_master_id',
          type: DataTypes.INTEGER,
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
        tableName: TableNames.Employees,
        modelName: 'Employee',
        underscored: true,
        freezeTableName: true,
        paranoid: true,
      }
    );
  }

  static associate(models: ModelRegistry): void {
    Employee.belongsTo(models.SubMaster, { foreignKey: 'subMasterId', as: 'subMaster' });
  }
}
