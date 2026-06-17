import { OrganizationsPanel } from "@/features/organizations/components/organizations-panel";
import { getUserOrganizations } from "@/features/organizations/queries/get-user-organizations";
import { CreateOrganizationPanel } from "@/features/organizations/components/create-organization-panel";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

interface OrganizationsPageProps {
  params: Promise<{ locale: string }>;
}

const OrganizationsPage = async ({ params }: OrganizationsPageProps) => {
  const { locale } = await params;
  const organizations = await getUserOrganizations(locale);
  const data = await auth.api.getSession({ headers: await headers() })
  const activeOrganizationId = data?.session?.activeOrganizationId

  if (organizations.length === 0) {
    return <CreateOrganizationPanel />
  }

  return <OrganizationsPanel organizations={organizations} activeOrganizationId={activeOrganizationId} />;
};

export default OrganizationsPage;
