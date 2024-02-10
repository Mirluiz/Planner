import { createContext, useContext } from "react";
import { App } from "../../app/App";
import { Database } from "../../system/Database";

const SceneProviderContext = createContext<{
  app: App | null;
  database: Database | null;
  setBackDrop: (b: boolean) => void;
}>({
  app: null,
  database: null,
  setBackDrop: (b: boolean) => {},
});

const useSceneContext = () => {
  return useContext(SceneProviderContext);
};

export { SceneProviderContext, useSceneContext };
