// Declares the Course model representing comprehensive training programmes.
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import type { ModelRegistry } from './model.types';

enum TableNames {
  Courses = 'courses',
}

export interface CourseAttributes {
  id: number;
  name: string;
  type: string;
  duration: string | null;
  description: string | null;
  trainerId: number | null;
  targetAudiences: string[] | null;
  thumbnail: string | null;
  level: string | null;
  lastDate: Date | null;
  showFeedback: boolean;
  feedbackQuestion: string | null;
  status: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  deletedBy: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type CourseCreationAttributes = Optional<
  CourseAttributes,
  | 'id'
  | 'duration'
  | 'description'
  | 'trainerId'
  | 'targetAudiences'
  | 'thumbnail'
  | 'level'
  | 'lastDate'
  | 'showFeedback'
  | 'feedbackQuestion'
  | 'status'
  | 'createdBy'
  | 'updatedBy'
  | 'deletedBy'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
>;

export class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: number;
  public name!: string;
  public type!: string;
  public duration!: string | null;
  public description!: string | null;
  public trainerId!: number | null;
  public targetAudiences!: string[] | null;
  public thumbnail!: string | null;
  public level!: string | null;
  public lastDate!: Date | null;
  public showFeedback!: boolean;
  public feedbackQuestion!: string | null;
  public status!: string | null;
  public createdBy!: number | null;
  public updatedBy!: number | null;
  public deletedBy!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  static initialize(sequelize: Sequelize): void {
    Course.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        duration: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        trainerId: {
          field: 'trainer_id',
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        targetAudiences: {
          field: 'target_audiences',
          type: DataTypes.JSONB,
          allowNull: true,
        },
        thumbnail: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        level: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        lastDate: {
          field: 'last_date',
          type: DataTypes.DATE,
          allowNull: true,
        },
        showFeedback: {
          field: 'show_feedback',
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        feedbackQuestion: {
          field: 'feedback_question',
          type: DataTypes.TEXT,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        createdBy: {
          field: 'created_by',
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        updatedBy: {
          field: 'updated_by',
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        deletedBy: {
          field: 'deleted_by',
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
        tableName: TableNames.Courses,
        modelName: 'Course',
        underscored: true,
        freezeTableName: true,
        paranoid: true,
      }
    );
  }

  static associate(models: ModelRegistry): void {
    Course.hasMany(models.Module, { foreignKey: 'courseId', as: 'modules' });
    Course.hasMany(models.CourseAssignment, { foreignKey: 'courseId', as: 'courseAssignments' });
    Course.hasMany(models.CourseAssessment, { foreignKey: 'courseId', as: 'courseAssessments' });
    Course.belongsToMany(models.Assignment, {
      through: models.CourseAssignment,
      foreignKey: 'courseId',
      otherKey: 'assignmentId',
      as: 'assignments',
    });
    Course.belongsToMany(models.Assessment, {
      through: models.CourseAssessment,
      foreignKey: 'courseId',
      otherKey: 'assessmentId',
      as: 'assessments',
    });
  }
}
