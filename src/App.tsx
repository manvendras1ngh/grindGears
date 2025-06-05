import { Routes, Route } from "react-router-dom";

import type { AppRoutes } from "./utils/types";
import { StoreContextProvider } from "./contexts/CartContext";
import { Toaster } from "react-hot-toast";

function App({ routes }: { routes: AppRoutes[] }) {
  return (
    <StoreContextProvider>
      <Routes>
        {routes.map(({ path, element }, index) => (
          <Route key={index} path={path} element={element} />
        ))}
      </Routes>
      <Toaster />
    </StoreContextProvider>
  );
}

export default App;
