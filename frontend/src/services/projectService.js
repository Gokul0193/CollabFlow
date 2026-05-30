

const API_URL = "http://localhost:5001/api/project";

export const projectAdd = async (newProj) => {

    try {

        const response = await fetch(`${API_URL}/addproject`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProj),
        });

        const data = await response.json();
        if (!response.ok) {
            const error = new Error(data.error?.message || "project add is  failed.");
            error.code = data.error?.code;
            throw error;
        }

        return data
    } catch (error) {
        console.error("project add error in projectService:", error);
        throw error;
    }
}

export const getAllProjects = async () => {
    try {

        const response = await fetch(`${API_URL}/allprojects`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        throw error;

    }

}

export const getDomainProjects = async (role, uid) => {

    try {
        const response = await fetch(`${API_URL}/domainprojects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ role, uid }),
        })
        const data = await response.json();
        console.log("data of doamin", data);

        if (!response.ok) {
            const error = new Error(data.error?.message || "Domain projects are not feteched")
            error.code = data.error?.code
            throw error;
        }
        return data;

    } catch (error) {
        console.error("error in fetching domain projects", error);
        throw error;

    }

}


export const joinProject = async (pid, uid) => {
    try {
        const response = await fetch(`${API_URL}/join-project`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pid, uid }),
        })
        const data = await response.json();
        if (!response.ok) {
            const error = new Error(data.error?.message || "not join in projects")
            error.code = data.error?.code
            throw error;
        }
        return data;
    } catch (error) {
        console.error("error in join in projects", error);
        throw error;

    }
}


export const getAllocatedProject = async (role, uid) => {

    try {

        const response = await fetch(`${API_URL}/allocated-project`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ role, uid })
        });

        const data = await response.json();
        console.log("data of allocated ", data);

        if (!response.ok) {
            const error = new Error(data.error?.message || "allocated project are not fetched")
            error.code = data.error?.code
            throw error
        }
        return data;


    } catch (error) {
        console.error("error in allocated project", error);
        throw error;
    }

}