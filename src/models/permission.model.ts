// Declares the Permission model capturing module-specific CRUD capabilities.
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import type { ModelRegistry } from './model.types';

enum TableNames {
  Permissions = 'permissions',
}

export interface PermissionAttributes {
  id: number;
  module: string;
  action: 'create' | 'read' | 'update' | 'delete';
  roleId: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PermissionCreationAttributes = Optional<PermissionAttributes, 'id' | 'roleId' | 'createdAt' | 'updatedAt'>;

export class Permission
  extends Model<PermissionAttributes, PermissionCreationAttributes>
  implements PermissionAttributes
{
  public id!: number;
  public module!: string;
  public action!: 'create' | 'read' | 'update' | 'delete';
  public roleId!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize): void {
    Permission.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        module: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        action: {
          type: DataTypes.ENUM('create', 'read', 'update', 'delete'),
          allowNull: false,
        },
        roleId: {
          field: 'role_id',
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
      },
      {
        sequelize,
        indexes: [
          {
            unique: true,
            fields: ['module', 'action', 'role_id'],
          },
        ],
        tableName: TableNames.Permissions,
        modelName: 'Permission',
        underscored: true,
      }
    );
  }

  static associate(models: ModelRegistry): void {
    Permission.belongsTo(models.Role, { foreignKey: 'roleId', as: 'ownerRole' });
    Permission.belongsToMany(models.Role, {
      through: models.RolePermission,
      foreignKey: 'permissionId',
      otherKey: 'roleId',
      as: 'rolesWithAccess',
    });
  }
}
