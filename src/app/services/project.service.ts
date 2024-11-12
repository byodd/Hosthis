import axios from "axios";

export async function createProject(
  projectUrl: string,
  installCommand: string,
  buildCommand: string,
  launchCommand: string,
  userEmail: string
) {
  try {
    return await axios.post("/api/commands", {
      projectUrl,
      installCommand,
      buildCommand,
      launchCommand,
      userEmail,
    });
  } catch (err) {
    console.error(err);
  }
}

export async function getHostedProjects(userEmail: string) {
  try {
    const response = await axios.get(`/api/projects/${userEmail}`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
}

export async function getProjectStatus(projectId: string) {
  try {
    const response = await axios.get(`/api/commands/${projectId}/status`);
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch project status");
  }
}

export async function stopProject(projectId: string) {
  try {
    const response = await axios.post(`/api/commands/${projectId}/stop`);
    return response.data;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to stop project");
  }
}

export async function startProject(projectId: string, email : string) {
  try {
    return await axios.post(`/api/commands/${projectId}/start`, {
      email: email,
    });
  } catch (err) {
    console.error(err);
  }
}