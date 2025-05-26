import React, { lazy } from 'react';

// project import
import Loadable from '../helpers/Loadable';
import ProtectUserLogin from '../permissions/ProtectUserLogin';

// render - login
const Login = Loadable(lazy(() => import('../pages/Login')));
const ForgotPassword = Loadable(lazy(() => import('../pages/ForgetPassword')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '',
  children: [
    {
      path: '/',
      element: <ProtectUserLogin />,
      children: [
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'forget-password',
          element: <ForgotPassword />,
        },
      ],
    },
  ],
};

export default LoginRoutes;
