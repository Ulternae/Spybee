import { mapActions } from "./map.actions";
import { initialMapState } from "./map.initial";
import type { MapSliceStore } from "./map.types";

const createMapSlice: MapSliceStore = (set) => ({
  ...initialMapState,
  ...mapActions(set),
});

export { createMapSlice };
