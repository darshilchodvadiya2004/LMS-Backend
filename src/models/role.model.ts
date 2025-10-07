// Declares the Role model used to group permissions for users.
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import type { ModelRegistry } from './model.types';

enum TableNames {
  Roles = 'roles',
}

export interface RoleAttributes {
  id: number;
  name: string;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RoleCreationAttributes = Optional<RoleAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt'>;

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize): void {
    Role.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'created_at',
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'updated_at',
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: TableNames.Roles,
        modelName: 'Role',
        underscored: true,
      }
    );
  }

  static associate(models: ModelRegistry): void {
    Role.hasMany(models.User, { foreignKey: 'roleId', as: 'users' });
    Role.hasMany(models.Permission, { foreignKey: 'roleId', as: 'ownedPermissions' });
    Role.belongsToMany(models.Permission, {
      through: models.RolePermission,
      foreignKey: 'roleId',
      otherKey: 'permissionId',
      as: 'permissions',
    });
  }
}
