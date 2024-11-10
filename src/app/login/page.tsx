"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Header from "../components/Header";
import SignInButton from "../components/SignInButton";

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
    <SignInButton />
  );

  return (
    <div className="h-full overflow-hidden">
      <Header></Header>
      <div className="h-full flex flex-col items-center justify-center">{content}</div>
    </div>
  );
}
