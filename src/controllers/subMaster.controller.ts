// Handles HTTP endpoints for SubMaster catalogue management.
import { Request, Response } from 'express';
import * as subMasterService from '../services/subMaster.service';
import { HttpError } from '../utils/httpError';

export const createSubMaster = async (req: Request, res: Response): Promise<void> => {
  try {
    const subMaster = await subMasterService.createSubMaster(req.body);
    res.status(201).json({
      message: 'SubMaster created successfully.',
      data: subMaster,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const getSubMasters = async (_req: Request, res: Response): Promise<void> => {
  try {
    const subMasters = await subMasterService.listSubMasters();
    res.status(200).json({
      message: 'SubMasters fetched successfully.',
      data: subMasters,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const getSubMasterById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Invalid SubMaster identifier.');
    }

    const subMaster = await subMasterService.getSubMasterById(id);
    res.status(200).json({
      message: 'SubMaster fetched successfully.',
      data: subMaster,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const updateSubMaster = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Invalid SubMaster identifier.');
    }

    const subMaster = await subMasterService.updateSubMaster(id, req.body);
    res.status(200).json({
      message: 'SubMaster updated successfully.',
      data: subMaster,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const deleteSubMaster = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      throw new HttpError(400, 'Invalid SubMaster identifier.');
    }

    await subMasterService.deleteSubMaster(id);
    res.status(200).json({ message: 'SubMaster deleted successfully.' });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};
