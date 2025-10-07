// Declares the CourseAssignment join model connecting courses and assignments.
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import type { ModelRegistry } from './model.types';

enum TableNames {
  CourseAssignments = 'course_assignments',
}

export interface CourseAssignmentAttributes {
  id: number;
  courseId: number;
  assignmentId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type CourseAssignmentCreationAttributes = Optional<CourseAssignmentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class CourseAssignment
  extends Model<CourseAssignmentAttributes, CourseAssignmentCreationAttributes>
  implements CourseAssignmentAttributes
{
  public id!: number;
  public courseId!: number;
  public assignmentId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  static initialize(sequelize: Sequelize): void {
    CourseAssignment.init(
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
        assignmentId: {
          field: 'assignment_id',
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
        deletedAt: {
          field: 'deleted_at',
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: TableNames.CourseAssignments,
        modelName: 'CourseAssignment',
        underscored: true,
        freezeTableName: true,
        paranoid: true,
      }
    );
  }

  static associate(models: ModelRegistry): void {
    CourseAssignment.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    CourseAssignment.belongsTo(models.Assignment, { foreignKey: 'assignmentId', as: 'assignment' });
  }
}
