// Declares master catalogue endpoints under /api/masters with RBAC guards.
import { Router } from 'express';
import * as masterController from '../controllers/master.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizePermissions } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

router.post('/', authorizePermissions(['masters:create']), masterController.createMaster);
router.get('/', authorizePermissions(['masters:read']), masterController.getMasters);
router.get('/:id', authorizePermissions(['masters:read']), masterController.getMasterById);
router.put('/:id', authorizePermissions(['masters:update']), masterController.updateMaster);
router.delete('/:id', authorizePermissions(['masters:delete']), masterController.deleteMaster);

export default router;
