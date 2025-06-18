import React from 'react';

// API *************************************************
import ClassEnrollmentCreateApi from '../../../api/ClassEnrollment/Add';
import PaymentCreateApi from '../../../api/Payment/Add';
import StudentListApi from '../../../api/Student/GetAll';
import GetOneClassApi from '../../../api/Class/GetOne';
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
import Divider from '@mui/material/Divider';
// UI ********************************************************
import DatePickerInput from '../../formElement/DatePickerInput';
// MUi Icon **************************************************
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
// Formik & yup ************************************************
import { useFormik } from 'formik';
import * as Yup from 'yup';
// Helpers *****************************************************
import { georgianDate } from './../../../helpers/convertDate.helper';
import { ToInt } from './../../../helpers/NumberTools';
// redux seters ************************************************

// STYLE MODAL
const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
  mx: 'auto',
};

const CreateClassEnrollmentModal = (props) => {
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
  const [classInfo, setClassInfo] = React.useState(null);
  const [sending, setSending] = React.useState(false);
  // FORMIK *******************************************************
  const formik = useFormik({
    initialValues: {
      studentId: "",
      payment: "",
      amount: "",
      paymentMethod: "",
      paymentDate: "",
    },
    validationSchema: Yup.object({
      studentId: Yup.string()
        .required("انتخاب دانش آموز الزامی است"),
      payment: Yup.string()
        .required("تعیین وضعیت پرداخت الزامی است"),
      amount: Yup.string()
        .nullable()
        .test(
          "max-amount",
          "مبلغ وارد شده نمی‌تواند بیشتر از شهریه کلاس باشد",
          // eslint-disable-next-line func-names
          function (value) {
            if (!value || !this.parent.payment || this.parent.payment === "UNPAID") {
              return true; // Skip validation if no amount or payment is UNPAID
            }
            return value <= (classInfo?.tuitionFee || 0);
          }
        ),
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
      "paymentStatus": values.payment,
    }
    // created
    const created = await ClassEnrollmentCreateApi(token, body);
    if (created.status === 200) {
      toast.SuccessNotify("دانش آموز با موفقیت به کلاس اضافه شد");
      if (values.amount > 0) {
        const paymentBody = {
          "classId": Number(classId),
          "studentId": values.studentId,
          "amount": values.amount,
          "paymentMethod": values.paymentMethod || "POS",
          "paymentDate": georgianDate(ToInt(values.paymentDate)) ,
        }
        // create payment
        const createPayment = await PaymentCreateApi(token, paymentBody);
        if (createPayment.status === 200) {
          toast.SuccessNotify("پرداخت شهریه دانش آموز با موفقیت ثبت شد");
        }
        else {
          toast.ErrorNotify(createPayment.data.error);
        }
      }
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
  // GET CLASS INFO ******************************************
  const getClass = async () => {
    if (classId) {
      try {
        const getClass = await GetOneClassApi(token, classId);
        if (getClass.status == 200) {
          setClassInfo(getClass.data)
        }
      }
      catch (error) {
        console.error("Error loading class:", error);
        setOpenModal(false);
      }
    }
  }
  // HANDLE CLOSE ********************************************
  const handleCancel = () => {
    formik.resetForm();
    setOpenModal(false);
  };
  // FORMAT AMOUNT *******************************************
  const formatAmount = (value) => {
    if (!value) return "";
    const cleaned = value.toString().replace(/,/g, "");
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const unformatAmount = (value) => {
    return value.replace(/,/g, "");
  };
  // USE EFFECT **********************************************
  React.useEffect(() => {
    getClass();
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
            {classInfo ? ` افزودن دانش آموز به کلاس ${classInfo?.name}` : "افزودن دانش آموز به کلاس"}
          </Typography>
        </Grid>
        <hr />
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            <Grid item xs={12} md={6} sx={{ mx: 'auto', my: 'auto' }}>
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
            <Grid item xs={12} md={6} sx={{ mx: 'auto', my: 'auto' }}>
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
            {formik.values.payment == "" || formik.values.payment == "UNPAID" ?
              (<></>) : (
                <>
                  <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
                    <Divider className='text-secondary'>جزئیات پرداخت</Divider>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
                    <TextField
                      fullWidth
                      label={`شهریه کلاس (ریال) *`}
                      variant="outlined"
                      name="amount"
                      value={classInfo.tuitionFee == 0 ? "مبلغ شهریه کلاس ثبت نشده است" : formatAmount(classInfo.tuitionFee)}
                      size="small"
                      disabled={true}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
                    <TextField
                      fullWidth
                      label={`مبلغ پرداختی (ریال) *`}
                      variant="outlined"
                      name="amount"
                      value={formatAmount(formik.values.amount)}
                      onChange={(e) => {
                        const rawValue = unformatAmount(e.target.value);
                        if (/^\d*$/.test(rawValue)) {
                          formik.setFieldValue("amount", rawValue);
                        }
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.amount && Boolean(formik.errors.amount)}
                      helperText={formik.touched.amount && formik.errors.amount}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
                    <TextField
                      fullWidth
                      select
                      label="نحوه پرداخت شهریه را انتخاب کنید  *"
                      variant="outlined"
                      name="paymentMethod"
                      value={formik.values.paymentMethod}
                      onChange={(e) => { formik.handleChange(e) }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.paymentMethod && Boolean(formik.errors.paymentMethod)}
                      helperText={formik.touched.paymentMethod && formik.errors.paymentMethod}
                      size="small"
                    >
                      <MenuItem value="CACH">نقدی</MenuItem>
                      <MenuItem value="CARDTOCARD">کارت به کارت</MenuItem>
                      <MenuItem value="POS">دستگاه کارتخوان</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
                    <DatePickerInput
                      setSelectedDate={(date: Date) => { formik.setFieldValue('paymentDate', date); }}
                      selectedDate={formik.values.paymentDate}
                      fullWidth
                      label={`تاریخ پرداخت `}
                    />
                    {formik.touched.paymentDate && typeof formik.errors.paymentDate === 'string' && (
                      <div className="text-danger mx-3 mt-1" style={{ fontSize: '11px' }}>{formik.errors.paymentDate}</div>
                    )}
                  </Grid>
                </>
              )}
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
export default CreateClassEnrollmentModal;
