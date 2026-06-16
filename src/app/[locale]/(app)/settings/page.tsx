import { redirect } from "@/i18n/navigation";

interface SettingsPageProps {
  params: Promise<{ locale: string }>;
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { locale } = await params;

  redirect({ href: "/settings/general", locale });
};

export default SettingsPage;
