import Image from "next/image";
import crossnaLogo from "./crossna-logo.jpg";
import irunLogo from "./irun-logo.jpg";
import windLogo from "./wind-logo.jpg";

export default function Page() {
  return (
    <div className="flex justify-between">
      <img
        className="object-cover rounded-full w-24 h-24 md:w-36 md:h-36"
        src="/assets/crossna-logo.jpg"
        alt="crossna logo"
      />
      <img
        className="object-cover rounded-full w-24 h-24 md:w-36 md:h-36 "
        src="/assets/irun-logo.jpb"
        alt="irun logo"
      />
      <img
        className="object-cover rounded-full w-24 h-24 md:w-36 md:h-36"
        src="/assets/wind-logo.jpg"
        alt="wind logo"
      />
    </div>
  );
}
