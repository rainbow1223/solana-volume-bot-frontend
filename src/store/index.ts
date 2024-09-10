import { create } from "zustand";

interface RunState {
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
}

const useRunStore = create<RunState>()((set) => ({
  isRunning: false,
  setIsRunning: (isRunning) => set({ isRunning }),
}));

export default useRunStore;
