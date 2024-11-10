"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "../../components/Header";
import { getHostedProjects } from "@/app/services/project.service";
import { useParams } from "next/navigation";
import type { Project } from "@/app/types/projects.type";

import SignInButton from "@/app/components/SignInButton";
import Link from "next/link";

export default function Project() {
  const { data: session } = useSession();
  const [project, setProject] = useState<Project>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const params = useParams();

  const userEmail: string | null | undefined = session?.user?.email;

  useEffect(() => {
    if (userEmail) {
      getHostedProjects(userEmail)
        .then((res) => {
          setProject(
            res.projects.find(
              (project: Project) => project.hosting_id === params.hostingId
            )
          );
        })
        .catch((error) => {
          console.error(error);
          setError("La récupération des projets hébergés a échoué");
        })
        .finally(() => setLoading(false));
    }
  }, [userEmail, params.hostingId]);

  const content = session ? (
    project ? (
      <div className="flex flex-col items-center">
        <p className="mb-2">Hébergement du projet :</p>
        <Link
          href={project.project_url}
          className="border border-gray-300 rounded-md py-2 px-4 mb-2 hover:bg-gray-100 duration-300 cursor-pointer"
        >
          {project.project_url}
        </Link>
        <p className="text-sm text-gray-500 mb-4">
          Créé le {new Date(project.created_at).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Statut :{" "}
          <span
            className={`${
              project.status ? "text-green-500" : "text-red-500"
            }`}
          >
            {project.status ? "En ligne" : "Hors ligne"}
          </span>
        </p>
        <div className="flex flex-row items-center gap-4">
          {project.status ? (
            <button className="rounded-md py-2 px-4 mb-2 duration-300 cursor-pointer bg-green-500 text-white hover:bg-green-600">
              Run
            </button>
          ) : (
            <button className="rounded-md py-2 px-4 mb-2 duration-300 cursor-pointer bg-red-500 text-white hover:bg-red-600">
              Stop
            </button>
          )}
        </div>
        <p className="my-2">Commandes choisies :</p>
        <ul className="flex flex-col items-start gap-2 w-full max-h-[300px] overflow-y-auto border border-gray-300 rounded-md p-4">
          <li>{project.install_command}</li>
          <li>{project.build_command}</li>
          <li>{project.launch_command}</li>
        </ul>
      </div>
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
