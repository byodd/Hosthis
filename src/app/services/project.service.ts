import { getUsernameFromEmail } from "./users.service";
import axios from "axios";

export async function fetchGitHubProjects(userEmail: string) {
  const userName = await getUsernameFromEmail(userEmail);

  const repoResponse = await fetch(
    `https://api.github.com/users/${userName}/repos`
  );
  if (!repoResponse.ok) {
    throw new Error("Failed to fetch GitHub projects");
  }
  return repoResponse.json();
}

export async function getProject(userName: string, projectName: string) {

  const repoResponse = await fetch(
    `https://api.github.com/repos/${userName}/${projectName}`
  );
  if (!repoResponse.ok) {
    throw new Error("Failed to fetch the GitHub project");
  }
  return repoResponse.json();
}

export async function createProject(
  projectUrl: string,
  installCommand: string,
  buildCommand: string,
  launchCommand: string,
  userEmail: string
) {
  try {
    return axios.post("/api/commands", {
      projectUrl,
      installCommand,
      buildCommand,
      launchCommand,
      userEmail
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