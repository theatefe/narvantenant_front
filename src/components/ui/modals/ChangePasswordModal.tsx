import React from 'react';

// API **************************************************
import UpdatePasswordApi from '../../api/UpdatePassword';
// TOAST *******************************************************
import * as toast from '../../ui/Toast';
// MUI **************************************************
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';

// MUi Icon **************************************************
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
// Formik & yup ************************************************
import { useFormik } from 'formik';
import * as Yup from 'yup';
// redux seters ************************************************



// STYLE MODAL
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

const ChangePasswordModal = (props) => {
  const { token, openModal, setOpenModal } = props;
  // HOOKS FORM **************************************************
  const [sending, setSending] = React.useState(false);
  // FORMIK *******************************************************
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confrimPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string()
        .required("رمز ورود فعلی را وارد کنید"),
      newPassword: Yup.string()
        .required("رمز ورود جدید را وارد کنید")
        .min(4, "رمز ورود جدید باید بیشتر از 4 رقم باشد"),
      confrimPassword: Yup.string()
        .required("تکرار رمز ورود جدید را وارد کنید")
        .oneOf([Yup.ref('newPassword'), null], 'رمز ورود جدید و تکرار آن باید یکسان باشند'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      setSending(true);
      submitForm(values);
      resetForm();
    },
  });
  // SUBMIT **************************************************
  const submitForm = async (values) => {
    const updatedPassword = await UpdatePasswordApi(token, values.oldPassword, values.newPassword);
    if (updatedPassword.status === 200) {
      toast.SuccessNotify("رمز ورود با موفقیت به روز شد");
      setSending(false);
      setOpenModal(false);
    } else {
      toast.ErrorNotify(updatedPassword.data.error);
    }
  };
  // HANDLE CLOSE *****************************************
  const handleCancel = () => {
    formik.resetForm();
    setOpenModal(false);
  };
  // USE EFFECT **********************************************
  React.useEffect(() => {
  }, []);
  // RETURN **************************************************
  return (
    <Modal
      open={openModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="col-12">
          <Grid item xs={12} md={12} className='text-center'>
            <Typography variant="h5" gutterBottom>
              ویرایش رمز ورود
            </Typography>
          </Grid>
          <hr />
          <div className="row">
            <div className="col-12">
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                  <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
                    <TextField
                      type={'password'}
                      fullWidth
                      label="رمز ورود فعلی *"
                      variant="outlined"
                      name="oldPassword"
                      value={formik.values.oldPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                      helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
                    <TextField
                      type={'password'}
                      fullWidth
                      label="رمز ورود جدید *"
                      variant="outlined"
                      name="newPassword"
                      value={formik.values.newPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                      helperText={formik.touched.newPassword && formik.errors.newPassword}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
                    <TextField
                      type={'password'}
                      fullWidth
                      label="تکرار رمز ورود جدید * "
                      variant="outlined"
                      name="confrimPassword"
                      value={formik.values.confrimPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.confrimPassword && Boolean(formik.errors.confrimPassword)}
                      helperText={formik.touched.confrimPassword && formik.errors.confrimPassword}
                      size="small"
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item xs={12} sx={{ mx: 'auto', p: 1 }}>
                    <hr />
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item xs={6}>
                    <LoadingButton
                      size="medium"
                      color="success"
                      type="submit"
                      startIcon={<SendIcon />}
                      loading={sending}
                      loadingPosition="start"
                      variant="contained"
                      disabled={sending}
                    >
                      تایید
                    </LoadingButton>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                  >
                    <Button
                      className="float-left"
                      variant="contained"
                      endIcon={<CancelIcon />}
                      color="error"
                      onClick={() => {
                        handleCancel();
                        setSending(false);
                      }}
                    >
                      انصراف
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};
export default ChangePasswordModal;
