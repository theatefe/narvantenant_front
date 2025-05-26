import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
// import logoPng from "../../assets/assets/img/logo.png";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Cookies from 'js-cookie';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';


// Api
import ForgetPasswordApi from './../api/ForgetPassword';
import RecoverPasswordApi from './../api/RecoverPassword';

// redux seters
import { setAuth } from '../redux/reducers/user';
import { RootState } from '../redux/reducers';
import { setMetaData, setIsLoading } from '../redux/reducers/page';

// helpers

import { validateMobile } from '../helpers/NumberTools';
const Wating = () => (
  <CircularProgress size="24px" color="inherit" />

);

const theme = createTheme();
const ForgetPassword = () => {

  const [recoverBtnText, setRecoverBtnText] = useState<string | JSX.Element>('تایید');
  const [stepOne, setStepOne] = useState(true);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [recover_pass_token, setRecover_pass_token] = useState('');
  // redux
  const dispatch = useDispatch();

  // handle change mobile
  const handleChangeMobile = (e) => {
    setMobile(e.target.value);
  };
  // handle change password
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  // handle change passwordConfirm
  const handleChangePasswordConfirm = (e) => {
    setConfirmPassword(e.target.value);
  };
  // handle change code
  const handleChangeCode = (e) => {
    setCode(e.target.value);
  };
  // handle reset from
  const handleResetForm = () => {
    setMobile('');
    setPassword('');
    setConfirmPassword('');
    setCode('');
    setRecover_pass_token('');
    setStepOne(true);
  };

  const sendCodeHandler = async (event) => {
    event.preventDefault();

    if (!validateMobile(mobile)) {
      setRecoverBtnText('شماره موبایل صحیح نیست');
      setTimeout(() => setRecoverBtnText('تایید'), 1500);
      return;
    }
    setRecoverBtnText(<Wating />);

    const result = await ForgetPasswordApi(mobile);

    if (result.status === 200) {
      setRecover_pass_token(result.data.recoverPassToken);
      setStepOne(false);
      setRecoverBtnText('تایید');
    } else {
      setRecoverBtnText('کاربری با این شماره موبایل یافت نشد');
      setTimeout(() => setRecoverBtnText('تایید'), 1500);
    }
  };
  const recoverPasswordHandler = async (event) => {
    event.preventDefault();

    if (password.length < 4) {
      setRecoverBtnText(' طول رشته رمز ورود، کوتاه است ');
      setTimeout(() => setRecoverBtnText('تایید'), 1500);
      return;
    }
    if (password !== passwordConfirm) {
      setRecoverBtnText(' رمز عبور و تکرار آن یکسان نیست ');
      setTimeout(() => setRecoverBtnText('تایید'), 1500);
      return;
    }
    if (code.length !== 4) {
      setRecoverBtnText(' کد صحیح نیست');
      setTimeout(() => setRecoverBtnText('تایید'), 1500);
      return;
    }
    setRecoverBtnText(<Wating />);
    const result = await RecoverPasswordApi(recover_pass_token, parseInt(code), password);

    if (result.status === 200) {

      Cookies.set('transportCompanyUser', result.data.User.jwtToken, { expires: 7 });
      dispatch(
        setAuth({
          token: result.data.User.jwtToken,
          userInfo: result.data,
          isAuthenticated: true,
        }),
      );
    } else {
      setRecoverBtnText('متاسفانه عملیات به درستی انجام نشد');
      setTimeout(() => setRecoverBtnText('تایید'), 1500);
    }
  };

  React.useEffect(() => {
    dispatch(
      setMetaData({
        title: 'حمل و نقل اکسیر پویان :: بازیابی رمز ورود',
        description: 'بازیابی رمز ورود',
      }),
    );
    setTimeout(() => dispatch(setIsLoading(false)), 300);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="p-5">
        {stepOne ?
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              بازیابی رمز عبور
            </Typography>
            <Box
              component="form"
              onSubmit={sendCodeHandler}
              noValidate
              sx={{ mt: 1, width: '340px' }}
            >
              <TextField
                dir="ltr"
                margin="normal"
                required
                value={mobile}
                fullWidth
                onChange={handleChangeMobile}
                id="mobile"
                label="شماره موبایل "
                name="mobile"
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {recoverBtnText}
              </Button>
            </Box>
          </Box>
          :
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              رمز عبور جدید
            </Typography>
            <Box
              component="form"
              onSubmit={recoverPasswordHandler}
              noValidate
              sx={{ mt: 1, width: '340px' }}
            >
              <TextField
                dir="ltr"
                margin="normal"
                required
                fullWidth
                value={code}
                onChange={handleChangeCode}
                id="code"
                label="کد ارسال شده به شماره موبایل"
                name="code"
                type='number'
                autoFocus
              />
              <TextField
                dir="ltr"
                margin="normal"
                required
                fullWidth
                value={password}
                onChange={handleChangePassword}
                name="password"
                label="رمز عبور جدید"
                type="password"
                id="password"
              />
              <TextField
                dir="ltr"
                margin="normal"
                required
                fullWidth
                value={passwordConfirm}
                onChange={handleChangePasswordConfirm}
                name="passwordConfirm"
                label="تکرار رمز عبور جدید"
                type="password"
                id="passwordConfirm"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {recoverBtnText}
              </Button>
              <div className="col-12  justify-content-center mt-4">
                <span className='text-promary pointer' onClick={handleResetForm}> کد را دریافت نکردید؟ بازگشت به مرحله قبل </span>
              </div>
            </Box>
          </Box>
        }

      </div>
    </ThemeProvider>
  );
};

export default ForgetPassword;
