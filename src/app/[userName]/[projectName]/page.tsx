"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import GitHubLogoIcon from "../../../../public/svg/github-logo.svg";
import Header from "../../components/Header";
import { getProject } from "@/app/services/project.service";
import { useParams } from "next/navigation";
import { GithubProject } from "@/app/types/projects.type";

import CommandForm from "@/app/components/project/CommandForm";

export default function Project() {
  const { data: session } = useSession();
  const [gitHubProject, setGitHubProject] = useState<GithubProject | null>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const params = useParams();

  const userEmail: string | null | undefined = session?.user?.email;

  useEffect(() => {
    if (userEmail) {
      getProject(params.userName as string, params.projectName as string)
        .then(setGitHubProject)
        .catch((error) => {
          console.error("Fetching GitHub project failed:", error);
          setError("La récupération du projet GitHub a échoué");
        });
    }
    setLoading(false);
  }, [userEmail, params.userName, params.projectName]);

  const content = session ? (
    gitHubProject ? (
      <CommandForm project={gitHubProject}></CommandForm>
    ) : null
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
        {loading ? <p>Chargement...</p> : error ? null : content}
      </div>
    </div>
  );
}
