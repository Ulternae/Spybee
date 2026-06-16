import { createTranslator } from "next-intl";

import { PasswordChangedEmail } from "@/emails/templates/security/password-changed";
import { TwoFactorEnabledEmail } from "@/emails/templates/security/two-factor-enabled";
import { resolveLocaleFromRequest } from "@/i18n/resolve-locale";
import type { User } from "better-auth";
import { sendEmail } from "@/lib/server/email";
import {
  getAbsoluteUrl,
  getSecurityActivity,
} from "@/lib/server/request/request.server";
import { TwoFactorDisabledEmail } from "../templates/security/two-factor-disabled";
import { serverEnv } from "@/config/env.server";

interface SendSecurityEmailParams {
  user: User;
  req?: Request;
}

const getSecurityEmailContext = async (req?: Request) => {
  const locale = resolveLocaleFromRequest({ req });
  const activity = await getSecurityActivity({ req });

  const t = createTranslator({
    messages: await import(`@/messages/${locale}/email.json`),
    namespace: "subjects",
    locale,
  });

  return { locale, activity, t };
};

const securityEmailService = {
  sendPasswordChangedEmail: async ({ user, req }: SendSecurityEmailParams) => {

    const { locale, activity, t } = await getSecurityEmailContext(req);
    const url = await getAbsoluteUrl({ req, pathname: `/${locale}/settings` });

    await sendEmail({
      from: serverEnv.EMAIL_FROM_SECURITY,
      to: user.email,
      subject: t("password_changed"),
      react: PasswordChangedEmail({ user, locale, url, activity }),
      headers: { "Content-Language": locale },
    });
  },

  sendTwoFactorEnabledEmail: async ({ user, req }: SendSecurityEmailParams) => {

    const { locale, activity, t } = await getSecurityEmailContext(req);
    const url = await getAbsoluteUrl({ req, pathname: `/${locale}/settings` });

    await sendEmail({
      from: serverEnv.EMAIL_FROM_SECURITY,
      to: user.email,
      subject: t("two_factor_enabled"),
      react: TwoFactorEnabledEmail({ user, locale, url, activity }),
      headers: { "Content-Language": locale },
    });
  },

  sendTwoFactorDisabledEmail: async ({
    user,
    req,
  }: SendSecurityEmailParams) => {

    const { locale, activity, t } = await getSecurityEmailContext(req);
    const url = await getAbsoluteUrl({ req, pathname: `/${locale}/settings` });

    await sendEmail({
      from: serverEnv.EMAIL_FROM_SECURITY,
      to: user.email,
      subject: t("two_factor_disabled"),
      react: TwoFactorDisabledEmail({
        user,
        locale,
        url,
        activity,
      }),
      headers: { "Content-Language": locale },
    });
  },
};

export { securityEmailService };
