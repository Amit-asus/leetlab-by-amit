import express from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware";
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getSolvedProblems,
} from "../controllers/problem.controller";

const problemRoutes = express.Router();

// Create a new problem
problemRoutes.post(
  "/create-problem",
  authMiddleware,
  checkAdmin,
  createProblem
);

// Get all problems
problemRoutes.get("/get-all-problems", authMiddleware, getAllProblems);

// Get a specific problem by ID
problemRoutes.get("/get-problem/:id", authMiddleware, getProblemById);

// Update a problem by ID
problemRoutes.put(
  "/update-problem/:id",
  authMiddleware,
  checkAdmin,
  updateProblem
);

// Delete a problem by ID
problemRoutes.delete("/delete-problem/:id", authMiddleware, deleteProblem);

// Get solved problems
problemRoutes.get("/get-solved-problems", authMiddleware, getSolvedProblems);

export default problemRoutes;
