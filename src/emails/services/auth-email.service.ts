import { sendEmail } from "@/lib/server/email";
import { VerifyAccountEmail } from "@/emails/templates/auth/verify-account";
import { resolveLocaleFromRequest } from "@/i18n/resolve-locale";
import { createTranslator } from "next-intl";
import { ResetPassword } from "@/emails/templates/auth/reset-password";
import { serverEnv } from "@/config/env.server";
import { User } from "better-auth";

interface SendVerifyAccountEmailParams {
  user: User;
  url: string;
  req?: Request;
}

const authEmailService = {

  sendVerifyAccountEmail: async ({ user, url, req }: SendVerifyAccountEmailParams) => {
    const locale = resolveLocaleFromRequest({ req })

    const t = createTranslator({
      messages: await import(`@/messages/${locale}/email.json`),
      namespace: 'subjects',
      locale,
    });


    await sendEmail({
      from: serverEnv.EMAIL_FROM_AUTH,
      to: user.email,
      subject: t("verify_account"),
      react: VerifyAccountEmail({ user, url, locale }),
      headers: { "Content-Language": locale }
    })
  },

  sendResetPasswordEmail: async ({ user, url, req }: SendVerifyAccountEmailParams) => {
    const locale = resolveLocaleFromRequest({ req })

    const t = createTranslator({
      messages: await import(`@/messages/${locale}/email.json`),
      namespace: 'subjects',
      locale,
    });


    await sendEmail({
      from: serverEnv.EMAIL_FROM_AUTH,
      to: user.email,
      subject: t("reset_password"),
      react: ResetPassword({ user, url, locale }),
      headers: { "Content-Language": locale }
    })
  }

}

export { authEmailService }