import React from "react";
import EyebrowLabel from "@/components/EyebrowLabel";

const TONE_CLASS = {
  blue: "text-dot-blue",
  orange: "text-dot-orange",
  green: "text-dot-green",
  red: "text-dot-red",
} as const;

type Tone = keyof typeof TONE_CLASS;

type Props = {
  children: any;
  title: string;
  tone?: Tone;
};

const AppCardBase = ({ children, title, tone = "blue" }: Props) => {
  return (
    <div className="border border-border p-4 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md rounded-2xl h-full col-span-2 md:col-span-1 font-body">
      {title ? (
        <EyebrowLabel className={`my-2 ${TONE_CLASS[tone]}`}>{title}</EyebrowLabel>
      ) : null}
      {children}
    </div>
  );
};

export default AppCardBase;
