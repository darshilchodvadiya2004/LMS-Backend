// Declares the RolePermission join model linking roles and permissions in a many-to-many relationship.
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import type { ModelRegistry } from './model.types';

enum TableNames {
  RolePermissions = 'role_permissions',
}

export interface RolePermissionAttributes {
  id: number;
  roleId: number;
  permissionId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RolePermissionCreationAttributes = Optional<RolePermissionAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class RolePermission
  extends Model<RolePermissionAttributes, RolePermissionCreationAttributes>
  implements RolePermissionAttributes
{
  public id!: number;
  public roleId!: number;
  public permissionId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize): void {
    RolePermission.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        roleId: {
          field: 'role_id',
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        permissionId: {
          field: 'permission_id',
          type: DataTypes.INTEGER,
          allowNull: false,
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
        tableName: TableNames.RolePermissions,
        modelName: 'RolePermission',
        underscored: true,
      }
    );
  }

  static associate(models: ModelRegistry): void {
    RolePermission.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
    RolePermission.belongsTo(models.Permission, { foreignKey: 'permissionId', as: 'permission' });
  }
}
