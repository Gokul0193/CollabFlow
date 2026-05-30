import { CreatProject, getAllocatedProject, getAllProjects, getDomainProjects, joinProject } from "../services/dbService.js";

/**
 * Controller to handle SaaS Project creations
 */
export const addProject = async (req, res) => {
  try {
    const newProj = req.body;
    const { name, category, teamSize, status } = newProj;

    if (!name?.trim() || !category?.trim() || !teamSize || !status?.trim()) {
      return res.status(400).json({
        error: { code: "project/missing-fields", message: "Please fill in all project fields." }
      });
    }

    const project = await CreatProject(newProj);
    res.status(201).json(project);
  } catch (error) {
    console.error("Project Controller Add Error:", error);
    res.status(500).json({
      error: { code: "project/internal-error", message: "Failed to create project workspace." }
    });
  }
};

/**
 * Controller to list all SaaS Projects
 */
export const fetchAllProjects = async (req, res) => {
  try {
    const projects = await getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    console.error("Project Controller Fetch Error:", error);
    res.status(500).json({
      error: { code: "project/fetch-error", message: "Failed to fetch workspace directories." }
    });
  }
};


export const fetchDomainProjects = async (req, res) => {

  try {
    const { role, category } = req.body;

    if (!role || !category) {
      return res.status(400).json({
        error: {
          code: "project/internal-error", message: "missing category or role"
        }
      })
    }
    const projects = await getDomainProjects(role, category);
    console.log("dimain project backend", projects);



    if (!projects.length) {
      return res.status(404).json({
        error: {
          code: "project/not-found", message: "No projects found for the given domain"
        }
      })
    }

    res.status(200).json(projects);

  } catch (error) {
    res.status(500).json({
      error: { code: "project/fetch-error", message: "Failed to fetch domain projects" }
    })

  }


}

export const projectJoinRequest = async (req, res) => {
  try {
    const { pid, uid } = req.body;

    if (!pid || !uid) {
      res.status(400).json({
        error: {
          code: "project/internal-error", message: "missing uid or pid"
        }
      })
    }
    const result = await joinProject(pid, uid);


    res.status(200).json(result);



  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: {
        code: "project/join-error",
        message: error.message
      }
    });
  }
}

export const fetchAllocatedProject = async (req, res) => {
  const { role, uid } = req.body;

  if (!uid || !role) {
    return res.status(400).json({
      error: {
        code: "project/internal-error", message: "missing uid or role"
      }
    })
  }

  try {
    const project = await getAllocatedProject(role, uid);
    if (!project.length) {
      return res.status(404).json({
        error: {
          code: "project/not-found", message: "No projects found for the given uid and role"
        }
      })
    }
    res.status(200).json(project);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: {
        code: "project/fetch-error",
        message: error.message
      }
    });

  }

}
