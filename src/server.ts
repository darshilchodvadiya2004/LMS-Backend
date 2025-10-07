// Bootstraps the Express server, wires middleware, and starts listening for HTTP requests.
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { connectToDatabase, syncDatabase } from './config/db.config';
import { initializeModels } from './models';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import employeePermissionRoutes from './routes/employeePermission.routes';
import masterRoutes from './routes/master.routes';
import permissionRoutes from './routes/permission.routes';
import roleRoutes from './routes/role.routes';
import subMasterRoutes from './routes/subMaster.routes';
import userRoutes from './routes/user.routes';
import { HttpError } from './utils/httpError';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', roleRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/masters', masterRoutes);
app.use('/api/submasters', subMasterRoutes);
app.use('/api/employee-permissions', employeePermissionRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  console.error('Unhandled error caught by middleware:', err);
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  });
});

const startServer = async () => {
  try {
    initializeModels();
    await connectToDatabase();
    await syncDatabase();

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

void startServer();
