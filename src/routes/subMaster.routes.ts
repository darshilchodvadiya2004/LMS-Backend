// Declares sub-master catalogue endpoints under /api/submasters with RBAC guards.
import { Router } from 'express';
import * as subMasterController from '../controllers/subMaster.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizePermissions } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

router.post('/', authorizePermissions(['submasters:create']), subMasterController.createSubMaster);
router.get('/', authorizePermissions(['submasters:read']), subMasterController.getSubMasters);
router.get('/:id', authorizePermissions(['submasters:read']), subMasterController.getSubMasterById);
router.put('/:id', authorizePermissions(['submasters:update']), subMasterController.updateSubMaster);
router.delete('/:id', authorizePermissions(['submasters:delete']), subMasterController.deleteSubMaster);

export default router;
