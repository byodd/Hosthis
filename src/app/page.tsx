import Image from "next/image";
import Logo from "../../public/svg/logo.svg";
import PlanetGif from "../../public/gifplanet.webp";
import Link from "next/link";
export default function Home() {
  return (
    <div className="p-10 text-[#023246]">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <Image src={Logo} alt="Web" />
          <p className="text-[32px] font-light">
            Host<span className="font-medium">This</span>
          </p>
        </div>
        <Link
          href="/login"
          className="flex flex-row items-center py-2 px-12 bg-[#023246] rounded-lg text-white md:text-[20px] font-semibold hover:bg-[#184d78] duration-300 hover:scale-105"
        > 
          S&apos;inscrire/se connecter
        </Link>
      </div>

      <div className="flex flex-col-reverse md:flex-row items-center w-full h-[80vh] md:justify-between">
        <div className="z-10 md:mt-24 md:ml-28 md:w-1/2 flex flex-col">
          <p className="text-3xl md:text-5xl font-medium">
            Hébergez vos sites webs en un clic{" "}
            <span className="font-extralight">(ou presque)</span>
          </p>
          <p className="md:text-xl">
            Que vous souhaitiez lancer un blog, une portfolio ou une application
            révolutionnaire, nous fournissons les outils nécessaires pour que
            votre projet prenne vie rapidement et sans complication.
          </p>
        </div>
        <div className="gap-2 z-0 rotate-[15deg]">
          <Image src={PlanetGif} alt="Planet" />
        </div>
      </div>
    </div>
  );
}
