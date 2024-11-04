"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import GitHubLogoIcon from "../../../public/svg/github-logo.svg";
import Header from "../components/Header";
import { fetchGitHubProjects, getUsernameFromEmail } from "../utils/users.service";
import { Project } from "../types/projects.type";
import { strict } from "assert";

export default function Dashboard() {
  const { data: session } = useSession();
  const [gitHubProjects, setGitHubProjects] = useState([]);
  const [gitHubUsername, setGitHubUsername] = useState<string>();
  var userName: string | undefined | null = session?.user?.name;

  useEffect(() => {
    if (session?.user?.email) {
      fetchGitHubProjects(session.user.email)
        .then(setGitHubProjects)
        .catch((error) =>
          console.error("Fetching GitHub projects failed:", error)
      );
      
      getUsernameFromEmail(session.user.email)
        .then(setGitHubUsername).catch((error) =>
          console.error("Getting GitHub name failed:", error)
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
        {gitHubProjects.map((project: Project) => (
          <a
            href={`${gitHubUsername}/${project.name}`}
            className="border border-gray-300 rounded-md py-2 px-4 mb-2 hover:bg-gray-100 duration-300 cursor-pointer"
            key={project.id}
          >
            {project.name}
          </a>
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
