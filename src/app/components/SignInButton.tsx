import { signIn } from "next-auth/react";
import GitHubLogoIcon from "../../../public/svg/github-logo.svg";
import Image from "next/image";

export default function SignInButton() {
  return (
    <button
      className="bg-none flex flex-row border-gray-300 border py-3 px-6 rounded-md mb-2 hover:bg-gray-100 duration-300"
      onClick={() => signIn("github")}
    >
      <Image src={GitHubLogoIcon} alt="GitHub Logo" className="w-6 h-6 mr-2" />
      Se connecter avec GitHub
    </button>
  );
}
