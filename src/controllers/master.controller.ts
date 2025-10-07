// Handles HTTP endpoints for master catalogue management.
import { Request, Response } from 'express';
import * as masterService from '../services/master.service';
import { HttpError } from '../utils/httpError';

export const createMaster = async (req: Request, res: Response): Promise<void> => {
  try {
    const master = await masterService.createMaster(req.body);
    res.status(201).json({
      message: 'Master created successfully.',
      data: master,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const getMasters = async (_req: Request, res: Response): Promise<void> => {
  try {
    const masters = await masterService.listMasters();
    res.status(200).json({
      message: 'Masters fetched successfully.',
      data: masters,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const getMasterById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Invalid master identifier.');
    }

    const master = await masterService.getMasterById(id);
    res.status(200).json({
      message: 'Master fetched successfully.',
      data: master,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const updateMaster = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Invalid master identifier.');
    }

    const master = await masterService.updateMaster(id, req.body);
    res.status(200).json({
      message: 'Master updated successfully.',
      data: master,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const deleteMaster = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Invalid master identifier.');
    }

    await masterService.deleteMaster(id);
    res.status(200).json({ message: 'Master deleted successfully.' });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};
