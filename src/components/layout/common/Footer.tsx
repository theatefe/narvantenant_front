import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

//import MUI
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ExitToApp from '@mui/icons-material/ExitToApp';
import Backdrop from '@mui/material/Backdrop';

// import icons
import HomeIcon from '@mui/icons-material/Home';
import LabelIcon from '@mui/icons-material/Label';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import LoginIcon from '@mui/icons-material/Login';
import ScaleIcon from '@mui/icons-material/Scale';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
function Footer(props) {
  // redux hooks

  const location = useLocation();

  const [openSpeed, setOpenSpeed] = React.useState(false);
  const handleOpen = () => setOpenSpeed(!openSpeed);
  const handleClose = () => setOpenSpeed(!openSpeed);

  const { logOut } = props;

  const actions = [
    {
      icon: (
        <Link to="/transport/loading/waiting">
          <LabelIcon className="text-success" />
        </Link>
      ),
      name: ' در پارکینگ جهت بارگیری ',
      link: '/transport/loading/waiting',
    },
    {
      icon: (
        <Link to="/transport/loading/ontheway">
          <LabelIcon className="text-success" />
        </Link>
      ),
      name: ' در مسیر بارگیری ',
      link: '/transport/loading/ontheway',
    },
    {
      icon: (
        <Link to="/transport/discharge/waiting">
          <LabelIcon className="text-success" />
        </Link>
      ),
      name: ' در پارکینگ جهت تخلیه ',
      link: '/transport/discharge/waiting',
    },
    {
      icon: (
        <Link to="/transport/discharge/ontheway">
          <LabelIcon className="text-success" />
        </Link>
      ),
      name: ' در مسیر تخلیه ',
      link: '/transport/discharge/ontheway',
    },
  ];
  const selectedMenu = (route) => {
    return location.pathname === route ? `text-danger` : 'text-dark';
  };
  return (
    <>
      {' '}
      {/* <div className="row">
        <div className="col-12" style={{ zIndex: 5001 }}>
          {' '}
          <div className="container-fluid">
            <div className="row fixed-bottom">
              <div className="col-12 px-0">
                <div className="topFooterShape"></div>
              </div>
            </div>
            <div className="row footer fixed-bottom">
              <div className="col-12">
                <div className="row mx-0 justify-content-between py-2">
                  <div className="col px-0 text-center">
                    <Link
                      to=""
                      onClick={logOut}
                      className={selectedMenu('/logout')}
                    >
                      <LoginIcon />
                      <p className="footer-link"> خروج</p>
                    </Link>
                  </div>
                  <div className="col px-0 text-center">
                    <Link
                      to="/transport/loading"
                      className={selectedMenu('/transport/loading')}
                    >
                      <LocalShippingOutlinedIcon />
                      <p className="footer-link">بارگیری</p>
                    </Link>
                  </div>
                  <div className="col px-0 text-center">
                    <Link
                      to="/transport/discharge"
                      className={selectedMenu('/transport/discharge')}
                    >
                      <LocalShippingIcon />
                      <p className="footer-link">تخلیه</p>
                    </Link>
                  </div>
                  <div className="col px-0 text-center">
                    <Link
                      to="/transport/loading/polomp"
                      className={selectedMenu('/transport/loading/polomp')}
                    >
                      <ScaleIcon />
                      <p className="footer-link">در انتظار پملپ</p>
                    </Link>
                  </div>
                  <div className="col px-0 text-center">
                    <Link to="/" className={selectedMenu('/')}>
                      <HomeIcon />
                      <p className="footer-link">خانه</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <Backdrop open={openSpeed} />
      <SpeedDial
        ariaLabel="دسترسی سریع"
        sx={{ position: 'fixed', bottom: 60, right: 10 }}
        icon={<SpeedDialIcon />}
        onClick={handleOpen}
        open={openSpeed}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={() => {
              window.open(action.link, '_self', 'noopener,noreferrer');
              handleClose();
            }}
          />
        ))}
      </SpeedDial> */}
    </>
  );
}

export default Footer;
