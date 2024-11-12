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
  const [gitHubProject, setGitHubProject] = useState<GithubProject | null>();

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
        });
    }
    setLoading(false);
  }, [session, params.projectName]);

  const content = session ? (
    gitHubProject ? (
      <CommandForm project={gitHubProject}></CommandForm>
    ) : null
  ) : (
    <SignInButton />
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
