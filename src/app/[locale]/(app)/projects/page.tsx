import { CreateProjectPanel } from "@/features/projects/components/create-project-panel";
import { ProjectsPanel } from "@/features/projects/components/projects-panel";
import { getActiveOrganizationProjects } from "@/features/projects/queries/get-active-organization-projects";

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

const ProjectsPage = async ({ params }: ProjectsPageProps) => {

  const { locale } = await params;
  const { projects } = await getActiveOrganizationProjects(locale);

  if (projects.length === 0) {
    return <CreateProjectPanel />;
  }

  return (
    <ProjectsPanel projects={projects} />
  );
};

export default ProjectsPage;
