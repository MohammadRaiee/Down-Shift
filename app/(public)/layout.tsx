

import { ReactNode } from "react";
export default async function PartLayout({
  children,
}: {
  children: ReactNode;
}) {



  return (
    <div>    
      {children}
    </div>
  );
}


