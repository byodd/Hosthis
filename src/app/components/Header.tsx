"use client";

import Image from "next/image";
import Logo from "../../../public/svg/logo.svg";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  const loading = status === "loading";

  let authContent;
  if (loading) {
    authContent = null;
  } else {
    authContent = session ? (
      <div className="flex flex-row gap-6">
        <Link
          href="/dashboard"
          className="flex flex-row items-center py-2 px-12 bg-[#023246] rounded-lg text-white md:text-[20px] font-semibold hover:bg-[#184d78] duration-300 hover:scale-105"
        >
          Dashboard
        </Link>
        <Link
          href="/login"
          className="flex flex-row items-center text-white md:text-[20px] font-semibold duration-300 hover:scale-105"
        >
          <Image
            src={session?.user?.image || ""}
            alt="Mon compte"
            className="rounded-full border-2 border-[#023246]"
            width={50}
            height={50}
          />
        </Link>
      </div>
    ) : (
      <Link
        href="/login"
        className="flex flex-row items-center py-2 px-12 bg-[#023246] rounded-lg text-white md:text-[20px] font-semibold hover:bg-[#184d78] duration-300 hover:scale-105"
      >
        S&apos;inscrire/se connecter
      </Link>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between">
      <Link href={"/"} className="flex flex-row items-center gap-2">
        <Image src={Logo} alt="Web" />
        <p className="text-[32px] font-light">
          Host<span className="font-medium">This</span>
        </p>
      </Link>
      {authContent}
    </div>
  );
}
