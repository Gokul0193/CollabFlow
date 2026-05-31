import express from "express";
import { addTask, getTask, taskDelete } from "../controllers/taskController.js";

const router = express.Router();

router.post("/addTask", addTask);
router.post("/get-task", getTask);
router.post("/delete-task", taskDelete);

export default router;
