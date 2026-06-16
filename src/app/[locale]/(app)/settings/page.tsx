import { GeneralSettingsPanel } from "@/features/settings/components/general-settings-panel";
import { getSettingsAccount } from "@/features/settings/queries/get-settings-account";
interface SettingsPageProps {
  params: Promise<{ locale: string }>;
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { locale } = await params;
  const account = await getSettingsAccount(locale);

  return (
    <GeneralSettingsPanel account={account} />
  );
};

export default SettingsPage;
