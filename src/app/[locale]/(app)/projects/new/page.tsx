import { CreateProjectPanel } from "@/features/projects/components/create-project-panel";
import { getActiveOrganizationProjects } from "@/features/projects/queries/get-active-organization-projects";

interface NewProjectPageProps {
  params: Promise<{ locale: string }>;
}

const NewProjectPage = async ({ params }: NewProjectPageProps) => {
  const { locale } = await params;

  await getActiveOrganizationProjects(locale);

  return <CreateProjectPanel />;
};

export default NewProjectPage;
