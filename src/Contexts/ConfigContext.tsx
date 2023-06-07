import { createContext } from "react";

import { ChildrenProps } from "../types";

export const ConfigContext = createContext({
  config: {} as any,
});

const ConfigProvider = ({ children }: ChildrenProps) => {
  return (
    <ConfigContext.Provider value={{} as any}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
