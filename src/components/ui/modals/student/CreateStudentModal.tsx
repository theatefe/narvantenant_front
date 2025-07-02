import React from 'react';

// API *************************************************
import StudentUpdateApi from '../../../api/Student/Update';
import StudentCreateApi from '../../../api/Student/Add';
import GetStudentApi from '../../../api/Student/GetOne';
import GetAllLevelCatsApi from '../../../api/CourseLevelCat/GetAll';
import UploadFileApi from '../../../api/Common/UploadFile';
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import { styled } from '@mui/material/styles';
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
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const style = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
};

const CreateStudentModal = (props) => {
  const {
 token, isPoolTenant, id, openModal, setOpenModal, list 
} = props;
  // HOOKS FORM **************************************************
  const [levelCats, setLevelCats] = React.useState([]);
  const [levels, setLevels] = React.useState([]);
  const [nationalCard, setNationalCard] = React.useState(null);
  const [sportsInsuranceCard, setSportsInsuranceDard] = React.useState(null);
  const [birthDate, setBirthDate] = React.useState(null);
  const [sending, setSending] = React.useState(false);
  // GET COURSELEVELS CAT ****************************************
  const getLevelCats = async () => {
    const levelCats = await GetAllLevelCatsApi(token);
    if (levelCats.status == 200) {
      setLevelCats(levelCats.data);
    }
  }
  // GET LEVEL LIST ***********************************************
  const handleSetLevelList = (categoryId) => {
    const catId = categoryId;
    const levelCat = levelCats.find((cat) => cat.id == catId);
    setLevels(levelCat.CourseLevels);
  }
  // FORMIK *******************************************************
  const formik = useFormik({
    initialValues: {
      name: "",
      lastName: "",
      gender: "",
      nationalCode: "",
      dateOfBirth: null,
      mobile: "",
      address: "",
      levelCatId: "",
      levelId: "",
      fatherName: "",
      motherName: "",
      fatherJob: "",
      motherJob: "",
      fatherPhone: "",
      motherPhone: "",
      fatherEducation: "",
      motherEducation: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("نام الزامی است")
        .min(3, "نام باید حداقل ۳ کاراکتر باشد"),
      lastName: Yup.string()
        .required("نام خانوادگی الزامی است")
        .min(3, "نام خانوادگی باید حداقل ۳ کاراکتر باشد"),
      gender: Yup.string()
        .required("انتخاب جنسیت الزامی است")
        .min(1, "جنسیت انتخاب نشده است"),
      nationalCode: Yup.string()
        .required("کدملی الزامی است")
        .min(3, "کد ملی باید حداقل ۳ کاراکتر باشد"),
      mobile: Yup.string()
        .required("شماره همراه الزامی است")
        .min(3, "شماره همراه به درستی وارد نشده است"),
      levelCatId: Yup.string()
        .required("انتخاب دسته بندی سطح آموزشی الزامی است")
        .min(1, "دسته بندی سطح آموزشی انتخاب نشده است"),
      levelId: Yup.string()
        .required("انتخاب سطح الزامی است")
        .min(1, "سطح آموزشی انتخاب نشده است"),
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
      "user": {
        "name": values.name,
        "lastName": values.lastName,
        "gender": values.gender,
        "nationalCode": values.nationalCode,
        "dateOfBirth": birthDate ? georgianDate(ToInt(birthDate)) : null,
        "mobile": values.mobile,
        "address": values.address,
      },
      "levelId": values.levelId,
      "fatherName": values.fatherName,
      "motherName": values.motherName,
      "fatherJob": values.fatherJob,
      "motherJob": values.motherJob,
      "fatherPhone": values.fatherPhone,
      "motherPhone": values.motherPhone,
      "fatherEducation": values.fatherEducation,
      "motherEducation": values.motherEducation,
      "birthCertificateImageId": nationalCard ? nationalCard.id : null,
      "sportsInsuranceImageId": sportsInsuranceCard ? sportsInsuranceCard.id : null,
    }
    if (id) {
      //updated
      const updated = await StudentUpdateApi(token, { ...body, id });
      if (updated.status === 200) {
        toast.SuccessNotify('اطلاعات با موفقیت بروزرسانی شد');
        handleCancel();
        setSending(false);
        list()
      } else {
        toast.ErrorNotify(updated.data.error);
        setSending(false);
      }
    } else {
      // created
      const created = await StudentCreateApi(token, body);
      if (created.status === 200) {
        toast.SuccessNotify("ثبت نام با موفقیت انجام شد");
        handleCancel();
        setSending(false);
        list();
      } else {
        toast.ErrorNotify(created.data.error);
        setSending(false);
      }
    }
  };
  // GET STUDENT ***********************************************
  const getStudent = async () => {
    if (id) {
      try {
        const student = await GetStudentApi(token, id);
        if (student.status === 200) {
          formik.setValues({
            name: student.data.user.name || "",
            lastName: student.data.user.lastName || "",
            gender: student.data.user.gender || "",
            nationalCode: student.data.user.nationalCode || "",
            dateOfBirth: jalaliDate(student.data.user.dateOfBirth) || null,
            mobile: student.data.user.mobile || "",
            address: student.data.user.address || "",
            levelCatId: student.data.level.categoryId || null,
            levelId: student.data.levelId || null,
            fatherName: student.data.fatherName || null,
            motherName: student.data.motherName || null,
            fatherJob: student.data.fatherJob || null,
            motherJob: student.data.motherJob || null,
            fatherPhone: student.data.fatherPhone || null,
            motherPhone: student.data.motherPhone || null,
            fatherEducation: student.data.fatherEducation || null,
            motherEducation: student.data.motherEducation || null,
          });
          setNationalCard(student.data.birthCertificateImage);
          setSportsInsuranceDard(student.data.sportsInsuranceImage);
          handleSetLevelList(student.data.level.categoryId);
        } else {
          toast.ErrorNotify(student.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading student:", error);
        setOpenModal(false);
      }
    } else {
      formik.resetForm();
    }
  }
  // HANDLE FILE CHANGE ***************************************
  const handleFileChange = async (label: string, event) => {
    const formData = {
      file: event.target.files[0],
      dist: event.target.files[0].name,
    }
    const fileUploaded = await UploadFileApi(token, formData);
    if (fileUploaded && fileUploaded.data) {
      if (label === 'nationalCard') {
        setNationalCard(fileUploaded.data);
      }
      if (label === 'sportsInsuranceCard') {
        setSportsInsuranceDard(fileUploaded.data);
      }
    }
  };
  // HANDLE CLOSE *****************************************
  const handleCancel = () => {
    formik.resetForm();
    setNationalCard(null);
    setSportsInsuranceDard(null);
    setOpenModal(false);
  };
  // USE EFFECT **********************************************
  React.useEffect(() => {
    getStudent();
    getLevelCats();
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
            {id ? `ویرایش اطلاعات ${isPoolTenant? 'شناگر':'دانش آموز'} :  ${formik.values.name + ' ' + formik.values.lastName}` : ` ثبت نام ${isPoolTenant?'شناگر' : 'دانش آموز'} جدید`}
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
                label={`نام خانوادگی  *`}
                variant="outlined"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`کدملی *`}
                variant="outlined"
                name="nationalCode"
                value={formik.values.nationalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nationalCode && Boolean(formik.errors.nationalCode)}
                helperText={formik.touched.nationalCode && formik.errors.nationalCode}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <DatePickersInputWithTime
                setSelectedDate={(date: Date) => { formik.setFieldValue('dateOfBirth', date); setBirthDate(date); }}
                selectedDate={formik.values.dateOfBirth}
                fullWidth
                label={`تاریخ تولد `}
              />
              {formik.touched.dateOfBirth && typeof formik.errors.dateOfBirth === 'string' && (
                <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.dateOfBirth}</div>
              )}
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`شماره تلفن همراه *`}
                variant="outlined"
                name="mobile"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                helperText={formik.touched.mobile && formik.errors.mobile}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                select
                label="جنسیت  *"
                variant="outlined"
                name="gender"
                value={formik.values.gender}
                onChange={(e) => { formik.handleChange(e) }}
                onBlur={formik.handleBlur}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
                helperText={formik.touched.gender && formik.errors.gender}
                size="small"
              >
                <MenuItem value="FEMALE">دختر</MenuItem>
                <MenuItem value="MALE">پسر</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                select
                label=" دسته بندی سطح آموزشی*"
                variant="outlined"
                name="levelCatId"
                value={formik.values.levelCatId}
                onChange={(e) => { formik.handleChange(e), handleSetLevelList(e.target.value) }}
                onBlur={formik.handleBlur}
                error={formik.touched.levelCatId && Boolean(formik.errors.levelCatId)}
                helperText={formik.touched.levelCatId && formik.errors.levelCatId}
                size="small"
              >
                {levelCats && levelCats.length > 0 ? levelCats.map((cat) => {
                  return (
                    <MenuItem value={cat.id} key={cat.id}>{cat.title}</MenuItem>
                  )
                }) : (<MenuItem value={null}>دسته بندی برای نمایش وجود ندارد</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                select
                label="تعیین سطح  *"
                variant="outlined"
                name="levelId"
                value={formik.values.levelId}
                onChange={(e) => { formik.handleChange(e) }}
                onBlur={formik.handleBlur}
                error={formik.touched.levelId && Boolean(formik.errors.levelId)}
                helperText={formik.touched.levelId && formik.errors.levelId}
                size="small"
                disabled={!formik.values.levelCatId ? true : false}
              >
                {levels && levels.length > 0 ? levels.map((level) => {
                  return (
                    <MenuItem value={level.id} key={level.id}>{level.title}</MenuItem>
                  )
                }) : (<MenuItem value={null}>سطحی برای نمایش وجود ندارد</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`نام پدر `}
                variant="outlined"
                name="fatherName"
                value={formik.values.fatherName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.fatherName && Boolean(formik.errors.fatherName)}
                helperText={formik.touched.fatherName && formik.errors.fatherName}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`نام مادر `}
                variant="outlined"
                name="motherName"
                value={formik.values.motherName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.motherName && Boolean(formik.errors.motherName)}
                helperText={formik.touched.motherName && formik.errors.motherName}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`شغل پدر `}
                variant="outlined"
                name="fatherJob"
                value={formik.values.fatherJob}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.fatherJob && Boolean(formik.errors.fatherJob)}
                helperText={formik.touched.fatherJob && formik.errors.fatherJob}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`شغل مادر `}
                variant="outlined"
                name="motherJob"
                value={formik.values.motherJob}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.motherJob && Boolean(formik.errors.motherJob)}
                helperText={formik.touched.motherJob && formik.errors.motherJob}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`تلفن تماس پدر `}
                variant="outlined"
                name="fatherPhone"
                value={formik.values.fatherPhone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.fatherPhone && Boolean(formik.errors.fatherPhone)}
                helperText={formik.touched.fatherPhone && formik.errors.fatherPhone}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`تلفن تماس مادر `}
                variant="outlined"
                name="motherPhone"
                value={formik.values.motherPhone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.motherPhone && Boolean(formik.errors.motherPhone)}
                helperText={formik.touched.motherPhone && formik.errors.motherPhone}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`تحصیلات پدر `}
                variant="outlined"
                name="fatherEducation"
                value={formik.values.fatherEducation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.fatherEducation && Boolean(formik.errors.fatherEducation)}
                helperText={formik.touched.fatherEducation && formik.errors.fatherEducation}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`تحصیلات مادر `}
                variant="outlined"
                name="motherEducation"
                value={formik.values.motherEducation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.motherEducation && Boolean(formik.errors.motherEducation)}
                helperText={formik.touched.motherEducation && formik.errors.motherEducation}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`آدرس `}
                variant="outlined"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={nationalCard !== null ? <CloudDoneIcon /> : <CloudUploadIcon />}
                color={nationalCard !== null ? 'success' : 'primary'}
                fullWidth
              >
                آپلود تصویر شناسنامه یا کارت ملی {nationalCard && ` :: ` + nationalCard.mediaUrl.split('/files/')[1]}
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => handleFileChange("nationalCard", e)}
                />
              </Button>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={sportsInsuranceCard !== null ? <CloudDoneIcon /> : <CloudUploadIcon />}
                color={sportsInsuranceCard !== null ? 'success' : 'primary'}
                fullWidth
              >
                آپلود تصویر کارت بیمه ورزشی {sportsInsuranceCard && ` :: ` + sportsInsuranceCard.mediaUrl.split('/files/')[1]}
                <VisuallyHiddenInput
                  type="file"
                  onChange={(e) => handleFileChange("sportsInsuranceCard", e)}
                />
              </Button>
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
export default CreateStudentModal;
