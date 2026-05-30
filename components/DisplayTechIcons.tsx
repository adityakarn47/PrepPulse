import { getTechLogos } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const DisplayTechIcons = async ({ techStack }: TechIconProps) => {
  const techIcon = await getTechLogos(techStack);
  return (
    <div className="flex flex-row">
      {techIcon.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={index}
          className="relative group bg-dark-300 rounded-full p-2 flex-center"
        >
          <span className="tech-tooltip">{tech}</span>
          <Image
            src={url}
            alt={tech}
            className="size-5"
            height={100}
            width={100}
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;
