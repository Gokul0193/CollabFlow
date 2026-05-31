import express from "express";
import { addProject, fetchAllocatedProject, fetchAllProjects, fetchDomainProjects, getProjectMembers, projectJoinRequest } from "../controllers/projectController.js";

const router = express.Router();

// Mapped Routes
router.post("/addproject", addProject);
router.get("/allprojects", fetchAllProjects);
router.post("/domainprojects", fetchDomainProjects);
router.post("/join-project", projectJoinRequest);
router.post("/allocated-project", fetchAllocatedProject);
router.post("/getmembers", getProjectMembers);

export default router;

