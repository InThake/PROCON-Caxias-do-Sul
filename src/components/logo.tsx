import logo from "@/assets/logos/logo.svg";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-28 max-w-full">
      <Image
        src={logo}
        fill
        className="dark:hidden"
        alt="NextAdmin logo"
        role="presentation"
        quality={100}
      />

      <Image
        src={logo}
        fill
        className="hidden dark:block"
        alt="NextAdmin logo"
        role="presentation"
        quality={100}
      />
    </div>
  );
}
