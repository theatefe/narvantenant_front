import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
// import logoPng from "../../assets/assets/img/logo.png";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Cookies from 'js-cookie';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import BadgeIcon from '@mui/icons-material/Badge';
import InputAdornment from '@mui/material/InputAdornment';
// image 
import logoPng from '../../assets/image/logo.svg';

// Api
import LoginApi from './../api/Login';

// redux seters
import { setAuth } from '../redux/reducers/user';
import { setMetaData, setIsLoading } from '../redux/reducers/page';


const Wating = () => (
  <CircularProgress size="24px" color="inherit" />

);

const theme = createTheme();
const Login = () => {

  const [loginBtnText, setLoginBtnText] = useState<string | JSX.Element>('ورود');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  // redux
  const dispatch = useDispatch();

  // handle change username
  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
  };
  // handle change password
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const loginHandler = async (event) => {
    event.preventDefault();

    if (password.length < 3 || username.length < 3) {
      setLoginBtnText('نام کاربری و رمز عبور صحیح نیست');
      setTimeout(() => setLoginBtnText('ورود'), 1500);
      return;
    }
    setLoginBtnText(<Wating />);

    const result = await LoginApi(username, password);
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
      setLoginBtnText(result.data.error);
      setTimeout(() => setLoginBtnText('ورود'), 1500);
    }
  };

  React.useEffect(() => {
    dispatch(
      setMetaData({
        title: 'نارون :: ورود کاربر',
        description: 'ورود کاربر',
      }),
    );
    setTimeout(() => dispatch(setIsLoading(false)), 300);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="p-3" style={{ backgroundColor: '#e8f5e9', minHeight: '100vh' }}>
        <Box
          sx={{
            backgroundColor: '#e8f5e9',
            minHeight: '90vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              maxWidth: 360,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'transparent',
                width: 72,
                height: 72,
                mx: 'auto',
                mb: 1,
              }}
            >
              <img src={logoPng} alt="لوگو" style={{ width: '100%', height: '100%' }} />
            </Avatar>
            <Typography variant="h6" sx={{ color: '#25c761', fontWeight: 600, mb: 3 }}>
              ورود به پنل کاربری
            </Typography>

            <Box component="form" onSubmit={loginHandler} noValidate>
              <TextField
                dir="ltr"
                margin="normal"
                fullWidth
                required
                label="شماره موبایل"
                placeholder="مثلاً 09123456789"
                name="username"
                value={username}
                onChange={handleChangeUsername}
                inputProps={{ maxLength: 11 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneAndroidIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                dir="ltr"
                margin="normal"
                fullWidth
                required
                label="کد ملی"
                name="password"
                type="text"
                placeholder="مثلاً 1234567890"
                onChange={handleChangePassword}
                inputProps={{ maxLength: 10 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  bgcolor: '#25c761',
                  '&:hover': {
                    bgcolor: '#1eaa55',
                  },
                  fontWeight: 'bold',
                }}
              >
                {loginBtnText}
              </Button>

              <Typography variant="body2" sx={{ mt: 2 }}>
                رمز عبور خود را فراموش کرده‌اید؟{' '}
                <Link to="/forget-password" style={{ color: '#25c761', textDecoration: 'underline' }}>
                  اینجا
                </Link>{' '}
                کلیک کنید
              </Typography>
            </Box>
          </Paper>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default Login;
