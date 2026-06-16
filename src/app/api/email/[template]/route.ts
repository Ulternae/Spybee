import { render } from "react-email";
import { VerifyAccountEmail } from "@/emails/templates/auth/verify-account";
import { ResetPassword } from "@/emails/templates/auth/reset-password";
import { JSX } from "react";
import { auth } from "@/lib/auth/auth";
import { TwoFactorDisabledEmail } from "@/emails/templates/security/two-factor-disabled";
import { PasswordChangedEmail } from "@/emails/templates/security/password-changed";
import { TwoFactorEnabledEmail } from "@/emails/templates/security/two-factor-enabled";
import { headers } from "next/headers";
import { TemplatesProps } from "@/emails/types/templates.types";
import { resolveLocaleFromRequest } from "@/i18n/resolve-locale";
import { getAbsoluteUrl } from "@/lib/server/request/request.server";

type TemplateKey =
  | "verify-account"
  | "reset-password"
  | "password-changed"
  | "two-factor-enabled"
  | "two-factor-disabled"

interface GetTemplateProps {
  params: Promise<{ template: string }>;
}

const templates: Record<
  TemplateKey,
  (props: TemplatesProps) => Promise<JSX.Element> | JSX.Element
> = {
  "reset-password": ResetPassword,
  "verify-account": VerifyAccountEmail,
  "password-changed": PasswordChangedEmail,
  "two-factor-enabled": TwoFactorEnabledEmail,
  "two-factor-disabled": TwoFactorDisabledEmail,
};

export async function GET(request: Request, { params }: GetTemplateProps) {
  const { template } = await params;
  const headersList = await headers();
  const locale = resolveLocaleFromRequest({ req: request });

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const Template = templates[template as TemplateKey];

  if (!Template) {
    return new Response("Not Found", { status: 404 });
  }


  const url = await getAbsoluteUrl({
    req: request,
    pathname: `/${locale}/settings`,
  });

  const html = await render(
    await Template({
      user: session.user,
      url,
      locale,
    }),
  );

  return new Response(html, { headers: { "Content-Type": "text/html" } });
}
