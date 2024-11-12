"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "../../components/Header";
import {
  getHostedProjects,
  getProjectStatus,
  startProject,
  stopProject,
} from "@/app/services/project.service";
import { useParams } from "next/navigation";
import type { Project } from "@/app/types/projects.type";
import SignInButton from "@/app/components/SignInButton";
import Link from "next/link";

export default function Project() {
  const { data: session } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [projectUrl, setProjectUrl] = useState<string>();
  const params = useParams();
  const userEmail = session?.user?.email;

  useEffect(() => {
    if (!userEmail) return;

    const fetchProjectData = async () => {
      try {
        const res = await getHostedProjects(userEmail);
        const foundProject = res.projects.find(
          (proj: Project) => proj.hosting_id === params.hostingId
        );

        if (foundProject) {
          setProject(foundProject);
          const statusRes = await getProjectStatus(foundProject.hosting_id);
          if (statusRes.container?.status === "running") {
            setProjectUrl(statusRes.container.url);
            updateProjectStatus(true);
          }
        }
      } catch (error) {
        console.error(error);
        setError("La récupération des projets hébergés a échoué");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [userEmail, params.hostingId]);

  const updateProjectStatus = (status: boolean) => {
    setProject((prev) => (prev ? { ...prev, status } : prev));
  };

  const handleProjectStart = async () => {
    if (!project || !userEmail) return;
    setStarting(true);
    try {
      const res = await startProject(project.hosting_id, userEmail);
      updateProjectStatus(true);
      setProjectUrl(res?.data.container.url);
    } catch (error) {
      console.error(error);
      setError("Le démarrage du projet a échoué");
    } finally {
      setStarting(false);
    }
  };

  const handleProjectStop = async () => {
    if (!project) return;
    setStopping(true);
    try {
      await stopProject(project.hosting_id);
      updateProjectStatus(false);
      setProjectUrl(undefined);
    } catch (error) {
      console.error(error);
      setError("L'arrêt du projet a échoué");
    } finally {
      setStopping(false);
    }
  };

  const renderContent = () => {
    if (!session) return <SignInButton />;
    if (!project) return null;

    return (
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
          <span className={project.status ? "text-green-500" : "text-red-500"}>
            {project.status ? "En ligne" : "Hors ligne"}
          </span>
        </p>
        <div className="flex flex-row items-center gap-4">
          <button
            className="rounded-md py-2 px-4 mb-2 duration-300 cursor-pointer bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
            onClick={handleProjectStop}
            disabled={stopping}
          >
            {stopping ? "Arrêt..." : "Stop"}
          </button>
          <button
            className="rounded-md py-2 px-4 mb-2 duration-300 cursor-pointer bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
            onClick={handleProjectStart}
            disabled={starting}
          >
            {starting ? "Démarrage..." : "Run"}
          </button>
        </div>
        {projectUrl && (
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md py-2 px-4 mt-4 duration-300 cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
          >
            Accéder au projet
          </a>
        )}
        <p className="my-2">Commandes choisies :</p>
        <ul className="flex flex-col items-start gap-2 w-full max-h-[300px] overflow-y-auto border border-gray-300 rounded-md p-4">
          <li>{project.install_command}</li>
          <li>{project.build_command}</li>
          <li>{project.launch_command}</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="h-full overflow-hidden">
      <Header />
      <div className="h-full flex flex-col items-center justify-center">
        {error && <p className="text-red-500">❌{error}</p>}
        {loading ? <p>Chargement...</p> : renderContent()}
      </div>
    </div>
  );
}
