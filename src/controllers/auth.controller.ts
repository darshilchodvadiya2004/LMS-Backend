// Handles HTTP endpoints for user signup and login flows.
import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { HttpError } from "../utils/httpError";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, username, email, password, roleName } =
      req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      throw new HttpError(400, "Missing required signup fields.");
    }

    const result = await authService.signup({
      firstName,
      lastName,
      username,
      email,
      password,
      roleName,
    });

    res.status(201).json({
      message: "User registered successfully.",
      data: result,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    res.status(status).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body; // <-- changed from req.body.data

    if (!email || !password) {
      throw new HttpError(400, "Identifier and password are required.");
    }

    const result = await authService.login({ email, password });
    res.status(200).json({
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    const status = error instanceof HttpError ? error.statusCode : 500;
    console.error(error);
    res.status(status).json({ message: (error as Error).message });
  }
};
