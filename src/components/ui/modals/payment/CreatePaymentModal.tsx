import React from 'react';

// API *************************************************
import PaymentCreateApi from '../../../api/Payment/Add';
import GetPaymentApi from '../../../api/Payment/GetOne';
import PaymentUpdateApi from '../../../api/Payment/Update';
import ClassEnrollmentListApi from '../../../api/ClassEnrollment/GetAll';
import ClassListApi from '../../../api/Class/GetAll';
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
import DatePickersInput from '../../formElement/DatePickerInput';
// MUi Icon **************************************************
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
// Formik & yup ************************************************
import { useFormik } from 'formik';
import * as Yup from 'yup';
// Helpers *****************************************************
import { georgianDate, jalaliDate } from './../../../helpers/convertDate.helper';
import { ToInt } from './../../../helpers/NumberTools';
// redux seters ************************************************

// STYLE MODAL
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '95%',
    sm: 600,
    md: 800,
  },
  height: 'auto',
  maxHeight: '90vh',
  overflowY: {
    xs: 'auto',
    sm: 'auto',
    md: 'visible',
  },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
};

const CreatePaymentModal = (props) => {
  const {
    token,
    id,
    isPoolTenant,
    openModal,
    setOpenModal,
    list
  } = props;

  // HOOKS FORM **************************************************
  const [students, setStudents] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [paymentDate, setPaymentDate] = React.useState(null);
  const [sending, setSending] = React.useState(false);
  // FORMIK *******************************************************
  const formik = useFormik({
    initialValues: {
      classId: "",
      studentId: "",
      amount: "",
      paymentMethod: "",
      paymentDate: "",
      paymentDateChanged: false,
    },
    validationSchema: Yup.object({
      classId: Yup.string()
        .required("انتخاب کلاس آموزشی الزامی است"),
      studentId: Yup.string()
        .required(`انتخاب ${isPoolTenant?'شناگر':'دانش آموز'} الزامی است`),
      amount: Yup.string()
        .required("مبلغ پرداختی شهریه الزامی است")
        .min(4, " مبلغ پرداختی باید بیشتر از ۴ رقم باشد"),
      paymentMethod: Yup.string()
        .required("انتخاب نحوه پرداخت شهریه الزامی است"),
      paymentDate: Yup.string()
        .required("انتخاب تاریخ پرداخت شهریه الزامی است"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      setSending(true);
      submitForm(values);
      resetForm();
    },
  });
  // FORMAT AMOUNT *******************************************
  const formatAmount = (value) => {
    if (!value) return "";
    const cleaned = value.toString().replace(/,/g, "");
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const unformatAmount = (value) => {
    return value.replace(/,/g, "");
  };
  // GET PAYMENT *********************************************
  const getPayment = async () => {
    if (id) {
      try {
        const payment = await GetPaymentApi(token, id);
        if (payment.status === 200) {
          formik.setValues({
            classId: payment.data.classId || "",
            studentId: payment.data.studentId || "",
            amount: payment?.data?.amount || null,
            paymentMethod: payment?.data?.paymentMethod === "کارت به کارت" ? "CARDTOCARD" : payment?.data?.amount === 'دستگاه کارتخوان' ? "POS" : "CACH",
            paymentDate: jalaliDate(payment.data.paymentDate) || null,
            paymentDateChanged: false,
          });
          setPaymentDate(payment.data.paymentDate);
          getStudents(payment.data.classId);
        } else {
          toast.ErrorNotify(payment.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading payment:", error);
        setOpenModal(false);
      }
    } else {
      formik.resetForm();
    }
  }
  // SUBMIT **************************************************
  const submitForm = async (values) => {
    const body = {
      "classId": values.classId,
      "studentId": values.studentId,
      "amount": values.amount,
      "paymentMethod": values.paymentMethod,
      "paymentDate": values.paymentDateChanged ? georgianDate(ToInt(values.paymentDate)) : paymentDate,
    }
    if (id) {
      // updated
      const values = { ...body, id }
      const updated = await PaymentUpdateApi(token, values);
      if (updated.status === 200) {
        toast.SuccessNotify('اطلاعات پرداخت با موفقیت بروزرسانی شد');
        handleCancel();
        setSending(false);
        list()
      } else {
        toast.ErrorNotify(updated.data.error);
        setSending(false);
      }
    } else {
      // created
      const created = await PaymentCreateApi(token, body);
      if (created.status === 200) {
        toast.SuccessNotify("پرداخت شهریه با موفقیت ثبت شد");
        handleCancel();
        setSending(false);
        list();
      } else {
        toast.ErrorNotify(created.data.error);
        setSending(false);
      }
    }
  }
  // GET STUDENT LIST ****************************************
  const getStudents = async (classId) => {
    try {
      const student = await ClassEnrollmentListApi(token, classId);
      if (student.status === 200) {
        setStudents(student.data);
      }
    } catch (error) {
      console.error("Error loading students:", error);
      setOpenModal(false);
    }
  }
  // GET CLASS LIST ******************************************
  const getClasses = async () => {
    try {
      const classes = await ClassListApi(token);
      if (classes.status === 200) {
        setClasses(classes.data);
      }
    } catch (error) {
      console.error("Error loading classes:", error);
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
    getPayment();
    getClasses();
  }, [id]);
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
            {`ثبت پرداخت شهریه`}
          </Typography>
        </Grid>
        <hr />
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            <Grid item xs={6} md={6} sx={{ mx: 'auto', my: 'auto' }}>
              <TextField
                fullWidth
                select
                label="انتخاب کلاس  *"
                variant="outlined"
                name="classId"
                value={formik.values.classId}
                onChange={(e) => { formik.handleChange(e), getStudents(e.target.value) }}
                onBlur={formik.handleBlur}
                error={formik.touched.classId && Boolean(formik.errors.classId)}
                helperText={formik.touched.classId && formik.errors.classId}
                size="small"
              >
                {classes && classes.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>کلاس {item?.name}</MenuItem>
                  )
                })}
              </TextField>
            </Grid>
            <Grid item xs={6} md={6} sx={{ mx: 'auto', my: 'auto' }}>
              <TextField
                fullWidth
                select
                label={isPoolTenant?'انتخاب شناگر *':'انتخاب دانش آموز *'}
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
                    <MenuItem key={item.id} value={item?.student?.id}>{isPoolTenant?'شناگر':'دانش آموز'} : {item?.student?.user?.name + ' ' + item?.student?.user?.lastName}</MenuItem>
                  )
                })}
              </TextField>
            </Grid>
            <Grid item xs={6} md={6} sx={{ mx: 'auto' }}>
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
            <Grid item xs={6} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`مبلغ پرداختی شهریه (ریال) *`}
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
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <DatePickersInput
                setSelectedDate={(date: Date) => {
                  formik.setFieldValue('paymentDate', date);
                  formik.setFieldValue("paymentDateChanged", true);
                }}
                selectedDate={formik.values.paymentDate}
                fullWidth
                label={`تاریخ پرداخت `}
              />
              {formik.touched.paymentDate && typeof formik.errors.paymentDate === 'string' && (
                <div className="text-danger mx-3 mt-1" style={{ fontSize: '11px' }}>{formik.errors.paymentDate}</div>
              )}
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
export default CreatePaymentModal;
