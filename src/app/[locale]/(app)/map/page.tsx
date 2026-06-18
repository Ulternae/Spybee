import { MapPanel } from "@/features/map/components/map-panel";
import { getActiveProjectMap } from "@/features/map/queries/get-active-project-map";

interface MapPageProps {
  params: Promise<{ locale: string }>;
}

const MapPage = async ({ params }: MapPageProps) => {
  const { locale } = await params;
  const data = await getActiveProjectMap(locale);

  return <MapPanel data={data} locale={locale} />;
};

export default MapPage;
