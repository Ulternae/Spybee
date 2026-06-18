import { ProjectPanel } from "@/features/projects/components/project-panel";
import { getProjectDetail } from "@/features/projects/queries/get-project-detail";

interface ProjectDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { locale, id } = await params;
  const data = await getProjectDetail({
    projectId: id,
    locale,
  });

  return <ProjectPanel data={data} />;
};

export default ProjectDetailPage;
