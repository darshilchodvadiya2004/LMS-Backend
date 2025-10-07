// Declares role and permission lookup endpoints for administrative usage.
import { Router } from 'express';
import * as roleController from '../controllers/role.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorizePermissions } from '../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

router.get('/roles', authorizePermissions(['roles:read']), roleController.getRoles);
router.get('/permissions', authorizePermissions(['permissions:read']), roleController.getPermissions);

export default router;
