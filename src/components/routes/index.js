import { useRoutes } from "react-router-dom";

// project import
import LoginRoutes from "./LoginRoutes";
import MainRoutes from "./MainRoutes";
import P404 from '../pages/P404';

// ==============================|| ROUTING RENDER ||============================== //

const ThemeRoutes = () => {
  return useRoutes([
    MainRoutes,
    LoginRoutes,
    {
      path: '*',
      element: <P404 />,
    },
  ]);
};
export default ThemeRoutes;
