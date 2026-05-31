const API_URL = "http://localhost:5001/api/task";

export const addTask = async (taskData) => {
    try {
        const response = await fetch(`${API_URL}/addTask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        });

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.error?.message || "task add is  failed.");
            error.code = data.error?.code;
            throw error;
        }
        return data;

    } catch (error) {
        console.error("task add error in projectService:", error);
        throw error;
    }
}

export const getProjectTask = async (pid) => {
    try {
        const response = await fetch(`${API_URL}/get-task`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pid }),
        })
        const data = await response.json();
        if (!response.ok) {
            const error = new Error(data.error?.message || "task get is failed");
            error.code = data.error?.code;
            throw error;
        }
        return data;
    } catch (error) {
        console.log("get task fail", error);
        throw error;
    }
}

export const deleteTask = async (taskId) => {
    try {
        const response = await fetch(`${API_URL}/delete-task`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskId })

        });
        const data = await response.json();
        if (!response.ok) {
            const error = new Error(data.error?.message || "task delete is failed");
            error.code = data.error?.code;
            throw error;
        }
        return data;
    } catch (error) {
        console.log("delete task fail", error);
        throw error;


    }

}

