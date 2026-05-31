import { db } from "../config/firebase.js";


export const CreateTask = async (title, assignedTo, description, status, assignedToName, projectId, project, priority, dueDate) => {
    try {
        const taskRef = db.collection("tasks").doc()
        const taskData = {
            tid: taskRef.id,
            title: title,
            assignedTo: assignedTo,
            description: description,
            status: status,
            assignedToName: assignedToName,
            projectId: projectId,
            project: project,
            priority: priority,
            dueDate: dueDate,
            createdAt: new Date().toISOString()
        }

        await taskRef.set(taskData);
        return taskData;
    } catch (error) {
        console.error("Firestore write error:", error.message);
        throw error;

    }
}

export const getProjectTask = async (pid) => {
    try {

        const snapshot = await db.collection("tasks").where("projectId", "==", pid).get();
        const tasks = []
        snapshot.forEach((doc) => {
            tasks.push(doc.data());
        });
        return tasks;

    } catch (error) {
        console.error("Firestore read error:", error.message);
        throw error;

    }
}
export const deleteTask = async (taskId) => {
    try {
        const data = await db.collection("tasks").doc(taskId).delete();
        return data;
    } catch (error) {
        console.error("FireStore delete error", error.message);
        throw error;

    }

}