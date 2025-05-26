import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
// import { PwaUpdater } from 'pwa-updater';

import DocumentMeta from 'react-document-meta';
// import RequestForToken, {
//   onMessageListener,
// } from "./components/notification/firebase";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/helpers/ErrorHandler';
import Loading from './components/layout/common/Loading';
import ScrollTop from './components/helpers/ScrollTop';

import AppRoutes from './components/routes';
import 'bootstrap';

// Api
import GetUserInf from './components/api/GetUserInf';

// external AP
// redux setters
import { setAuth } from './components/redux/reducers/user';
import { RootState } from './components/redux/reducers';

function App() {
  // redux hooks
  const { metaData } = useSelector((state: RootState) => state.page);
  const dispatch = useDispatch();

  // react state hooks
  const [checked, setChecked] = React.useState(false);
  // const [notifPermission, SendNotifPermission] = React.useState(false);

  // ساختن اطلاعات اولیه صفحه
  const inisializeLanding = async () => {
    // کنترل توکن کاربر
    const userToken = Cookies.get('user');
    if (userToken && userToken !== 'undefined') {
      const result = await GetUserInf(userToken);
      if (result.status === 200) {
        Cookies.set('user', result.data.token, { expires: 7 });
        dispatch(
          setAuth({
            token: result.data.token,
            userInfo: result.data,
            isAuthenticated: true,
          }),
        );
      } else {
        Cookies.remove('user');
        dispatch(
          setAuth({
            token: null,
            userInfo: null,
            isAuthenticated: false,
          }),
        );
      }
    }
    setChecked(true);
  };
  React.useEffect(() => {
    // دسترسی و گرفتن فایربیس توکن
    // try {
    //   Notification.requestPermission().then((permission) => {
    //     if (permission === 'granted') {
    //       // onMessageListener();
    //       // SendNotifPermission(true);
    //     } else console.log('no permission to send Notification');
    //   });
    // } catch (error) {
    //   // Safari doesn't return a promise for requestPermissions and it
    //   // throws a TypeError. It takes a callback as the first argument
    //   // instead.
    //   try {
    //     Notification.requestPermission().then((permission) => {
    //       if (permission === 'granted') {
    //         // onMessageListener();
    //         // SendNotifPermission(true);
    //       } else console.log('no permission to send Notification');
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // } // گرفتن دسترسی و ست کردن موقعیت

    // AddLibrary(
    //   process.env.REACT_APP_STATIC_DIR + 'js/jquery-3.6.1.slim.min.js',
    // );
    // AddLibrary(process.env.REACT_APP_STATIC_DIR + 'js/popper.js');
    // AddLibrary(process.env.REACT_APP_STATIC_DIR + 'js/bootstrap.js');

    inisializeLanding();
  }, []);

  return (
    <ErrorBoundary>
      {/* <PwaUpdater notify={true} /> */}
      {/* {notifPermission ? <RequestForToken /> : null} */}
      <DocumentMeta {...metaData}>
        <Loading />
        <ScrollTop>{checked ? <AppRoutes /> : null}</ScrollTop>
        <ToastContainer className="text-right" />
      </DocumentMeta>
    </ErrorBoundary>
  );
}

export default App;
