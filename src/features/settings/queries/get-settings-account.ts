import "server-only";

import { headers } from "next/headers";
import { redirect } from "@/i18n/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

type SettingsAccount = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
    createdAt: Date;
  };
  hasPassword: boolean;
  providers: string[];
};

const getSettingsAccount = async (locale: string): Promise<SettingsAccount> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect({ href: "/login", locale });
    throw new Error("Unauthenticated");
  }

  const user = session.user;
  const accounts = await prisma.account.findMany({
    where: {
      userId: user.id,
    },
    select: {
      providerId: true,
      password: true,
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      emailVerified: user.emailVerified,
      twoFactorEnabled: Boolean(user.twoFactorEnabled),
      createdAt: user.createdAt,
    },
    hasPassword: accounts.some(
      (account) => account.providerId === "credential" && Boolean(account.password),
    ),
    providers: accounts.map((account) => account.providerId),
  };
};

export { getSettingsAccount };
export type { SettingsAccount };
