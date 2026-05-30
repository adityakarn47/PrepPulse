import { APP_NAME } from "@/constants";
import { isAuthenticate, getCurrentUser } from "@/lib/actions/auth.action";
import NavigationMenu from "@/components/NavigationMenu";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuth = await isAuthenticate();
  if (!isUserAuth) redirect("/sign-in");

  const user = await getCurrentUser();

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={38} height={32} />
          <h2 className="text-primary-100">{APP_NAME}</h2>
        </Link>
        <NavigationMenu userName={user?.name} userId={user?.id} />
      </nav>
      {children}
    </div>
  );
};
export default RootLayout;
