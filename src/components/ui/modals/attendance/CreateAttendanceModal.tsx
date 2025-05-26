import React from 'react';

// API *************************************************
import ClassEnrollmentCreateApi from '../../../api/ClassEnrollment/Add';
import StudentListApi from '../../../api/Student/GetAll';
// TOAST ************************************************
import * as toast from '../../../ui/Toast';
// MUI **************************************************
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
// UI ********************************************************
// MUi Icon **************************************************
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
// Formik & yup ************************************************
import { useFormik } from 'formik';
import * as Yup from 'yup';
// Helpers *****************************************************
// redux seters ************************************************

// STYLE MODAL
const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
};

const CreateAttendanceModal = (props) => {
  const {
    token,
    classId,
    id,
    openModal,
    setOpenModal,
    list
  } = props;

  // HOOKS FORM **************************************************
  const [students, setStudents] = React.useState([]);
  const [sending, setSending] = React.useState(false);
  // FORMIK *******************************************************
  const formik = useFormik({
    initialValues: {
      studentId: "",
      payment: "",
    },
    validationSchema: Yup.object({
      studentId: Yup.string()
        .required("انتخاب دانش آموز الزامی است"),
      payment: Yup.string()
        .required("تعیین وضعیت پرداخت الزامی است"),
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
    const body = {
      "classId": Number(classId),
      "studentId": values.studentId,
      "payment": values.payment,
    }
    // created
    const created = await ClassEnrollmentCreateApi(token, body);
    if (created.status === 200) {
      toast.SuccessNotify("دانش آموز با موفقیت به کلاس اضافه شد");
      handleCancel();
      setSending(false);
      list();
    } else {
      toast.ErrorNotify(created.data.error);
      setSending(false);
    }
  }
  // GET STUDENT LIST ******************************************
  const getStudents = async () => {
    try {
      const student = await StudentListApi(token);
      if (student.status === 200) {
        setStudents(student.data);
      }
    } catch (error) {
      console.error("Error loading students:", error);
      setOpenModal(false);
    }
  }
  // HANDLE CLOSE ********************************************
  const handleCancel = () => {
    formik.resetForm();
    setOpenModal(false);
  };
  // USE EFFECT **********************************************
  React.useEffect(() => {
    getStudents();
  }, []);
  // RETURN **************************************************
  return (
    <Modal
      open={openModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={12} alignItems="center">
          <Typography variant="h5" gutterBottom>
            {` افزودن دانش آموز به کلاس`}
          </Typography>
        </Grid>
        <hr />
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            <Grid item xs={12} md={12} sx={{ mx: 'auto', my: 'auto' }}>
              <TextField
                fullWidth
                select
                label="انتخاب دانش‌آموز *"
                variant="outlined"
                name="studentId"
                value={formik.values.studentId}
                onChange={(e) => { formik.handleChange(e) }}
                onBlur={formik.handleBlur}
                error={formik.touched.studentId && Boolean(formik.errors.studentId)}
                helperText={formik.touched.studentId && formik.errors.studentId}
                size="small"
              >
                {students && students.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>دانش آموز : {item?.user?.name + ' ' + item?.user?.lastName}</MenuItem>
                  )
                })}
              </TextField>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto', my: 'auto' }}>
              <TextField
                fullWidth
                select
                label="وضعیت پرداخت  *"
                variant="outlined"
                name="payment"
                value={formik.values.payment}
                onChange={(e) => { formik.handleChange(e) }}
                onBlur={formik.handleBlur}
                error={formik.touched.payment && Boolean(formik.errors.payment)}
                helperText={formik.touched.payment && formik.errors.payment}
                size="small"
              >
                <MenuItem value="PAID">پرداخت شده</MenuItem>
                <MenuItem value="UNPAID">پرداخت نشده</MenuItem>
                <MenuItem value="HALFPAID">پرداخت تکمیل نشده</MenuItem>
              </TextField>
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
      </Box>
    </Modal >
  );
};
export default CreateAttendanceModal;
