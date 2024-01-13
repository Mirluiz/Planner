import { createContext, useContext } from "react";
import { App } from "../../app/App";

const SceneProviderContext = createContext<{
  app: App | null;
}>({
  app: null,
});

const useSceneContext = () => {
  return useContext(SceneProviderContext);
};

export { SceneProviderContext, useSceneContext };
