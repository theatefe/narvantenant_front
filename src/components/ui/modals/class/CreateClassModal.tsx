import React from 'react';

// API *************************************************
import ClassUpdateApi from '../../../api/Class/Update';
import ClassCreateApi from '../../../api/Class/Add';
import GetClassApi from '../../../api/Class/GetOne';
import GetAllCourseLevelCatApi from '../../../api/CourseLevelCat/GetAll';
import GetAllCoachApi from '../../../api/Coach/GetAll';
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
import DatePickersInputWithTime from '../../formElement/DatePickerInputWithTime';
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
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
};

const CreateClassModal = (props) => {
  const { token, id, openModal, setOpenModal, list } = props;
  // HOOKS FORM **************************************************
  const [courseLevelCats, setCourseLevelCats] = React.useState([]);
  const [courseLevels, setCourseLevels] = React.useState([]);
  const [coaches, setCoaches] = React.useState([]);
  const [startDate, setStartDate] = React.useState(null);
  const [sending, setSending] = React.useState(false);
  // FORMIK *******************************************************
  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      coachId: "",
      courseLevelCategoryId: "",
      courseLevelId: "",
      gender: "",
      days: "",
      startTime: "",
      endTime: "",
      totalSessions: "",
      tuitionFee: "",
      startDate: "",
    },
    validationSchema: Yup.object({
      courseLevelCategoryId: Yup.string()
        .required("انتخاب دسته بندی مقطع آموزشی الزامی است"),
      courseLevelId: Yup.string()
        .required("انتخاب مقطع آموزشی الزامی است"),
      name: Yup.string()
        .required("نام کلاس الزامی است")
        .min(3, " نام کلاس باید بیشتر از  ۳ کاراکتر باشد"),
      code: Yup.string()
        .required("کد کلاس الزامی است")
        .min(3, "کد کلاس باید حداقل ۳ کاراکتر باشد"),
      gender: Yup.string()
        .required("انتخاب جنسیت کلاس الزامی است")
        .min(1, "جنسیت کلاس انتخاب نشده است"),
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
      "courseLevelId": values.courseLevelId,
      "name": values.name,
      "code": values.code,
      "coachId": values.coachId || 0,
      "gender": values.gender,
      "days": values.days,
      "startTime": values.startTime,
      "endTime": values.endTime,
      "totalSessions": Number(values.totalSessions) || 0,
      "tuitionFee": values.tuitionFee || 0,
      "startDate": startDate ? georgianDate(ToInt(startDate)) : null,
    }
    if (id) {
      //updated
      const updated = await ClassUpdateApi(token, { ...body, id });
      if (updated.status === 200) {
        toast.SuccessNotify('اطلاعات کلاس با موفقیت بروزرسانی شد');
        handleCancel();
        setSending(false);
        list()
      } else {
        toast.ErrorNotify(updated.data.error);
        setSending(false);
      }
    } else {
      // created
      const created = await ClassCreateApi(token, body);
      if (created.status === 200) {
        toast.SuccessNotify("ثبت کلاس آموزشی با موفقیت انجام شد");
        handleCancel();
        setSending(false);
        list();
      } else {
        toast.ErrorNotify(created.data.error);
        setSending(false);
      }
    }
  };
  // GET CLASS ***********************************************
  const getClass = async () => {
    if (id) {
      try {
        const classInfo = await GetClassApi(token, id);
        if (classInfo.status === 200) {
          formik.setValues({
            name: classInfo.data.name || "",
            code: classInfo.data.code || "",
            coachId: classInfo.data.coachId || "",
            courseLevelCategoryId: classInfo.data.courseLevel.categoryId,
            courseLevelId: classInfo.data.courseLevelId || "",
            gender: classInfo.data.gender == "دختر" ? "FEMALE" : "MALE",
            days: classInfo.data.days || "",
            startTime: classInfo.data.startTime || "",
            endTime: classInfo.data.endTime || "",
            totalSessions: classInfo.data.totalSessions || "",
            tuitionFee: classInfo.data.tuitionFee || "",
            startDate: jalaliDate(classInfo.data.startDate) || null,
          });
          handleSelectCourseLevels(classInfo.data.courseLevel.categoryId);
        } else {
          toast.ErrorNotify(classInfo.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading classInfo:", error);
        setOpenModal(false);
      }
    } else {
      formik.resetForm();
    }
  }
  // GET COUSRSELEVELCATS **************************************
  const getCourseLevels = async () => {
    try {
      const classes = await GetAllCourseLevelCatApi(token);
      if (classes.status === 200) {
        setCourseLevelCats(classes.data);
      }
    } catch (error) {
      console.error("Error loading courseLevels:", error);
      setOpenModal(false);
    }
  }
  // GET COURSELEVELS ****************************************
  const handleSelectCourseLevels = (id) => {
    const selectedCategory = courseLevelCats.find((cat) => cat.id === Number(id));
    setCourseLevels(selectedCategory?.CourseLevels || []);
    formik.setFieldValue("courseLevelId", "");
  }
  // GET COACH LIST ******************************************
  const getCoaches = async () => {
    try {
      const coaches = await GetAllCoachApi(token);
      if (coaches.status === 200) {
        setCoaches(coaches.data);
      }
    } catch (error) {
      console.error("Error loading courseLevels:", error);
      setOpenModal(false);
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
    getCourseLevels();
    getCoaches();
    getClass();
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
            {id ? `ویرایش اطلاعات کلاس :  ${formik.values.name}` : ` ثبت کلاس آموزشی جدید`}
          </Typography>
        </Grid>
        <hr />
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`نام  *`}
                variant="outlined"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`کد  *`}
                variant="outlined"
                name="code"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                select
                label="جنسیت کلاس  *"
                variant="outlined"
                name="gender"
                value={formik.values.gender}
                onChange={(e) => { formik.handleChange(e) }}
                onBlur={formik.handleBlur}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
                helperText={formik.touched.gender && formik.errors.gender}
                size="small"
              >
                <MenuItem value="FEMALE">بانوان</MenuItem>
                <MenuItem value="MALE">آقایان</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                select
                label="مربی کلاس  *"
                variant="outlined"
                name="coachId"
                value={formik.values.coachId}
                onChange={(e) => { formik.handleChange(e) }}
                onBlur={formik.handleBlur}
                error={formik.touched.coachId && Boolean(formik.errors.coachId)}
                helperText={formik.touched.coachId && formik.errors.coachId}
                size="small"
              >
                {coaches && coaches.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}>مربی {item?.user?.name + ' ' + item?.user?.lastName}</MenuItem>
                  )
                })}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                select
                label="دسته بندی مقطع آموزشی *"
                variant="outlined"
                name="courseLevelCategoryId"
                value={formik.values.courseLevelCategoryId}
                onChange={(e) => {
                  formik.setFieldValue("courseLevelCategoryId", e.target.value);
                  handleSelectCourseLevels(e.target.value);
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.courseLevelCategoryId && Boolean(formik.errors.courseLevelCategoryId)}
                helperText={formik.touched.courseLevelCategoryId && formik.errors.courseLevelCategoryId}
                size="small"
              >
                {
                  courseLevelCats && courseLevelCats.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                    )
                  })
                }
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                select
                label=" مقطع آموزشی *"
                variant="outlined"
                name="courseLevelId"
                value={formik.values.courseLevelId}
                onChange={(e) => { formik.handleChange(e) }}
                onBlur={formik.handleBlur}
                error={formik.touched.courseLevelId && Boolean(formik.errors.courseLevelId)}
                helperText={formik.touched.courseLevelId && formik.errors.courseLevelId}
                size="small"
                disabled={!courseLevels || courseLevels.length === 0}
              >
                {
                  courseLevels && courseLevels.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                    )
                  })
                }
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`روزهای تشکیل کلاس *`}
                variant="outlined"
                name="days"
                value={formik.values.days}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.days && Boolean(formik.errors.days)}
                helperText={formik.touched.days && formik.errors.days}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`ساعت شروع کلاس *`}
                variant="outlined"
                name="startTime"
                value={formik.values.startTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                helperText={formik.touched.startTime && formik.errors.startTime}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`ساعت پایان کلاس *`}
                variant="outlined"
                name="endTime"
                value={formik.values.endTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                helperText={formik.touched.endTime && formik.errors.endTime}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`تعداد جلسات کلاس *`}
                variant="outlined"
                name="totalSessions"
                value={formik.values.totalSessions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.totalSessions && Boolean(formik.errors.totalSessions)}
                helperText={formik.touched.totalSessions && formik.errors.totalSessions}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`مبلغ شهریه (ریال) *`}
                variant="outlined"
                name="tuitionFee"
                value={formatAmount(formik.values.tuitionFee)}
                onChange={(e)=>{
                  const rawValue = unformatAmount(e.target.value);
                  if (/^\d*$/.test(rawValue)) {
                    formik.setFieldValue("tuitionFee", rawValue);
                  }
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.tuitionFee && Boolean(formik.errors.tuitionFee)}
                helperText={formik.touched.tuitionFee && formik.errors.tuitionFee}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <DatePickersInputWithTime
                setSelectedDate={(date: Date) => { formik.setFieldValue('startDate', date); setStartDate(date); }}
                selectedDate={formik.values.startDate}
                fullWidth
                label={`تاریخ شروع کلاس `}
              />
              {formik.touched.startDate && typeof formik.errors.startDate === 'string' && (
                <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.startDate}</div>
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
export default CreateClassModal;
