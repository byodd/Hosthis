"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Header from "../../components/Header";
import { getUsernameFromEmail } from "../../services/users.service";
import { Project } from "../../types/projects.type";
import { getHostedProjects } from "../../services/project.service";
import GitHubLogoIcon from "../../../../public/svg/github-logo.svg";

export default function Projects() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [gitHubUsername, setGitHubUsername] = useState<string>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const userEmail = session?.user?.email;

  useEffect(() => {
    if (userEmail) {
      getHostedProjects(userEmail)
        .then((res) => setProjects(res.projects))
        .catch((error) => console.error(error));

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
      <p className="text-2xl mb-4">Voici tes projets hébergés :</p>
      <ul className="flex flex-col items-start gap-2 w-full max-h-[300px] overflow-y-auto">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Link
              href={project.project_url}
              className="border border-gray-300 rounded-md py-2 px-4 mb-2 hover:bg-gray-100 duration-300 cursor-pointer"
              key={project.hosting_id}
            >
              {project.project_url}
            </Link>
          ))
        ) : (
          <p>😞 Pas de projets trouvés</p>
        )}
      </ul>
      <Link
        href="/dashboard"
        className="flex flex-row items-center py-2 px-12 bg-[#023246] rounded-lg text-white md:text-[20px] font-semibold hover:bg-[#184d78] duration-300 hover:scale-105"
      >
        Retour au tableau de bord
      </Link>
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
        {error && <p className="text-red-500">❌{error}</p>}
        {loading ? <p>Chargement...</p> : content}
      </div>
    </div>
  );
}
