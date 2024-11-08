"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import GitHubLogoIcon from "../../../../public/svg/github-logo.svg";
import Header from "../../components/Header";
import { createProject } from "../../utils/project.service";
import { getProject } from "@/app/utils/project.service";
import { useParams } from "next/navigation";
import { GithubProject } from "@/app/types/projects.type";

export default function Project() {
  const { data: session } = useSession();
  const [gitHubProject, setGitHubProject] = useState<GithubProject | null>();

  const [installCommand, setInstallCommand] = useState("");
  const [buildCommand, setBuildCommand] = useState("");
  const [launchCommand, setLaunchCommand] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const params = useParams();

  const userEmail: string | null | undefined = session?.user?.email;
  const projectUrl: string | null | undefined = gitHubProject?.html_url;

  useEffect(() => {
    if (userEmail) {
      getProject(params.userName as string, params.projectName as string)
        .then(setGitHubProject)
        .catch((error) => {
          console.error("Fetching GitHub project failed:", error);
          setError("La récupération du projet GitHub a échoué");
        }
        );
    }
    setLoading(false);
  }, [userEmail, params.userName, params.projectName]);

  function sendInfo() {
    if (projectUrl && userEmail)
      createProject(projectUrl, installCommand, buildCommand, launchCommand, userEmail).then(() => {
        console.log("Project created");
      }).catch((error) => {
        console.error("Failed to create the project:", error);
      }
      );
  }

  const content = session ? (
    <div className="flex flex-col items-center">
      <p className="text-2xl">
        Tu veux héberger <span className="font-bold">{gitHubProject?.name}</span> ?
      </p>
      <p className="text-lg mb-4">
        Remplis les champs ci-dessous pour créer le projet.
      </p>
      <form className="flex flex-col w-full mt-3">
        <label>Commande d&apos;installation des packages</label>
        <input
          type="text"
          placeholder="npm install"
          className="border-gray-300 border py-3 px-6 rounded-md mb-2"
          value={installCommand}
          onChange={(e) => setInstallCommand(e.target.value)}
        />
        <label>Commande de build</label>
        <input
          type="text"
          placeholder="npm run build"
          className="border-gray-300 border py-3 px-6 rounded-md mb-2"
          value={buildCommand}
          onChange={(e) => setBuildCommand(e.target.value)}
        />
        <label>Commande de lancement</label>
        <input
          type="text"
          placeholder="npm start"
          value={launchCommand}
          className="border-gray-300 border py-3 px-6 rounded-md mb-2"
          onChange={(e) => setLaunchCommand(e.target.value)}
        />
        <button
          type="submit"
          className="bg-[#023246] text-white py-3 px-6 rounded-md my-2 hover:bg-[#224f66] duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={!installCommand || !buildCommand || !launchCommand}
          onClick={(e) => {
            e.preventDefault();
            sendInfo();
          }}
        >
          Créer le projet
        </button>
      </form>
    </div >
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
            error ? null :
              content
        }
      </div>
    </div>
  );
}
