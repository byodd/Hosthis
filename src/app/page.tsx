import Image from "next/image";
import PlanetGif from "../../public/gifplanet.webp";
import Header from "./components/Header";

export default function Home() {
  return (
    <div>
      <Header></Header>

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
