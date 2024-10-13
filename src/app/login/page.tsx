"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import GitHubLogoIcon from "../../../public/svg/github-logo.svg";
import Header from "../components/Header";

export default function Login() {
  const { data: session } = useSession();

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
      <p className="text-2xl mb-2">
        Bienvenue <span className="font-bold">{session.user?.name}</span>
      </p>
      <p className="font-bold mb-4">{session.user?.email}</p>
        <button
          className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white py-2 px-6 rounded-md duration-300"
          onClick={() => signOut()}
        >
          Se déconnecter
        </button>
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
      <Header></Header>
      <div className="h-full flex flex-col items-center justify-center">{content}</div>
    </div>
  );
}
