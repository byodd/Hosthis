"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import GitHubLogoIcon from "../../../public/svg/github-logo.svg";
import Header from "../components/Header";
import { getUsernameFromEmail } from "../utils/users.service";
import { Project } from "../types/projects.type";
import { fetchGitHubProjects } from "../utils/project.service";

export default function Dashboard() {
  const { data: session } = useSession();
  const [gitHubProjects, setGitHubProjects] = useState([]);
  const [gitHubUsername, setGitHubUsername] = useState<string>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const userEmail = session?.user?.email;

  useEffect(() => {
    if (userEmail) {
      fetchGitHubProjects(userEmail)
        .then(setGitHubProjects)
        .catch((error) => {
          console.error("Fetching GitHub projects failed:", error);
          setError("La récupération des projets GitHub a échoué");
        }
        );

      getUsernameFromEmail(userEmail)
        .then(setGitHubUsername).catch((error) => {
          console.error("Fetching GitHub username failed:", error);
          setError("La récupération du nom d'utilisateur GitHub a échoué");
        }
        );
    }
    setLoading(false);
  }, [userEmail]);

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
        {error && <p className="text-red-500"
        >❌{error}</p>}
        {
          loading ? <p>Chargement...</p> :
            content
        }
      </div>
    </div>
  );
}
