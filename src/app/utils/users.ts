
export async function fetchGitHubProjects(userEmail: string) {
  const userName = await getUsernameFromEmail(userEmail)

  const repoResponse = await fetch(
    `https://api.github.com/users/${userName}/repos`
  );
  if (!repoResponse.ok) {
    throw new Error("Failed to fetch GitHub projects");
  }
  return repoResponse.json();
}

async function getUsernameFromEmail(userEmail: string) {
    const userResponse = await fetch(
    `https://api.github.com/search/users?q=${userEmail}+in:email`
  );
  if (!userResponse.ok) {
    throw new Error("Failed to fetch GitHub username");
  }
  const userData = await userResponse.json();

  if (userData.total_count === 0) {
    throw new Error("No GitHub user found with that email");
  }
    
  return userData.items[0].login;
}
