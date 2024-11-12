export async function fetchGitHubProjects(userName: string) {
  const repoResponse = await fetch(
    `https://api.github.com/users/${userName}/repos`
  );
  if (!repoResponse.ok) {
    throw new Error("Failed to fetch GitHub projects");
  }
  return repoResponse.json();
}

export async function getGithubProject(userName: string, projectName: string) {
  const repoResponse = await fetch(
    `https://api.github.com/repos/${userName}/${projectName}`
  );
  if (!repoResponse.ok) {
    throw new Error("Failed to fetch the GitHub project");
  }
  return repoResponse.json();
}
