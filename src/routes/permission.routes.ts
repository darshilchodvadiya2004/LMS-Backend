// Declares CRUD endpoints for permissions under /api/permissions with RBAC enforcement.
import { Router } from 'express';
import * as permissionController from '../controllers/permission.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizePermissions } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

router.post('/', authorizePermissions(['permissions:create']), permissionController.createPermission);
router.get('/', authorizePermissions(['permissions:read']), permissionController.getPermissions);
router.put('/:id', authorizePermissions(['permissions:update']), permissionController.updatePermission);
router.delete('/:id', authorizePermissions(['permissions:delete']), permissionController.deletePermission);

export default router;
