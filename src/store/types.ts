import { StateCreator } from "zustand"

export type Store<TStore, TSlice> = StateCreator<
  TStore,
  [
    ["zustand/subscribeWithSelector", never],
    ["zustand/devtools", never],
    ["zustand/immer", never]
  ],
  [],
  TSlice
>;
