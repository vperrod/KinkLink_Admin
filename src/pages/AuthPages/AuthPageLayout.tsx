import React from "react";
// import GridShape from "../../components/common/GridShape";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0 bgImage">
      <div className="container mx-auto">
        <div className="relative flex flex-col justify-right w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        
      
      </div>
      </div>
    </div>
  );
}
