import { OrganizationsPanel } from "@/features/organizations/components/organizations-panel";
import { getUserOrganizations } from "@/features/organizations/queries/get-user-organizations";
import { CreateOrganizationPanel } from "@/features/organizations/components/create-organization-panel";

interface OrganizationsPageProps {
  params: Promise<{ locale: string }>;
}

const OrganizationsPage = async ({ params }: OrganizationsPageProps) => {
  const { locale } = await params;
  const organizations = await getUserOrganizations(locale);

  if (organizations.length === 0) {
    return <CreateOrganizationPanel />
  }

  return <OrganizationsPanel organizations={organizations} />;
};

export default OrganizationsPage;
