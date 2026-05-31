import { CreateTask, deleteTask, getProjectTask } from "../services/TaskdbService.js";

export const addTask = async (req, res) => {
    try {
        const { title, assignedTo, description, status, assignedToName, projectId, project, priority, dueDate } = req.body;

        if (!title || !assignedTo || !description || !status || !assignedToName || !projectId || !project || !priority || !dueDate) {
            return res.status(400).json({
                error: {
                    code: "task/internal-error", message: "missing details"
                }
            })
        }

        const taskData = await CreateTask(title, assignedTo, description, status, assignedToName, projectId, project, priority, dueDate);

        res.status(201).json(taskData);

    } catch (error) {
        console.error("Task Controller Add Error:", error);
        res.status(500).json({
            error: { code: "task/internal-error", message: "Failed to create task" }
        });
    }
}

export const getTask = async (req, res) => {
    try {
        const { pid } = req.body;
        if (!pid) {
            return res.status(400).json({
                error: {
                    code: "task/internal-error", message: "missing details"
                }
            })
        }

        const task = await getProjectTask(pid);
        res.status(200).json(task);

    } catch (error) {
        console.error("Task Controller Get Error:", error);
        res.status(500).json({
            error: { code: "task/internal-error", message: "Failed to get task" }
        });

    }
}
export const taskDelete = async (req, res) => {
    try {
        const { taskId } = req.body;
        if (!taskId) {
            res.status(400).json({
                error: {
                    code: "task/internal-error", message: "missing details"
                }
            })
        }
        const task = await deleteTask(taskId);
        res.status(200).json(task);
    } catch (error) {
        console.error("task delete error", error);
        res.status(500).json({
            error: {
                code: "task/internal-error", message: "fail to delete task"
            }
        })

    }


}