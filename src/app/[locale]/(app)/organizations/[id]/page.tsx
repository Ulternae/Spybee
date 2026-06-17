import { OrganizationPanel } from "@/features/organizations/components/organization-panel";
import { getOrganizationDetail } from "@/features/organizations/queries/get-organization-detail";

interface OrganizationDetailPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

const OrganizationDetailPage = async ({ params }: OrganizationDetailPageProps) => {
  const { id, locale } = await params;

  const data = await getOrganizationDetail({ organizationId: id, locale });

  return <OrganizationPanel data={data} />;
};

export default OrganizationDetailPage;
