"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { createProject } from "../../services/project.service";
import { GithubProject } from "@/app/types/projects.type";

interface CommandFormProps {
  project: GithubProject;
}

export default function CommandForm(props: CommandFormProps) {
  const { data: session } = useSession();

  const [installCommand, setInstallCommand] = useState("");
  const [buildCommand, setBuildCommand] = useState("");
  const [launchCommand, setLaunchCommand] = useState("");

  const userEmail: string | null | undefined = session?.user?.email;
  const projectUrl: string | null | undefined = props.project.html_url;

  function sendInfo() {
    if (projectUrl && userEmail)
      createProject(
        projectUrl,
        installCommand,
        buildCommand,
        launchCommand,
        userEmail
      )
        .then(() => {
          console.log("Project created");
        })
        .catch((error) => {
          console.error("Failed to create the project:", error);
        });
  }

  return (
    <div className="flex flex-col items-center">
      <p className="text-2xl">
        Tu veux héberger <span className="font-bold">{props.project.name}</span>{" "}
        ?
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
    </div>
  );
}
