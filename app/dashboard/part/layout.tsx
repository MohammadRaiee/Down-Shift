import { auth } from "@/auth";
import { ReactNode } from "react";
export default async function PartLayout({
  children,
}: {
  children: ReactNode;
}) {

  const session = await auth();
  if (session?.user.role !=='seller') {
    return <div>يجب تسجيل الدخول</div>;
  }


  return (
    <div>
      {children}
    </div>
  );
}