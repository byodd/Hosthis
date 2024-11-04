export async function getProject(userName: string, projectName: string) {

  const repoResponse = await fetch(
    `https://api.github.com/repos/${userName}/${projectName}`
  );
  if (!repoResponse.ok) {
    throw new Error("Failed to fetch the GitHub project");
  }
  return repoResponse.json();
}