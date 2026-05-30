import { db } from "../config/firebase.js";

export const getUserByEmail = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", normalizedEmail).get();
    if (snapshot.empty) return null;

    let user = null;
    snapshot.forEach((doc) => {
      user = { ...doc.data() };
    });
    return user;
  } catch (error) {
    console.error("Firestore read error:", error.message);
    throw error;
  }
};

export const createUser = async (name, email, hashedPassword, role) => {
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const userRef = db.collection("users").doc();
    const userData = {
      uid: userRef.id,
      role: role,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    await userRef.set(userData);
    return userData;
  } catch (error) {
    console.error("Firestore write error:", error.message);
    throw error;
  }
};

export const CreatProject = async (newProj) => {
  try {
    const projectRef = db.collection("projects").doc();
    const projectData = {
      pid: projectRef.id,
      name: newProj.name,
      category: newProj.category,
      progress: newProj.progress || 0,
      teamSize: newProj.teamSize,
      status: newProj.status || "Proactive",
      description: newProj.description || "No description provided.",
      dueDate: newProj.dueDate || "Not Set",
      skills: newProj.skills || [],
      members: newProj.members || []
    };

    await projectRef.set(projectData);
    return projectData;
  } catch (error) {
    console.error("Firestore write error:", error.message);
    throw error;
  }
}

export const getAllProjects = async () => {
  try {
    const snapshot = await db.collection("projects").get();
    const projectsList = [];
    snapshot.forEach((doc) => {
      projectsList.push(doc.data());
    });
    return projectsList;
  } catch (error) {
    console.error("Error in backend getAllProjects:", error);
    throw error;
  }
}

export const getDomainProjects = async (role, uid) => {
  try {
    const project = [];
    const projectsRef = db.collection("projects");
    const snapshot = await projectsRef.where("category", "==", role).get();
    snapshot.forEach((doc) => {
      const data = doc.data()
      if (data.category == role) {
        project.push(data)
      }
    })
    return project
  } catch (error) {
    console.error("Error in backend getDomainProjects:", error);
    throw error;

  }
}


export const joinProject = async (pid, uid) => {

  try {
    const projectRef = db.collection("projects").doc(pid);
    const projectsnapshot = await projectRef.get();

    if (!projectsnapshot.exists) {
      throw new Error("Project not found");
    }
    const data = projectsnapshot.data();
    const members = data.members || [];
    if (members.includes(uid)) {
      throw new Error("You are already a member of this project");
    }
    const newmembers = [...members, uid];
    await projectRef.update({ members: newmembers });
    return {
      success: true,
      message: "Joined project successfully"
    };
  } catch (error) {
    console.error("Error in backend joinProject:", error);
    throw error;
  }
}


export const getAllocatedProject = async (role, uid) => {
  try {
    const project = [];
    const projectsRef = db.collection("projects");
    const snapshot = await projectsRef.where("category", "==", role).get();
    snapshot.forEach((doc) => {
      const data = doc.data()
      if (data.members.includes(uid)) {
        project.push(data)
      }
    })
    return project
  } catch (error) {
    console.error("Error in backend getDomainProjects:", error);
    throw error;

  }
}

