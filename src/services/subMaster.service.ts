// Provides business logic for SubMaster CRUD operations.
import { SubMaster } from '../models/subMaster.model';
import { HttpError } from '../utils/httpError';
import { Master } from '../models/master.model';

export interface SubMasterInput {
  name?: string;
  code?: string;
  isActive?: boolean;
  masterId?: number;
  parentId?: number | null;
  sequence?: number;
}

const ensureRequiredFields = (payload: SubMasterInput) => {
  if (!payload.name) {
    throw new HttpError(400, 'SubMaster name is required.');
  }
  if (!payload.code) {
    throw new HttpError(400, 'SubMaster code is required.');
  }
  if (payload.masterId === undefined || payload.masterId === null) {
    throw new HttpError(400, 'masterId is required.');
  }
};

const ensureMasterExists = async (masterId: number) => {
  const master = await Master.findByPk(masterId);
  if (!master) {
    throw new HttpError(404, 'Associated master not found.');
  }
};

const ensureParentValid = async (parentId: number | null) => {
  if (!parentId) {
    return;
  }
  const parent = await SubMaster.findByPk(parentId);
  if (!parent) {
    throw new HttpError(404, 'Parent SubMaster not found.');
  }
};

export const createSubMaster = async (payload: SubMasterInput): Promise<SubMaster> => {
  ensureRequiredFields(payload);
  await ensureMasterExists(payload.masterId!);
  await ensureParentValid(payload.parentId ?? null);

  const existing = await SubMaster.findOne({ where: { code: payload.code } });
  if (existing) {
    throw new HttpError(409, 'A SubMaster with the provided code already exists.');
  }

  return SubMaster.create({
    name: payload.name!,
    code: payload.code!,
    masterId: payload.masterId!,
    parentId: payload.parentId ?? null,
    isActive: payload.isActive ?? true,
    sequence: payload.sequence ?? 0,
  });
};

export const listSubMasters = async (): Promise<SubMaster[]> => {
  return SubMaster.findAll();
};

export const getSubMasterById = async (id: number): Promise<SubMaster> => {
  const subMaster = await SubMaster.findByPk(id);
  if (!subMaster) {
    throw new HttpError(404, 'SubMaster not found.');
  }
  return subMaster;
};

export const updateSubMaster = async (id: number, payload: SubMasterInput): Promise<SubMaster> => {
  const subMaster = await getSubMasterById(id);

  if (payload.code && payload.code !== subMaster.code) {
    const existing = await SubMaster.findOne({ where: { code: payload.code } });
    if (existing) {
      throw new HttpError(409, 'A SubMaster with the provided code already exists.');
    }
  }

  if (payload.masterId !== undefined) {
    await ensureMasterExists(payload.masterId);
  }

  if (payload.parentId !== undefined) {
    await ensureParentValid(payload.parentId ?? null);
  }

  await subMaster.update({
    name: payload.name ?? subMaster.name,
    code: payload.code ?? subMaster.code,
    masterId: payload.masterId ?? subMaster.masterId,
    parentId: payload.parentId ?? subMaster.parentId,
    isActive: payload.isActive ?? subMaster.isActive,
    sequence: payload.sequence ?? subMaster.sequence,
  });

  return subMaster;
};

export const deleteSubMaster = async (id: number): Promise<void> => {
  const subMaster = await getSubMasterById(id);
  await subMaster.destroy();
};
