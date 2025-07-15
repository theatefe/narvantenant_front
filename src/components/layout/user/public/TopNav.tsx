import React from 'react';
import Cookies from 'js-cookie';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// MUI ******************************************************************
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

//**************************************************************************/
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CategoryIcon from '@mui/icons-material/Category';
import PoolIcon from '@mui/icons-material/Pool';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SchoolIcon from '@mui/icons-material/School';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PaidIcon from '@mui/icons-material/Paid';


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
  const permissions = auth.userInfo.Role.Permissions;
  const isPoolTenant = auth?.userInfo?.tenant?.type === "POOL";
  const token = auth.token;
  const location = useLocation();
  const [openModal, setOpenModal] = React.useState(false);
  const [openUser, setOpenUser] = React.useState(false);
  const [openCompany, setOpenCompany] = React.useState(false);
  const [openPoolRecord, setOpenPoolRecord] = React.useState(false);
  const [openMarket, setOpenMarket] = React.useState(false);
  const [openClass, setOpenClass] = React.useState(false);
  const [openPayment, setOpenPayment] = React.useState(false);
  const [UsersManagmentSetMenu, setUserManagmentSetMenu] = React.useState('none');
  const [PoolRecordsSetMenu, setPoolRecordsSetMenu] = React.useState('none');
  const [MarketSetMenu, setMarketSetMenu] = React.useState('none');
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
  const handleClickPoolRecord = () => {
    setOpenPoolRecord(!openPoolRecord);
  }
  const handleClickMarket = () => {
    setOpenMarket(!openMarket);
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
    if (permissions.find((p) => p.operationId === 'tenantListCoaches') ||
      permissions.find((p) => p.operationId === 'tenantListStudents') ||
      permissions.find((p) => p.operationId === 'tenantListRoles')) setUserManagmentSetMenu('');
    if (permissions.find((p) => p.operationId === 'tenantListSkill') ||
      permissions.find((p) => p.operationId === 'tenantListSkillRange') ||
      permissions.find((p) => p.operationId === 'tenantListSkillRecord')) setPoolRecordsSetMenu('');
    if (permissions.find((p) => p.operationId === 'tenantListProductCategory') ||
      permissions.find((p) => p.operationId === 'tenantListOrder')) setMarketSetMenu('');
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
        <ListItemButton style={{ display: UsersManagmentSetMenu }} onClick={handleClickUser}>
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
            <List component="div" disablePadding>
              {/* مربیان */}
              {permissions.find((p) => p.operationId === 'tenantListCoaches') ?
                <Link to="/coaches" className="panel-link">
                  <ListItemButton
                    sx={{ pr: 4 }}
                    className={selectedMenu('/coaches')}
                  >
                    <ListItemText>
                      <div className="sub-menu">مربیان</div>
                    </ListItemText>
                  </ListItemButton>
                </Link> : null}


              {/*  دانش آموزان */}
              {permissions.find((p) => p.operationId === 'tenantListStudents') ?
                <Link to="/students" className="panel-link">
                  <ListItemButton
                    sx={{ pr: 4 }}
                    className={selectedMenu('/students')}
                  >
                    <ListItemText>
                      <div className="sub-menu">{isPoolTenant ? 'شناگران' : 'دانش آموزان'}</div>
                    </ListItemText>
                  </ListItemButton>
                </Link> : null}

              {/* نقش ها و دسترسی ها */}
              {permissions.find((p) => p.operationId === 'tenantListRoles') ?
                <Link to="/roles" className="panel-link">
                  <ListItemButton
                    sx={{ pr: 4 }}
                    className={selectedMenu('/roles')}
                  >
                    <ListItemText>
                      <div className="sub-menu">نقش ها و دسترسی ها</div>
                    </ListItemText>
                  </ListItemButton>
                </Link> : null}
            </List>
          </Collapse>
        )}
        {/* ************************* courseLevelCategory ************************** */}
        {permissions.find((p) => p.operationId === 'tenantListCourseLevelCategory') ?
          <>
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
          </>
          : null}
        {/* ************************************** classes ********************************************** */}
        {permissions.find((p) => p.operationId === 'tenantListClasses') ?
          <>
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
          </>
          : null}
        {/* ********************************** payments ************************************* */}
        {permissions.find((p) => p.operationId === 'tenantListPayments') ?
          <>
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
          </> : null}
        {/* ************************* SkillRecord ************************** */}
        {isPoolTenant ? (
          <>
            <ListItemButton onClick={handleClickPoolRecord} style={{ display: PoolRecordsSetMenu }}>
              {openMenu ? (
                openPoolRecord ? <ExpandLessIcon /> : <ExpandMoreIcon />
              ) : (
                ''
              )}
              {openMenu ? <ListItemText primary='رکوردگیری و نتایج تست' /> : ''}

              <ListItemIcon style={styleList}>
                <PoolIcon className="ms-auto" />
              </ListItemIcon>
            </ListItemButton>

            {openMenu && (
              <Collapse in={openPoolRecord} timeout="auto" unmountOnExit>
                {/* تعریف مهارت ها */}
                {permissions.find((p) => p.operationId === 'tenantListSkill') ?
                  <List component="div" disablePadding>
                    <Link to="/skills" className="panel-link">
                      <ListItemButton
                        sx={{ pr: 4 }}
                        className={selectedMenu('/skills')}
                      >
                        <ListItemText>
                          <div className="sub-menu"> {'ماده'}</div>
                        </ListItemText>
                      </ListItemButton>
                    </Link>
                  </List>
                  : null}
                {permissions.find((p) => p.operationId === 'tenantListSkillRecord') ?
                  <List component="div" disablePadding>
                    <Link to="/skillRecords" className="panel-link">
                      <ListItemButton
                        sx={{ pr: 4 }}
                        className={selectedMenu('/skillRecords')}
                      >
                        <ListItemText>
                          <div className="sub-menu">مدیریت رکوردها </div>
                        </ListItemText>
                      </ListItemButton>
                    </Link>
                  </List>
                  : null}
              </Collapse>
            )}
          </>
        ) : (<></>)}
        {/* ************************* Products and orders ************************** */}
        {permissions.find((p) => p.operationId === 'tenantListProductCategory') ?
          <>
            <ListItemButton onClick={handleClickMarket} style={{ display: MarketSetMenu }}>
              {openMenu ? (
                openMarket ? <ExpandLessIcon /> : <ExpandMoreIcon />
              ) : (
                ''
              )}
              {openMenu ? <ListItemText primary="مدیریت فروشگاه" /> : ''}

              <ListItemIcon style={styleList}>
                <ShoppingBasketIcon className="ms-auto" />
              </ListItemIcon>
            </ListItemButton>

            {openMenu && (
              <Collapse in={openMarket} timeout="auto" unmountOnExit>
                {/* تعریف دسته بندی محصولات */}
                {permissions.find((p) => p.operationId === 'tenantListProductCategory') ?
                  <List component="div" disablePadding>
                    <Link to="/productCats" className="panel-link">
                      <ListItemButton
                        sx={{ pr: 4 }}
                        className={selectedMenu('/productCats')}
                      >
                        <ListItemText>
                          <div className="sub-menu"> دسته بندی محصولات</div>
                        </ListItemText>
                      </ListItemButton>
                    </Link>
                  </List>
                  : null}
                {permissions.find((p) => p.operationId === 'tenantListOrder') ?
                  <List component="div" disablePadding>
                    <Link to="/orders" className="panel-link">
                      <ListItemButton
                        sx={{ pr: 4 }}
                        className={selectedMenu('/orders')}
                      >
                        <ListItemText>
                          <div className="sub-menu"> سفارشات </div>
                        </ListItemText>
                      </ListItemButton>
                    </Link>
                  </List>
                  : null}
              </Collapse>
            )}
          </>
          : null}
        {/* ************************* Food Plans ************************** */}
        <>
          {permissions.find((p) => p.operationId === 'tenantListProductCategory') ?
            <Link to="/plans" className="panel-link">
              <ListItemButton>
                {openMenu ? <ListItemText primary="رژیم و برنامه غذایی" /> : ''}

                <ListItemIcon style={styleList}>
                  <RestaurantIcon className="ms-auto" />
                </ListItemIcon>
              </ListItemButton>
            </Link>
            : null}
        </>
      </List>
      <ChangePasswordModal token={token} openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
}

export default TopNav;
