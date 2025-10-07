// Declares employee permission endpoints under /api/employee-permissions with RBAC guards.
import { Router } from 'express';
import * as employeePermissionController from '../controllers/employeePermission.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizePermissions } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

router.post('/', authorizePermissions(['employee-permissions:create']), employeePermissionController.createEmployeePermission);
router.get('/', authorizePermissions(['employee-permissions:read']), employeePermissionController.getEmployeePermissions);
router.put('/:id', authorizePermissions(['employee-permissions:update']), employeePermissionController.updateEmployeePermission);
router.delete('/:id', authorizePermissions(['employee-permissions:delete']), employeePermissionController.deleteEmployeePermission);

export default router;
