// Provides business logic for Master catalogue CRUD operations.
import { Master } from '../models/master.model';
import { HttpError } from '../utils/httpError';

export interface MasterInput {
  name?: string;
  code?: string;
  isActive?: boolean;
  sequence?: number;
}

const ensureRequiredFields = (payload: MasterInput) => {
  if (!payload.name) {
    throw new HttpError(400, 'Master name is required.');
  }
  if (!payload.code) {
    throw new HttpError(400, 'Master code is required.');
  }
};

export const createMaster = async (payload: MasterInput): Promise<Master> => {
  ensureRequiredFields(payload);

  const existing = await Master.findOne({ where: { code: payload.code } });
  if (existing) {
    throw new HttpError(409, 'A master with the provided code already exists.');
  }

  return Master.create({
    name: payload.name!,
    code: payload.code!,
    isActive: payload.isActive ?? true,
    sequence: payload.sequence ?? 0,
  });
};

export const listMasters = async (): Promise<Master[]> => {
  return Master.findAll();
};

export const getMasterById = async (id: number): Promise<Master> => {
  const master = await Master.findByPk(id);
  if (!master) {
    throw new HttpError(404, 'Master not found.');
  }
  return master;
};

export const updateMaster = async (id: number, payload: MasterInput): Promise<Master> => {
  const master = await getMasterById(id);

  if (payload.code && payload.code !== master.code) {
    const existing = await Master.findOne({ where: { code: payload.code } });
    if (existing) {
      throw new HttpError(409, 'A master with the provided code already exists.');
    }
  }

  await master.update({
    name: payload.name ?? master.name,
    code: payload.code ?? master.code,
    isActive: payload.isActive ?? master.isActive,
    sequence: payload.sequence ?? master.sequence,
  });

  return master;
};

export const deleteMaster = async (id: number): Promise<void> => {
  const master = await getMasterById(id);
  await master.destroy();
};
