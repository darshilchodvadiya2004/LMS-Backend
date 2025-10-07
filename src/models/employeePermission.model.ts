// Declares the EmployeePermission model capturing fine-grained permissions for employees.
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import type { ModelRegistry } from './model.types';

enum TableNames {
  EmployeePermissions = 'employee_permissions',
}

export interface EmployeePermissionAttributes {
  id: number;
  empId: number;
  entityId: number;
  adminAccess: boolean;
  createPermission: boolean;
  readPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type EmployeePermissionCreationAttributes = Optional<
  EmployeePermissionAttributes,
  'id' | 'adminAccess' | 'createPermission' | 'readPermission' | 'updatePermission' | 'deletePermission' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export class EmployeePermission
  extends Model<EmployeePermissionAttributes, EmployeePermissionCreationAttributes>
  implements EmployeePermissionAttributes
{
  public id!: number;
  public empId!: number;
  public entityId!: number;
  public adminAccess!: boolean;
  public createPermission!: boolean;
  public readPermission!: boolean;
  public updatePermission!: boolean;
  public deletePermission!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  static initialize(sequelize: Sequelize): void {
    EmployeePermission.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        empId: {
          field: 'emp_id',
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        entityId: {
          field: 'entity_id',
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        adminAccess: {
          field: 'admin_access',
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        createPermission: {
          field: 'create_permission',
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        readPermission: {
          field: 'read_permission',
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        updatePermission: {
          field: 'update_permission',
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        deletePermission: {
          field: 'delete_permission',
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
        tableName: TableNames.EmployeePermissions,
        modelName: 'EmployeePermission',
        underscored: true,
        freezeTableName: true,
        paranoid: true,
      }
    );
  }

  static associate(models: ModelRegistry): void {
    EmployeePermission.belongsTo(models.SystemEntity, { foreignKey: 'entityId', as: 'entity' });
  }
}
