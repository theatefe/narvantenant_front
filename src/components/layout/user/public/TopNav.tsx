import React from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// MUI ******************************************************************
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

//**************************************************************************/
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CategoryIcon from '@mui/icons-material/Category';
import SchoolIcon from '@mui/icons-material/School';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PaidIcon from '@mui/icons-material/Paid';

import IconSettings from '../../../ui/icon/IconSettings';
import IconEdit from '../../../ui/icon/IconEdit';
import IconLoader from '../../../ui/icon/IconLoader';


// import Modals
import ChangePasswordModal from '../../../ui/modals/ChangePasswordModal';
// import APIs
import LogOutApi from '../../../api/LogOut';
// redux seters
import { RootState } from './../../../redux/reducers';
import { setAuth } from '../../../redux/reducers/user';


function TopNav(props) {
  const navigate = useNavigate();

  // redux hooks
  const { auth } = useSelector((state: RootState) => state.userAuth);
  const token = auth.token;
  const location = useLocation();
  const [openModal, setOpenModal] = React.useState(false);
  const [openUser, setOpenUser] = React.useState(false);
  const [openCompany, setOpenCompany] = React.useState(false);
  const [openClass, setOpenClass] = React.useState(false);
  const [openPayment, setOpenPayment] = React.useState(false);
  const dispatch = useDispatch();
  const openMenu = props.Open;
  const styleList = !openMenu
    ? { alignItems: 'center', display: 'contents' }
    : { alignItems: '', display: '' };
  // selected Menu ********************************
  const selectedMenu = (route) => {
    return location.pathname === route ? `panel-link-row` : null;
  };
  // Open Menu *************************************
  const handleClickCompany = () => {
    setOpenCompany(!openCompany);
  }
  const handleClickClass = () => {
    setOpenClass(!openClass);
  }
  const handleClickPayment = () => {
    setOpenPayment(!openPayment);
  }
  const handleClickUser = () => {
    setOpenUser(!openUser);
  }
  // logout ****************************************
  const logOut = async () => {
    const result = await LogOutApi(token);
    if (result.status === 200) {
      Cookies.remove('admin');
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
  // catch data **************************************************

  React.useEffect(() => {
  }, []);
  return (
    <>
      <List
        sx={{
          width: '100%',
          maxWidth: 360,
          bgcolor: 'background.paper',
          padding: '0px',
        }}
        component="nav"
        dir="ltr"
        aria-labelledby="nested-list-subheader"
      >
        {/* لیست منوها ************************************************************************************ */}
        <List
          style={{
            padding: '12px 28px',
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            color: '#5f5f5f',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}
        >
          <span>{'خوش آمدید'}</span>
        </List>
        <ListItemButton onClick={handleClickUser}>
          {openMenu ? (
            openUser ? <ExpandLessIcon /> : <ExpandMoreIcon />
          ) : (
            ''
          )}
          {openMenu ? <ListItemText primary="مدیریت کاربران" /> : ''}

          <ListItemIcon style={styleList}>
            <PeopleAltIcon className="ms-auto" />
          </ListItemIcon>
        </ListItemButton>

        {openMenu && (
          <Collapse in={openUser} timeout="auto" unmountOnExit>
            {/* مربیان */}
            <List component="div" disablePadding>
              <Link to="/coaches" className="panel-link">
                <ListItemButton
                  sx={{ pr: 4 }}
                  className={selectedMenu('/coaches')}
                >
                  <ListItemText>
                    <div className="sub-menu">مربیان</div>
                  </ListItemText>
                </ListItemButton>
              </Link>


              {/*  دانش آموزان */}
              <Link to="/students" className="panel-link">
                <ListItemButton
                  sx={{ pr: 4 }}
                  className={selectedMenu('/students')}
                >
                  <ListItemText>
                    <div className="sub-menu"> دانش آموزان</div>
                  </ListItemText>
                </ListItemButton>
              </Link>
            </List>
          </Collapse>
        )}
        <ListItemButton onClick={handleClickCompany}>
          {openMenu ? (
            openCompany ? <ExpandLessIcon /> : <ExpandMoreIcon />
          ) : (
            ''
          )}
          {openMenu ? <ListItemText primary="مدیریت مقاطع آموزشی" /> : ''}

          <ListItemIcon style={styleList}>
            <CategoryIcon className="ms-auto" />
          </ListItemIcon>
        </ListItemButton>

        {openMenu && (
          <Collapse in={openCompany} timeout="auto" unmountOnExit>
            {/* سطوح آموزشی */}
            <List component="div" disablePadding>
              <Link to="/levelCats" className="panel-link">
                <ListItemButton
                  sx={{ pr: 4 }}
                  className={selectedMenu('/levelCats')}
                >
                  <ListItemText>
                    <div className="sub-menu">دسته بندی مقاطع آموزشی</div>
                  </ListItemText>
                </ListItemButton>
              </Link>
            </List>
          </Collapse>
        )}
        <ListItemButton onClick={handleClickClass}>
          {openMenu ? (
            openClass ? <ExpandLessIcon /> : <ExpandMoreIcon />
          ) : (
            ''
          )}
          {openMenu ? <ListItemText primary="مدیریت کلاس ها" /> : ''}

          <ListItemIcon style={styleList}>
            <SchoolIcon className="ms-auto" />
          </ListItemIcon>
        </ListItemButton>

        {openMenu && (
          <Collapse in={openClass} timeout="auto" unmountOnExit>
            {/* تعریف کلاس ها */}
            <List component="div" disablePadding>
              <Link to="/classes" className="panel-link">
                <ListItemButton
                  sx={{ pr: 4 }}
                  className={selectedMenu('/classes')}
                >
                  <ListItemText>
                    <div className="sub-menu">کلاس های آموزشی</div>
                  </ListItemText>
                </ListItemButton>
              </Link>
            </List>
          </Collapse>
        )}

        <ListItemButton onClick={handleClickPayment}>
          {openMenu ? (
            openPayment ? <ExpandLessIcon /> : <ExpandMoreIcon />
          ) : (
            ''
          )}
          {openMenu ? <ListItemText primary="مدیریت پرداخت ها" /> : ''}

          <ListItemIcon style={styleList}>
            <PaidIcon className="ms-auto" />
          </ListItemIcon>
        </ListItemButton>

        {openMenu && (
          <Collapse in={openPayment} timeout="auto" unmountOnExit>
            {/* پرداخت شهریه ها */}
            <List component="div" disablePadding>
              <Link to="/payments" className="panel-link">
                <ListItemButton
                  sx={{ pr: 4 }}
                  className={selectedMenu('/payments')}>
                  <ListItemText>
                    <div className="sub-menu">پرداخت شهریه‌ها</div>
                  </ListItemText>
                </ListItemButton>
              </Link>
            </List>
          </Collapse>
        )}
      </List>
      <ChangePasswordModal token={token} openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
}

export default TopNav;
