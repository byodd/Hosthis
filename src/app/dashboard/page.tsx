"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import GitHubLogoIcon from "../../../public/svg/github-logo.svg";
import Header from "../components/Header";

async function fetchGitHubProjects(userEmail: string) {
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
  const userName = userData.items[0].login;

  const repoResponse = await fetch(
    `https://api.github.com/users/${userName}/repos`
  );
  if (!repoResponse.ok) {
    throw new Error("Failed to fetch GitHub projects");
  }
  return repoResponse.json();
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [gitHubProjects, setGitHubProjects] = useState([]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchGitHubProjects(session.user.email)
        .then(setGitHubProjects)
        .catch((error) =>
          console.error("Fetching GitHub projects failed:", error)
        );
    }
  }, [session?.user?.email]);

  const content = session ? (
    <div className="flex flex-col items-center">
      <div className="w-44 h-44 relative mb-4">
        <Image
          src={session.user?.image as string}
          fill
          alt=""
          className="object-cover rounded-full"
        />
      </div>
      <p className="text-2xl mb-4">
        Bonjour <span className="font-bold">{session.user?.name}</span>, quel
        projet souhaite-tu héberger aujourd&apos;hui ?
      </p>
      <ul
        className="flex flex-col items-start gap-2 w-full"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        {gitHubProjects.map((project) => (
          <li
            className="border border-gray-300 rounded-md py-2 px-4 mb-2 hover:bg-gray-100 duration-300 cursor-pointer"
            key={project.id}
          >
            {project.name}
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <button
      className="bg-none flex flex-row border-gray-300 border py-3 px-6 rounded-md mb-2 hover:bg-gray-100 duration-300"
      onClick={() => signIn("github")}
    >
      <Image src={GitHubLogoIcon} alt="GitHub Logo" className="w-6 h-6 mr-2" />
      Se connecter avec GitHub
    </button>
  );

  return (
    <div className="h-full overflow-hidden">
      <Header />
      <div className="h-full flex flex-col items-center justify-center">
        {content}
      </div>
    </div>
  );
}
