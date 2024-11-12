"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "../../components/Header";
import { getGithubProject } from "@/app/services/project.service";
import { useParams } from "next/navigation";
import { GithubProject } from "@/app/types/projects.type";

import CommandForm from "@/app/components/project/CommandForm";
import SignInButton from "@/app/components/SignInButton";

export default function ProjectCreation() {
  const { data: session } = useSession();
  const [gitHubProject, setGitHubProject] = useState<GithubProject | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const params = useParams();

  useEffect(() => {
    if (session) {
      getGithubProject(session.user.username, params.projectName as string)
        .then(setGitHubProject)
        .catch((error) => {
          console.error("Fetching GitHub project failed:", error);
          setError("La récupération du projet GitHub a échoué");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session, params.projectName]);

  let projectContent;
  if (session) {
    projectContent = gitHubProject ? (
      <CommandForm project={gitHubProject} />
    ) : null;
  } else {
    projectContent = <SignInButton />;
  }

  let displayContent;
  if (loading) {
    displayContent = <p>Chargement...</p>;
  } else if (error) {
    displayContent = <p className="text-red-500">❌{error}</p>;
  } else {
    displayContent = projectContent;
  }

  return (
    <div className="h-full overflow-hidden">
      <Header />
      <div className="h-full flex flex-col items-center justify-center">
        {displayContent}
      </div>
    </div>
  );
}
