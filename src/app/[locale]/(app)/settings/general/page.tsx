import { GeneralSettingsPanel } from "@/features/settings/components/general-settings-panel";
import { getSettingsAccount } from "@/features/settings/queries/get-settings-account";

interface GeneralSettingsPageProps {
  params: Promise<{ locale: string }>;
}

const GeneralSettingsPage = async ({ params }: GeneralSettingsPageProps) => {
  const { locale } = await params;
  const account = await getSettingsAccount(locale);

  return (
    <GeneralSettingsPanel account={account} />
  );
};

export default GeneralSettingsPage;
