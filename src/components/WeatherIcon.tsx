import React from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

type Props = {};

export default function WeatherIcon(
  props: React.HTMLProps<HTMLDivElement> & { icon: string }
) {
  return (
    <div
      {...props}
      className={cn("relative h-20 w-20 hidden sm:block", props.className)}
    >
      <Image
        width={100}
        height={100}
        alt="icon"
        className=" absolute h-full w-full"
        src={`https://openweathermap.org/img/wn/${props.icon}@4x.png`}
      />
    </div>
  );
}
