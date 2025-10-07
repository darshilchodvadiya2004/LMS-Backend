// Handles HTTP endpoints for managing courses via the course service layer.
import { Request, Response } from 'express';
import * as courseService from '../services/course.service';
import { HttpError } from '../utils/httpError';

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await courseService.createCourse(req.body);
    res.status(201).json({
      message: 'Course created successfully.',
      data: course,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const getCourses = async (_req: Request, res: Response): Promise<void> => {
  try {
    const courses = await courseService.listCourses();
    res.status(200).json({
      message: 'Courses fetched successfully.',
      data: courses,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Invalid course identifier.');
    }

    const course = await courseService.getCourseById(id);
    res.status(200).json({
      message: 'Course fetched successfully.',
      data: course,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Invalid course identifier.');
    }

    const course = await courseService.updateCourse(id, req.body);
    res.status(200).json({
      message: 'Course updated successfully.',
      data: course,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Invalid course identifier.');
    }

    await courseService.deleteCourse(id);
    res.status(200).json({ message: 'Course deleted successfully.' });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};
