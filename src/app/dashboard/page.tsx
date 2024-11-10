"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import { getUsernameFromEmail } from "../services/users.service";
import { GithubProject } from "../types/projects.type";
import { fetchGitHubProjects } from "../services/project.service";
import SignInButton from "../components/SignInButton";

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
        });

      getUsernameFromEmail(userEmail)
        .then(setGitHubUsername)
        .catch((error) => {
          console.error("Fetching GitHub username failed:", error);
          setError("La récupération du nom d'utilisateur GitHub a échoué");
        });
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
      <ul className="flex flex-col items-start gap-2 w-full max-h-[300px] overflow-y-auto">
        {gitHubProjects.length > 0 ? (
          gitHubProjects.map((project: GithubProject) => (
            <Link
              href={`${gitHubUsername}/${project.name}`}
              className="border border-gray-300 rounded-md py-2 px-4 mb-2 hover:bg-gray-100 duration-300 cursor-pointer"
              key={project.id}
            >
              {project.name}
            </Link>
          ))
        ) : (
          <p>😞 Pas de projets publiques trouvés</p>
        )}
      </ul>
      <Link
        href="/dashboard/projects"
        className="flex flex-row items-center py-2 px-12 bg-[#023246] rounded-lg text-white md:text-[20px] font-semibold hover:bg-[#184d78] duration-300 hover:scale-105"
      >
        Voir les projets hébergés
      </Link>
    </div>
  ) : (
    <SignInButton />
  );

  return (
    <div className="h-full overflow-hidden">
      <Header />
      <div className="h-full flex flex-col items-center justify-center">
        {error && <p className="text-red-500">❌{error}</p>}
        {loading ? <p>Chargement...</p> : content}
      </div>
    </div>
  );
}
