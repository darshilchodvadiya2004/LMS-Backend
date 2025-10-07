// Declares the CourseAssessment join model connecting courses and assessments.
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import type { ModelRegistry } from './model.types';

enum TableNames {
  CourseAssessments = 'course_assessments',
}

export interface CourseAssessmentAttributes {
  id: number;
  courseId: number;
  assessmentId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type CourseAssessmentCreationAttributes = Optional<CourseAssessmentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class CourseAssessment
  extends Model<CourseAssessmentAttributes, CourseAssessmentCreationAttributes>
  implements CourseAssessmentAttributes
{
  public id!: number;
  public courseId!: number;
  public assessmentId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  static initialize(sequelize: Sequelize): void {
    CourseAssessment.init(
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
        assessmentId: {
          field: 'assessment_id',
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
        tableName: TableNames.CourseAssessments,
        modelName: 'CourseAssessment',
        underscored: true,
        freezeTableName: true,
        paranoid: true,
      }
    );
  }

  static associate(models: ModelRegistry): void {
    CourseAssessment.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    CourseAssessment.belongsTo(models.Assessment, { foreignKey: 'assessmentId', as: 'assessment' });
  }
}
