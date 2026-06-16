"use client";

import { useState } from "react";
import {
  MinaEdit,
  MinaLogin,
  MinaLogout,
  MinaSpinner,
} from "@zcorvus/icons-react";
import { useLocale } from "@/hooks/use-locale";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import styles from "./app-user-menu.module.scss";

const getInitial = (name?: string | null, email?: string | null) => {
  const value = name?.trim() || email?.trim() || "?";
  return value.charAt(0).toUpperCase();
};

const formatMemberSince = (
  value: Date | string | undefined,
  locale: string,
) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
};

const AppUserMenu = () => {

  const { data: session, isPending } = authClient.useSession();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const { currentLocale } = useLocale();
  const tAccount = useTranslations("layout.user_menu");

  const user = session?.user;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await authClient.signOut();
    router.replace("/login");
  };

  if (isPending) {
    return (
      <div
        className={styles.loading}
        role="status"
        aria-label={tAccount("loading")}
      >
        <MinaSpinner aria-hidden="true" className={styles.spinner} />
      </div>
    );
  }

  if (!user) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">
          <MinaLogin aria-hidden="true" />
          <span>{tAccount("sign_in")}</span>
        </Link>
      </Button>
    );
  }

  const initial = getInitial(user.name, user.email);
  const memberSince = formatMemberSince(user.createdAt, currentLocale);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={styles.trigger} variant="ghost" aria-label={tAccount("open_menu")}>
          <Avatar size="sm" className={styles.avatarMin}>
            <AvatarImage src={user.image ?? undefined} alt="" />
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
          <span className={styles.triggerText}>{user.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className={styles.content}>
        <div className={styles.cover}>
          <Button variant="secondary" size="sm" asChild className={styles.profileLink}>
            <Link href="/settings/general">
              <MinaEdit aria-hidden="true" />
              <span>{tAccount("profile")}</span>
            </Link>
          </Button>
        </div>

        <div className={styles.profile}>
          <Avatar className={styles.avatar}>
            <AvatarImage src={user.image ?? undefined} alt="" />
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>

          <div className={styles.details}>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <p>{tAccount(`locales.${currentLocale}`)}</p>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.memberSince}>
            <span>{tAccount("member_since")} :</span>
            <p>{memberSince}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            disabled={isSigningOut}
            aria-label={tAccount("logout")}
            className={styles.logout}
          >
            {isSigningOut ? (
              <MinaSpinner aria-hidden="true" className={styles.spinner} />
            ) : (
              <MinaLogout aria-hidden="true" />
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { AppUserMenu };
