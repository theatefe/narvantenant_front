import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { push as Menu } from 'react-burger-menu';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExitToApp from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import GavelIcon from '@mui/icons-material/Gavel';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import FactoryIcon from '@mui/icons-material/Factory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import LoginIcon from '@mui/icons-material/Login';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

//redux
import { RootState } from '../../../redux/reducers';

var styles = {
  bmBurgerButton: {
    display: 'none',
  },
  bmBurgerBars: {
    background: '#373a47',
  },
  bmBurgerBarsHover: {
    background: '#a90000',
  },
  bmCrossButton: {
    height: '24px',
    width: '24px',
  },
  bmCross: {
    background: '#bdc3c7',
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%',
  },
  bmMenu: {
    background: '#373a47',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em',
  },
  bmMorphShape: {
    fill: '#373a47',
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em',
  },
  bmItem: {
    display: 'inline-block',
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)',
  },
};

function MobileMenu(props) {
  const { auth } = useSelector((state: RootState) => state.userAuth);
  const location = useLocation();
  const logOut = props.logOut;

  const styleList = { alignItems: 'right', display: 'contents' };

  const selectedMenu = (route) => {
    return location.pathname === route ? `panel-link-row` : null;
  };

  return (
    <Menu
      width={'100%'}
      styles={styles}
      right
      pageWrapId={'page-wrap'}
      isOpen={props.isOpenMobileMenu}
      onClose={() => props.setIsOpenMobileMenu(false)}
    >
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
        }}
        component="nav"
        dir="ltr"
        aria-labelledby="nested-list-subheader"
      >
        <Link
          to="/"
          className="panel-link"
          onClick={() => props.setIsOpenMobileMenu(false)}
        >
          <ListItemButton className={selectedMenu('/')}>
            <ListItemText primary="خانه" />
            <ListItemIcon style={styleList}>
              <HomeIcon className="ms-auto" />
            </ListItemIcon>
          </ListItemButton>
        </Link>

       
        

        <ListItemButton
          className="text-danger"
          onClick={() => {
            props.setIsOpenMobileMenu(false);
            logOut();
          }}
        >
          <ListItemText primary="خروج" />

          <ListItemIcon style={styleList}>
            <ExitToApp className="ms-auto text-danger" />
          </ListItemIcon>
        </ListItemButton>
      </List>
    </Menu>
  );
}

export default MobileMenu;
