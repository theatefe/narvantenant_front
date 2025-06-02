// @ts-nocheck
import React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Outlet, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Modal from "@mui/material/Modal";
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
// import Badge from "@mui/material/Badge";
import Container from '@mui/material/Container';
// import Link from "@mui/material/Link";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// import NotificationsIcon from "@mui/icons-material/Notifications";
import TopNav from './TopNav';
import MobileMenu from './MobileMenu';
import Footer from '../../common/Footer';
import HeaderMobile from '../../common/HeaderMobile';
import { FromInt } from '../../../helpers/NumberTools';
import ChangePasswordModal from '../../../ui/modals/ChangePasswordModal';

// redux seters
import { setAuth } from '../../../redux/reducers/user';
import { RootState } from '../../../redux/reducers';

import PageSize from '../../../helpers/PageSize';
// import APIs
import LogOutApi from '../../../api/LogOut';
import UpdatePasswordApi from '../../../api/UpdatePassword';
// images
import logo from '../../../../assets/image/narvan_logoWithText_small_login.svg';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    anchor: 'left',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));
const ContainerMain = styled(Container, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ open }) => ({
  marginLeft: 0,
  minWidth: `calc(100% - 0px)`,
  ...(open && {
    minWidth: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  }),
}));
const theme = createTheme({
  direction: 'rtl', // Both here and <body dir="rtl">
});
// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// import Header from "../../common/Header";

// style *********
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #080808",
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

function PublicLayout() {
  const navigate = useNavigate();

  // const { height, width } = PageSize();
  const { width } = PageSize();
  // redux hooks
  const { auth } = useSelector((state: RootState) => state.userAuth);
  const { userInfo } = auth;
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(true);
  const [mobileView, setMobileView] = React.useState(false);
  const [isOpenMobileMenu, setIsOpenMobileMenu] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  // drop down
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  // update password
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  // logout ****************************************
  const logOut = async () => {
    const result = await LogOutApi(auth.token);
    if (result.status === 200) {
      Cookies.remove('user');
      dispatch(
        setAuth({
          token: null,
          userInfo: null,
          isAuthenticated: false,
        }),
      );
      navigate('/');
    }
  };
  // use effect ********************************************
  React.useEffect(() => {
    width < 768 ? setMobileView(true) : setMobileView(false);
  }, [width]);

  return (
    <>
      {mobileView ? (
        <>
          <MobileMenu
            setIsOpenMobileMenu={setIsOpenMobileMenu}
            isOpenMobileMenu={isOpenMobileMenu}
            logOut={logOut}
          />
          <div className="container-fluid d-md-none d-block" id="page-wrap">
            <div className="row">
              <div className="col-12 ">
                <HeaderMobile setIsOpenMobileMenu={setIsOpenMobileMenu} />
                <div className="row">
                  <div className="col-sm-1 d-sm-block d-none"></div>
                  <div className="col-12 col-sm-10 mt-2 mb-5 pb-5" dir="rtl">
                    <CacheProvider value={cacheRtl}>
                      <Outlet />
                    </CacheProvider>
                  </div>
                  <div className="col-sm-1 d-sm-block d-none"></div>
                </div>
              </div>
            </div>
            <Footer logOut={logOut} setIsOpenMobileMenu={setIsOpenMobileMenu} />
          </div>
        </>
      ) : (
        <div className="d-md-block d-none">
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <div dir="rtl">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row-reverse",
                    textAlign: "right !important",
                  }}
                >
                  <CssBaseline />
                  {/* نوار بالایی  بروزرسانی*/}
                    <AppBar className="fixed fixed-top" open={open} sx={{ backgroundColor: "#25c761da" }}>
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                      {/* اطلاعات کاربر راست‌چین شده */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, textAlign: "left" }}>
                        <IconButton onClick={toggleDrawer} color='inherit'>
                          {open ? <ChevronRightIcon /> : <MenuIcon />}
                          </IconButton>
                          <Typography variant="body1"  sx={{ direction: "rtl", fontSize: "16px" }}>
                            {userInfo?.tenant?.tenantType + " " + userInfo?.tenant?.name}
                          </Typography>
                      </Box>

                      {/* لیست کشویی برای نام و سمت کاربر */}
                      <Box sx={{ position: 'relative' }}>
                        <IconButton
                          color="inherit"
                          onClick={handleMenuOpen}
                          sx={{ display: "flex", alignItems: "center" }}
                          title="تنظیمات کاربر"
                        >
                          <Typography variant="body1" fontWeight="bold" sx={{ direction: "rtl", fontSize: "16px" }}>
                              {userInfo?.name + " " + userInfo?.lastName}
                          </Typography>
                          <ArrowDropDownIcon />
                        </IconButton>

                        {/* منو برای دکمه‌های خروج و تغییر رمز عبور */}
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                        >
                          {/* <MenuItem onClick={handleOpenModal}>
                            <VpnKeyIcon sx={{ marginRight: 1 }} />
                            تغییر رمز عبور
                          </MenuItem> */}
                          <MenuItem onClick={logOut} sx={{ color: "red" }}>
                            <ExitToAppIcon sx={{ marginRight: 1 }} />
                            خروج
                          </MenuItem>
                        </Menu>
                      </Box>
                    </Toolbar>
                  </AppBar>

                  {/* منو سمت چپ */}
                  <Drawer
                    variant="permanent"
                    anchor="left"
                    className="menuBig"
                    sx={{
                      flexShrink: 0,
                      transition: "width 0.3s ease",
                      "& .MuiDrawer-paper": {
                        width: open ? 240 : 0,
                        transition: "width 0.3s ease",
                        overflowX: "hidden",
                      },
                    }}
                  >
                    {/* نام شرکت */}
                    {open && (
                      <div className=" text-center my-3">
                        <img src={logo}  alt="logo" />
                      </div>
                    )}

                    <Divider />
                    <TopNav Open={open} logOut={logOut} />
                  </Drawer>

                  {/* محتوای اصلی */}
                  <Box
                    component="main"
                    sx={{
                      backgroundColor: "#fff",
                      flexGrow: 1,
                      height: "100vh",
                    }}
                  >
                    <ContainerMain open={open} theme={theme}>
                      <div className="row justify-content-center dash-content mt-5 pt-5">
                        <Outlet />
                      </div>
                    </ContainerMain>
                  </Box>
                </Box>
                  <ChangePasswordModal token={auth.token} openModal={openModal} setOpenModal={setOpenModal} />
              </div>
            </ThemeProvider>
          </CacheProvider>
        </div>
      )}
    </>
  );
}

export default PublicLayout;
