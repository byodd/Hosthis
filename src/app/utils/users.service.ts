export async function getUsernameFromEmail(userEmail: string) {
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
