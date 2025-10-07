// Declares the Assessment model referenced by course assessments.
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import type { ModelRegistry } from './model.types';

enum TableNames {
  Assessments = 'assessments',
}

export interface AssessmentAttributes {
  id: number;
  title: string;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export type AssessmentCreationAttributes = Optional<AssessmentAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class Assessment
  extends Model<AssessmentAttributes, AssessmentCreationAttributes>
  implements AssessmentAttributes
{
  public id!: number;
  public title!: string;
  public description!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  static initialize(sequelize: Sequelize): void {
    Assessment.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
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
        tableName: TableNames.Assessments,
        modelName: 'Assessment',
        underscored: true,
        freezeTableName: true,
        paranoid: true,
      }
    );
  }

  static associate(models: ModelRegistry): void {
    Assessment.belongsToMany(models.Course, {
      through: models.CourseAssessment,
      foreignKey: 'assessmentId',
      otherKey: 'courseId',
      as: 'courses',
    });
  }
}
