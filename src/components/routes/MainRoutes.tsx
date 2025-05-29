import React, { lazy } from 'react';
import Loadable from '../helpers/Loadable';

// project layouts

import ProtectUserRoute from '../permissions/ProtectUserRoute';

// render - pages
import Landing from '../pages/Landing';

const CourseLevelCat = Loadable(
  lazy(() => import('../pages/CourseLevelCat'))
)
const CourseLevel = Loadable(
  lazy(() => import('../pages/CourseLevel'))
)
const Coach = Loadable(
  lazy(() => import('../pages/Coach'))
)
const Student = Loadable(
  lazy(() => import('../pages/Student'))
)
const Class = Loadable(
  lazy(() => import('../pages/Class'))
)
const ClassEnrollment = Loadable(
  lazy(() => import('../pages/ClassEnrollment'))
)
const Attendance = Loadable(
  lazy(() => import('../pages/Attendance'))
)
const Payment = Loadable(
  lazy(() => import('../pages/Payment'))
)
const Role = Loadable(
  lazy(() => import('../pages/Role'))
)
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '',
      element: <ProtectUserRoute />,
      children: [
        {
          path: '',
          element: <Landing />,
        },
        {
          path: '/levelCats',
          element: <CourseLevelCat />,
        },
        {
          path: '/levels/:catId',
          element: <CourseLevel />,
        },
        {
          path: '/coaches',
          element: <Coach />,
        },
        {
          path: '/roles',
          element: <Role />,
        },
        {
          path: '/students',
          element: <Student />,
        },
        {
          path: '/classes',
          element: <Class />,
        },
        {
          path: '/classEnrollments/:classId',
          element: <ClassEnrollment />,
        },
        {
          path: '/attendances/:classId',
          element: <Attendance />,
        },
        {
          path: '/payments',
          element: <Payment />,
        },
      ],
    },
  ],
};

export default MainRoutes;
