import { MapPanel } from "@/features/map/components/map-panel";
import { getActiveProjectMap } from "@/features/map/queries/get-active-project-map";

const MapPage = async () => {
  const data = await getActiveProjectMap();

  return (
    <MapPanel data={data} />
  );
};

export default MapPage;
