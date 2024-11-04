"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import GitHubLogoIcon from "../../../../public/svg/github-logo.svg";
import Header from "../../components/Header";
import { fetchGitHubProjects } from "../../utils/users.service";
import { ProjectCode } from "../../types/projects.type";
import { getProject } from "@/app/utils/project.service";
import { useParams } from "next/navigation";

export default function Project() {
  const { data: session } = useSession();
  const [gitHubProjects, setGitHubProjects] = useState([]);
  const [gitHubProject, setGitHubProject] = useState([]);

  const params = useParams();

  useEffect(() => {
    if (session?.user?.email) {
      fetchGitHubProjects(session.user.email)
        .then(setGitHubProjects)
        .catch((error) =>
          console.error("Fetching GitHub projects failed:", error)
        );

      getProject(params.userName as string, params.projectName as string)
        .then(setGitHubProject)
        .catch((error) =>
          console.error("Fetching the GitHub project failed:", error)
        );
    }
  }, [session?.user?.email]);

  const content = session ? (
    <div className="flex flex-col items-center">
      <p className="text-2xl mb-4">
        Tu veux héberger <span className="font-bold">{params.projectName}</span> ?
      </p>
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
