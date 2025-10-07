// Declares course management endpoints under /api/courses with RBAC guards.
import { Router } from "express";
import * as courseController from "../controllers/course.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizePermissions } from "../middlewares/role.middleware";

const router = Router();

router.use(authenticate);

router.post("/create", courseController.createCourse);
router.get("/getcourses", courseController.getCourses);
router.get("/:id", courseController.getCourseById);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

export default router;
