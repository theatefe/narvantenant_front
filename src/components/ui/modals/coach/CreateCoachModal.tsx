import React from 'react';

// API *************************************************
import GetRoleListApi from '../../../api/Role/GetAll';
import CoachUpdateApi from '../../../api/Coach/Update';
import CoachCreateApi from '../../../api/Coach/Add';
import GetCoachApi from '../../../api/Coach/GetOne';
import UploadFileApi from '../../../api/Common/UploadFile';
// TOAST ************************************************
import * as toast from '../../../ui/Toast';
// MUI **************************************************
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Autocomplete from "@mui/material/Autocomplete";
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import { styled } from '@mui/material/styles';
// UI ********************************************************
import DatePickersInputWithTime from '../../formElement/DatePickerInputWithTime';
// MUi Icon **************************************************
import DeleteIcon from '@mui/icons-material/Delete';
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
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '90%',
    sm: '70%',
    md: 900,
  },
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
};

const CreateCoachModal = (props) => {
  const { token, id, openModal, setOpenModal, list } = props;
  // HOOKS FORM **************************************************
  const [coachingCard, setCoachingCard] = React.useState(null);
  const [nationalCard, setNationalCard] = React.useState(null);
  const [sportsInsuranceCard, setSportsInsuranceDard] = React.useState(null);
  const [lastRetrainingCard, setLastRetrainingCard] = React.useState(null);
  const [birthDate, setBirthDate] = React.useState(null);
  const [toDate, setTodDate] = React.useState(null);
  const [roleList, setRoleList] = React.useState([]);
  const [sending, setSending] = React.useState(false);
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
      coachingCardIssueDate: "",
      roleId: null,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("نام مربی الزامی است")
        .min(3, "نام مربی باید حداقل ۳ کاراکتر باشد"),
      lastName: Yup.string()
        .required("نام خانوادگی مربی الزامی است")
        .min(3, "نام خانوادگی مربی باید حداقل ۳ کاراکتر باشد"),
      gender: Yup.string()
        .required("انتخاب جنسیت مربی الزامی است")
        .min(1, "جنسیت مربی انتخاب نشده است"),
      nationalCode: Yup.string()
        .required("کدملی مربی الزامی است")
        .min(3, "کد ملی مربی باید حداقل ۳ کاراکتر باشد"),
      mobile: Yup.string()
        .required("شماره همراه مربی الزامی است")
        .min(3, "شماره همراه مربی به درستی وارد نشده است"),
      roleId: Yup.mixed()
        .required("نقش کاربر الزامی است")
        .test("is-valid-role", "نقش کاربر نامعتبر است", (value) => value !== null),
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
        "roleId": values.roleId,
        "name": values.name,
        "lastName": values.lastName,
        "gender": values.gender,
        "nationalCode": values.nationalCode,
        "dateOfBirth": birthDate ? georgianDate(ToInt(birthDate)) : null,
        "mobile": values.mobile,
        "address": values.address,
      },
      "coachingCardIssueDate": toDate ? georgianDate(ToInt(toDate)) : null,
      "coachingCardImageId": coachingCard ? coachingCard.id : null,
      "nationalCardImageId": nationalCard ? nationalCard.id : null,
      "sportsInsuranceImageId": sportsInsuranceCard ? sportsInsuranceCard.id : null,
      "lastRetrainingCardImageId": lastRetrainingCard ? lastRetrainingCard.id : null,
    }
    if (id) {
      //updated
      const updated = await CoachUpdateApi(token, { ...body, id });
      if (updated.status === 200) {
        toast.SuccessNotify('اطلاعات مربی با موفقیت بروزرسانی شد');
        handleCancel();
        setSending(false);
        list()
      } else {
        toast.ErrorNotify(updated.data.error);
        handleCancel();
        setSending(false);
      }
    } else {
      // created
      const created = await CoachCreateApi(token, body);
      if (created.status === 200) {
        toast.SuccessNotify("ثبت نام مربی با موفقیت انجام شد");
        handleCancel();
        setSending(false);
        list();
      } else {
        toast.ErrorNotify(created.data.error);
        handleCancel();
        setSending(false);
      }
    }
  };
  // GET COACH ***********************************************
  const getCoach = async () => {
    if (id) {
      try {
        const coach = await GetCoachApi(token, id);
        if (coach.status === 200) {
          formik.setValues({
            roleId: coach.data.user.roleId,
            name: coach.data.user.name || "",
            lastName: coach.data.user.lastName || "",
            gender: coach.data.user.gender || "",
            nationalCode: coach.data.user.nationalCode || "",
            dateOfBirth: jalaliDate(coach.data.user.dateOfBirth) || null,
            coachingCardIssueDate: jalaliDate(coach.data.coachingCardIssueDate) || null,
            mobile: coach.data.user.mobile || "",
            address: coach.data.user.address || "",
          });
          setCoachingCard(coach.data.coachingCardImage);
          setNationalCard(coach.data.nationalCardImage);
          setSportsInsuranceDard(coach.data.sportsInsuranceImage);
          setLastRetrainingCard(coach.data.lastRetrainingCardImag);
        } else {
          toast.ErrorNotify(coach.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading coach:", error);
        setOpenModal(false);
      }
    } else {
      formik.resetForm();
    }
  }
  // GET ROLE LIST *******************************************
  const getRoleList = async () => {
    const result = await GetRoleListApi(token);
    if (result.status === 200) {
      const roles = result.data && result.data.filter((item) => item.isActive).map((item) => ({
        value: item.id, label: item.name
      }));
      setRoleList(roles);
    }
  }
  // HANDLE FILE CHANGE ***************************************
  const handleFileChange = async (label: string, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.ErrorNotify("فقط آپلود تصویر مجاز است");
      return;
    }

    const formData = {
      file: event.target.files[0],
      dist: event.target.files[0].name,
    }
    const fileUploaded = await UploadFileApi(token, formData);
    if (fileUploaded && fileUploaded.data) {
      if (label === 'coachingCard') {
        setCoachingCard(fileUploaded.data);
      }
      if (label === 'nationalCard') {
        setNationalCard(fileUploaded.data);
      }
      if (label === 'sportsInsuranceCard') {
        setSportsInsuranceDard(fileUploaded.data);
      }
      if (label === 'lastRetrainingCard') {
        setLastRetrainingCard(fileUploaded.data);
      }
    }
  };
  // HANDLE REMOVE FILE ***********************************
  const handleRemoveImage = (type: string) => {
    switch (type) {
      case 'coachingCard':
        setCoachingCard(null);
        break;
      case 'nationalCard':
        setNationalCard(null);
        break;
      case 'sportsInsuranceCard':
        setSportsInsuranceDard(null);
        break;
      case 'lastRetrainingCard':
        setLastRetrainingCard(null);
        break;
      default:
        console.warn(`Unknown type: ${type}`);
    }
  };
  // HANDLE CLOSE *****************************************
  const handleCancel = () => {
    formik.resetForm();
    setCoachingCard(null);
    setNationalCard(null);
    setSportsInsuranceDard(null);
    setLastRetrainingCard(null);
    setOpenModal(false);
  };
  // USE EFFECT **********************************************
  React.useEffect(() => {
    getCoach();
    getRoleList();
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
            {id ? `ویرایش اطلاعات مربی :  ${formik.values.name + ' ' + formik.values.lastName}` : ` ثبت نام مربی جدید`}
          </Typography>
        </Grid>
        <hr />
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            <Grid item xs={4} md={6} sx={{ mx: 'auto' }}>
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
            <Grid item xs={4} md={6} sx={{ mx: 'auto' }}>
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
            <Grid item xs={4} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`کدملی *`}
                variant="outlined"
                name="nationalCode"
                value={formik.values.nationalCode}
                onChange={(e) => {
                  const val = e.currentTarget.value;
                  // just numbers and length 10
                  if (/^\d{0,10}$/.test(val)) {
                    formik.setFieldValue('nationalCode', val);
                  }
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.nationalCode && Boolean(formik.errors.nationalCode)}
                helperText={formik.touched.nationalCode && formik.errors.nationalCode}
                size="small"
              />
            </Grid>
            <Grid item xs={4} md={6} sx={{ mx: 'auto' }}>
              <Autocomplete
                disablePortal
                fullWidth
                options={roleList}
                size="small"
                value={roleList.find((option) => option.value === formik.values.roleId) || null}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={(event, item) => {
                  formik.setFieldValue("roleId", item ? item.value : "");
                }}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    id="roleId"
                    name="roleId"
                    type="text"
                    {...params}
                    size="small"
                    label="نقش کاربر *"
                    error={formik.touched.roleId && Boolean(formik.errors.roleId)}
                    helperText={formik.touched.roleId && typeof formik.errors.roleId === 'string' ? formik.errors.roleId : undefined}
                  />
                )}
              />
            </Grid>
            <Grid item xs={4} md={6} sx={{ mx: 'auto' }}>
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
            <Grid item xs={4} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`شماره تلفن همراه *`}
                variant="outlined"
                name="mobile"
                value={formik.values.mobile}
                onChange={(e) => {
                  const val = e.currentTarget.value;
                  // just numbers and length 11
                  if (/^\d{0,11}$/.test(val)) {
                    formik.setFieldValue('mobile', val);
                  }
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                helperText={formik.touched.mobile && formik.errors.mobile}
                size="small"
              />
            </Grid>
            <Grid item xs={4} md={6} sx={{ mx: 'auto' }}>
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
                <MenuItem value="FEMALE">زن</MenuItem>
                <MenuItem value="MALE">مرد</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={4} md={6} sx={{ mx: 'auto' }}>
              <DatePickersInputWithTime
                setSelectedDate={(date: Date) => { formik.setFieldValue('coachingCardIssueDate', date); setTodDate(date); }}
                selectedDate={formik.values.coachingCardIssueDate}
                fullWidth
                label={`تاریخ صدور کارت مربیگری `}
              />
              {formik.touched.coachingCardIssueDate && typeof formik.errors.coachingCardIssueDate === 'string' && (
                <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.coachingCardIssueDate}</div>
              )}
            </Grid>
            <Grid item xs={4} md={12} sx={{ mx: 'auto' }}>
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
            {/* کارت ملی */}
            <Grid item xs={3} md={3} sx={{ mx: 'auto' }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={nationalCard ? <CloudDoneIcon /> : <CloudUploadIcon />}
                color={nationalCard ? 'success' : 'primary'}
                fullWidth
                sx={{ mb: 1 }}
              >
                آپلود تصویر کارت ملی
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("nationalCard", e)}
                />
              </Button>

              {nationalCard && (
                <Box
                  sx={{
                    width: { xs: '90%', sm: 130, md: 200 },
                    height: { xs: 'auto', sm: 100, md: 200 },
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    p: 1,
                    mt: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: { xs: 180, sm: 200, md: 200 },
                      overflow: 'hidden',
                      borderRadius: 1,
                    }}
                  >
                    <img
                      src={nationalCard.preview || nationalCard.mediaUrl}
                      alt="کارت ملی"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 4,
                        display: 'block',
                      }}
                    />
                    <IconButton
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(255,255,255,0.7)'
                      }}
                      onClick={() => handleRemoveImage("nationalCard")}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="caption"
                    sx={{
                      mt: 1,
                      textAlign: 'center',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {nationalCard.name || nationalCard.mediaUrl.split('/files/')[1]}
                  </Typography>
                </Box>
              )}
            </Grid>
            {/* کارت مربیگری */}
            <Grid item xs={3} md={3} sx={{ mx: 'auto' }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={coachingCard ? <CloudDoneIcon /> : <CloudUploadIcon />}
                color={coachingCard ? 'success' : 'primary'}
                fullWidth
                sx={{ mb: 1 }}
              >
                آپلود تصویر کارت مربیگری
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("coachingCard", e)}
                />
              </Button>

              {coachingCard && (
                <Box
                  sx={{
                    width: { xs: '90%', sm: 130, md: 200 },
                    height: { xs: 'auto', sm: 100, md: 200 },
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    p: 1,
                    mt: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: { xs: 180, sm: 200, md: 200 },
                      overflow: 'hidden',
                      borderRadius: 1,
                    }}
                  >
                    <img
                      src={coachingCard.preview || coachingCard.mediaUrl}
                      alt="کارت مربیگری"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 4,
                        display: 'block',
                      }}
                    />
                    <IconButton
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                      }}
                      onClick={() => handleRemoveImage("coachingCard")}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="caption"
                    sx={{
                      mt: 1,
                      textAlign: 'center',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {coachingCard.name || coachingCard.mediaUrl.split('/files/')[1]}
                  </Typography>
                </Box>
              )}
            </Grid>
            {/* کارت بیمه ورزشی */}
            <Grid item xs={3} md={3} sx={{ mx: 'auto' }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={sportsInsuranceCard ? <CloudDoneIcon /> : <CloudUploadIcon />}
                color={sportsInsuranceCard ? 'success' : 'primary'}
                fullWidth
                sx={{ mb: 1 }}
              >
                تصویر کارت بیمه ورزشی
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("sportsInsuranceCard", e)}
                />
              </Button>

              {sportsInsuranceCard && (
                <Box
                  sx={{
                    width: { xs: '90%', sm: 130, md: 200 },
                    height: { xs: 'auto', sm: 100, md: 200 },
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    p: 1,
                    mt: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: { xs: 'auto', sm: 250, md: 200 },
                      overflow: 'hidden',
                      borderRadius: 1,
                    }}
                  >
                    <img
                      src={sportsInsuranceCard.preview || sportsInsuranceCard.mediaUrl}
                      alt="کارت بیمه ورزشی"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover', // یا 'contain' برای دیدن کل عکس
                        borderRadius: 4,
                        display: 'block',
                      }}
                    />
                    <IconButton
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                      }}
                      onClick={() => handleRemoveImage("sportsInsuranceCard")}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="caption"
                    sx={{
                      mt: 1,
                      textAlign: 'center',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {sportsInsuranceCard.name || sportsInsuranceCard.mediaUrl.split('/files/')[1]}
                  </Typography>
                </Box>
              )}
            </Grid>
            {/* گواهی آخرین بازآموزی */}
            <Grid item xs={3} md={3} sx={{ mx: 'auto' }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={lastRetrainingCard ? <CloudDoneIcon /> : <CloudUploadIcon />}
                color={lastRetrainingCard ? 'success' : 'primary'}
                fullWidth
                sx={{ mb: 1 }}
              >
                تصویر گواهی آخرین بازآموزی
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("lastRetrainingCard", e)}
                />
              </Button>

              {lastRetrainingCard && (
                <Box
                  sx={{
                    width: { xs: '90%', sm: 130, md: 200 },
                    height: { xs: 'auto', sm: 100, md: 200 },
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    p: 1,
                    mt: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: { xs: 180, sm: 200, md: 200 },
                      overflow: 'hidden',
                      borderRadius: 1,
                    }}
                  >
                    <img
                      src={lastRetrainingCard.preview || lastRetrainingCard.mediaUrl}
                      alt="گواهی آخرین بازآموزی"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover', // یا 'contain' برای دیدن کل عکس
                        borderRadius: 4,
                        display: 'block',
                      }}
                    />
                    <IconButton
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                      }}
                      onClick={() => handleRemoveImage("lastRetrainingCard")}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="caption"
                    sx={{
                      mt: 1,
                      textAlign: 'center',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {lastRetrainingCard.name || lastRetrainingCard.mediaUrl.split('/files/')[1]}
                  </Typography>
                </Box>
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
export default CreateCoachModal;
