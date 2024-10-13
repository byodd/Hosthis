// mark as client component
"use client";

// importing necessary functions
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
import Image from "next/image";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Logo from "../../../public/svg/logo.svg";

export default function Login() {
  // extracting data from usesession as session
  const { data: session } = useSession()

  // checking if sessions exists
  if (session) {
    // rendering components for logged in users
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <div className="absolute flex flex-col md:flex-row items-center justify-between w-full top-0 p-10">
          <Link href={"/"} className="flex flex-row items-center gap-2">
            <Image src={Logo} alt="Web" />
            <p className="text-[32px] font-light">
              Host<span className="font-medium">This</span>
            </p>
          </Link>
        </div>
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
    );
  }

  // rendering components for not logged in users
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="absolute flex flex-col md:flex-row items-center justify-between w-full top-0 p-10">
        <Link href={"/"} className="flex flex-row items-center gap-2">
          <Image src={Logo} alt="Web" />
          <p className="text-[32px] font-light">
            Host<span className="font-medium">This</span>
          </p>
        </Link>
      </div>
      <button
        className="bg-none flex flex-row border-gray-300 border py-3 px-6 rounded-md mb-2 hover:bg-gray-100 duration-300"
        onClick={() => signIn("github")}
      >
        <GitHubLogoIcon className="w-6 h-6 mr-2" />
        Se connecter avec GitHub
      </button>
    </div>
  );

}