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
const Skill = Loadable(
  lazy(() => import('../pages/Skill'))
)
const SkillRange = Loadable(
  lazy(() => import('../pages/SkillRange'))
)
const SkillRecord = Loadable(
  lazy(() => import('../pages/SkillRecord'))
)
const ProductCat = Loadable(
  lazy(() => import('../pages/ProductCat'))
)
const Product = Loadable(
  lazy(() => import('../pages/Product'))
)
const Order = Loadable(
  lazy(() => import('../pages/Order'))
)
const ClassEnrollmentPayList = Loadable(
  lazy(() => import('../pages/ClassEnrollmentPay'))
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
        {
          path: '/skills',
          element: <Skill />,
        },
        {
          path: '/skillRanges',
          element: <SkillRange />,
        },
        {
          path: '/skillRecords',
          element: <SkillRecord />,
        }, 
        {
          path: '/productCats',
          element: <ProductCat />,
        },
        {
          path: '/products/:catId',
          element: <Product />,
        },
        {
          path: '/orders',
          element: <Order />,
        },
        {
          path: '/classEnrollmentPays/:id',
          element: <ClassEnrollmentPayList/>
        }
      ],
    },
  ],
};

export default MainRoutes;
