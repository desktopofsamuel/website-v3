import React from "react";

type Props = {
  children: any;
  title: string;
};

const AppCardBase = ({ children, title }: Props) => {
  return (
    <div className="border border-slate-300 p-4 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md rounded-2xl h-full col-span-2 md:col-span-1">
      <p className="text-sm my-2 text-secondarytext">{title}</p>
      {children}
    </div>
  );
};

export default AppCardBase; 