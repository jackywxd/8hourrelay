import Image from "next/image";
import crossnaLogo from "./crossna-logo.jpg";
import irunLogo from "./irun-logo.jpg";
import windLogo from "./wind-logo.jpg";

export default function Page() {
  return (
    <div className="flex justify-between">
      <Image
        className="object-cover rounded-full w-24 h-24 md:w-36 md:h-36"
        src={crossnaLogo}
        alt="crossna logo"
      />
      <Image
        className="object-cover rounded-full w-24 h-24 md:w-36 md:h-36 "
        src={irunLogo}
        alt="irun logo"
      />
      <Image
        className="object-cover rounded-full w-24 h-24 md:w-36 md:h-36"
        src={windLogo}
        alt="wind logo"
      />
    </div>
  );
}
