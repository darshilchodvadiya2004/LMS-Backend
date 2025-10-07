// Provides reusable business logic for Course CRUD operations.
import { Course } from '../models/course.model';
import { HttpError } from '../utils/httpError';

export interface CourseInput {
  name?: string;
  type?: string;
  duration?: string | null;
  description?: string | null;
  trainerId?: number | null;
  targetAudiences?: string[] | null;
  thumbnail?: string | null;
  level?: string | null;
  lastDate?: string | null;
  showFeedback?: boolean;
  feedbackQuestion?: string | null;
  status?: string | null;
  createdBy?: number | null;
  updatedBy?: number | null;
}

const parseDate = (value?: string | null): Date | null => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new HttpError(400, 'Invalid date format provided.');
  }
  return date;
};

const ensureRequiredFields = (payload: CourseInput): void => {
  if (!payload.name) {
    throw new HttpError(400, 'Course name is required.');
  }
  if (!payload.type) {
    throw new HttpError(400, 'Course type is required.');
  }
};

export const createCourse = async (payload: CourseInput): Promise<Course> => {
  ensureRequiredFields(payload);

  const {
    name,
    type,
    duration = null,
    description = null,
    trainerId = null,
    targetAudiences = null,
    thumbnail = null,
    level = null,
    lastDate = null,
    showFeedback = false,
    feedbackQuestion = null,
    status = 'draft',
    createdBy = null,
  } = payload;

  const parsedLastDate = parseDate(lastDate);

  return Course.create({
    name: name!,
    type: type!,
    duration,
    description,
    trainerId,
    targetAudiences,
    thumbnail,
    level,
    lastDate: parsedLastDate,
    showFeedback,
    feedbackQuestion,
    status,
    createdBy,
  });
};

export const listCourses = async (): Promise<Course[]> => {
  return Course.findAll();
};

export const getCourseById = async (id: number): Promise<Course> => {
  const course = await Course.findByPk(id);
  if (!course) {
    throw new HttpError(404, 'Course not found.');
  }
  return course;
};

export const updateCourse = async (id: number, payload: CourseInput): Promise<Course> => {
  const course = await getCourseById(id);

  const nextName = payload.name ?? course.name;
  const nextType = payload.type ?? course.type;
  if (!nextName || !nextType) {
    throw new HttpError(400, 'Course name and type are required.');
  }

  const parsedLastDate = payload.lastDate !== undefined ? parseDate(payload.lastDate) : course.lastDate;

  await course.update({
    name: nextName,
    type: nextType,
    duration: payload.duration ?? course.duration,
    description: payload.description ?? course.description,
    trainerId: payload.trainerId ?? course.trainerId,
    targetAudiences: payload.targetAudiences ?? course.targetAudiences,
    thumbnail: payload.thumbnail ?? course.thumbnail,
    level: payload.level ?? course.level,
    lastDate: parsedLastDate,
    showFeedback: payload.showFeedback ?? course.showFeedback,
    feedbackQuestion: payload.feedbackQuestion ?? course.feedbackQuestion,
    status: payload.status ?? course.status,
    updatedBy: payload.updatedBy ?? course.updatedBy,
  });

  return course;
};

export const deleteCourse = async (id: number): Promise<void> => {
  const course = await getCourseById(id);
  await course.destroy();
};
