import { createContext } from "react";
import { Outlet } from "react-router-dom";
import ConfigProvider from "./Contexts/ConfigContext";
export const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: (loadingState: boolean) => {},
});

function App() {
  return (
    <ConfigProvider>
      <div className="App">
        <div className="content container mx-auto">
          <Outlet />
        </div>
      </div>
    </ConfigProvider>
  );
}

export default App;
