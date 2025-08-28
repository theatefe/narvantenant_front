import React from 'react';

// API *************************************************
import UpdateNotificationApi from '../../../api/Notification/Update';
import AddNotificationApi from '../../../api/Notification/Add';
import GetNotificationApi from '../../../api/Notification/GetOne';
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
import { Divider } from '@mui/material';
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
  width: 900,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
};

const ReciverNotificationModal = (props) => {
  const {
    token, id, openModal, setOpenModal, list
  } = props;
  // HOOKS FORM **************************************************
  const [media, setMedia] = React.useState(null);
  const [attachment, setAttachment] = React.useState(null);
  const [sendType, setSendType] = React.useState(null);
  const [startedDate, setStartedDate] = React.useState(null);
  const [endedDate, setEndedDate] = React.useState(null);
  const [sending, setSending] = React.useState(false);
  // FORMIK *******************************************************
  const formik = useFormik({
    initialValues: {
      title: "",
      text: "",
      link: "",
      startedAt: null,
      endedAt:null,
      userType: "",
      type:"",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("عنوان اعلان الزامی است")
        .min(3, "عنوان اعلان باید حداقل ۳ کاراکتر باشد"),
      text: Yup.string()
        .required("متن اعلان الزامی است")
        .min(3, "متن اعلان باید حداقل ۳ کاراکتر باشد"),
      link: Yup.string(),
      userType: Yup.string()
        .required("انتخاب مخاطب اعلان الزامی است")
        .min(1, "مخاطب اعلان انتخاب نشده است"),
      type: Yup.string()
        .required("انتخاب نوع مخاطب الزامی است")
        .min(1, "نوع مخاطب انتخاب نشده است"),
      startedAt: Yup.string()
        .required("تاریخ و ساعت ارسال الزامی است")
        .nullable(),
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
      "title": values.title,
      "text": values.text,
      "link": values.link,
      "mediaId": media ? media.id : null,
      "attachmentId": attachment ? attachment.id : null,
      "userType": values.userType,
      "active": 'ACTIVE',
      "type": values.type,
      "startedAt": georgianDate(ToInt(startedDate)),
      "endedAt": endedDate ? georgianDate(ToInt(endedDate)) : null,
      "receivers": [],
    }
    if (id) {
      //updated
      const updated = await UpdateNotificationApi(token, { ...body, id });
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
      const created = await AddNotificationApi(token, body);
      if (created.status === 200) {
        toast.SuccessNotify("ثبت اعلان با موفقیت انجام شد");
        handleCancel();
        setSending(false);
        list();
      } else {
        toast.ErrorNotify(created.data.error);
        setSending(false);
      }
    }
  };
  // GET NOTIFICATION ***********************************************
  const getNotification = async () => {
    if (id) {
      try {
        const student = await GetNotificationApi(token, id);
        if (student.status === 200) {
          formik.setValues({
            title: student.data.title || "",
            text: student.data.text || "",
            link: student.data.link || "",
            startedAt: student.data.startedAt ? jalaliDate(student.data.startedAt) : null,
            endedAt: student.data.endedAt ? jalaliDate(student.data.endedAt) : null,
            userType: student.data.userType || "",
            type: student.data.type || "",
          });
          setMedia(student.data.media || null);
          setAttachment(student.data.attachment || null);
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
      if (label === 'media') {
        setMedia(fileUploaded.data);
      }
      if (label === 'attachment') {
        setAttachment(fileUploaded.data);
      }
    }
  };
  // HANDLE REMOVE FILE ***********************************
  const handleRemoveImage = (type: string) => {
    switch (type) {
      case 'media':
        setMedia(null);
        break;
      case 'attachment':
        setAttachment(null);
        break;
      default:
        console.warn(`Unknown type: ${type}`);
    }
  }
  // HANDLE CLOSE *****************************************
  const handleCancel = () => {
    formik.resetForm();
    setMedia(null);
    setAttachment(null);
    setOpenModal(false);
  };
  // USE EFFECT **********************************************
  React.useEffect(() => {
    getNotification();
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
            {id ? `ویرایش اعلان ` : `ثبت اعلان جدید`}
          </Typography>
        </Grid>
        <hr />
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`عنوان  *`}
                variant="outlined"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`لینک `}
                variant="outlined"
                name="link"
                value={formik.values.link}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.link && Boolean(formik.errors.link)}
                helperText={formik.touched.link && formik.errors.link}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`متن اعلان  *`}
                variant="outlined"
                name="text"
                value={formik.values.text}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.text && Boolean(formik.errors.text)}
                helperText={formik.touched.text && formik.errors.text}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <Divider>زمان ارسال</Divider>
            </Grid>
            <Grid item xs={12} md={sendType === 'between' ? 4 : 6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                select
                label="زمان ارسال *"
                variant="outlined"
                name="sendType"
                size="small"
                onChange={(e) => setSendType(e.target.value)}
              >
                <MenuItem value="time"> زمان ارسال</MenuItem>
                <MenuItem value="between">بازه زمانی ارسال</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={sendType === 'between' ? 4 : 6} sx={{ mx: 'auto' }}>
              <DatePickersInputWithTime
                setSelectedDate={(date: Date) => { formik.setFieldValue('startedAt', date); setStartedDate(date); }}
                selectedDate={formik.values.startedAt}
                fullWidth
                label={`تاریخ و ساعت ارسال `}
              />
              {formik.touched.startedAt && typeof formik.errors.startedAt === 'string' && (
                <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.startedAt}</div>
              )}
            </Grid>
            <Grid item xs={12} md={4} sx={{ mx: 'auto', display: sendType === 'between' ? 'block' : 'none' }}>
              <DatePickersInputWithTime
                setSelectedDate={(date: Date) => { formik.setFieldValue('endedAt', date); setEndedDate(date); }}
                selectedDate={formik.values.endedAt}
                fullWidth
                label={`تاریخ و ساعت پایان `}
              />
              {formik.touched.endedAt && typeof formik.errors.endedAt === 'string' && (
                <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.endedAt}</div>
              )}
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <Divider>گیرندگان اعلان</Divider>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                select
                label="مخاطب اعلان *"
                variant="outlined"
                name="userType"
                value={formik.values.userType}
                onChange={(e) => { formik.handleChange(e) }}
                onBlur={formik.handleBlur}
                error={formik.touched.userType && Boolean(formik.errors.userType)}
                helperText={formik.touched.userType && formik.errors.userType}
                size="small"
              >
                <MenuItem value="ADMIN">مدیر</MenuItem>
                <MenuItem value="COACH">مربیان</MenuItem>
                <MenuItem value="STUDENT">شناگران</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                select
                label="نوع مخاطب *"
                variant="outlined"
                name="type"
                value={formik.values.type}
                onChange={(e) => { formik.handleChange(e) }}
                onBlur={formik.handleBlur}
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
                size="small"
              >
                <MenuItem value="PUBLIC">همه افراد</MenuItem>
                <MenuItem value="PRIVATE">افراد خاص</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <Typography className='text-center text-secondary'> اگر قصد ارسال برای افراد خاصی را دارید، پس از ثبت اعلان، گزینه انتخاب گیرندگان را کلیک کنید.</Typography>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <Divider> آپلود فایل </Divider>
            </Grid>
            {/* تصویر اعلان */}
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={media ? <CloudDoneIcon /> : <CloudUploadIcon />}
                color={media ? 'success' : 'primary'}
                fullWidth
                sx={{ mb: 1 }}
              >
                آپلود تصویر اعلان
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("media", e)}
                />
              </Button>

              {media && (
                <Box
                  sx={{
                    width: 420, // عرض ثابت کارت
                    height: 200, // ارتفاع ثابت کارت
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
                      height: 200, // ارتفاع ثابت برای بخش عکس
                      overflow: 'hidden',
                      borderRadius: 1,
                    }}
                  >
                    <img
                      src={media.preview || media.mediaUrl}
                      alt="کارت ملی"
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
                        backgroundColor: 'rgba(255,255,255,0.7)'
                      }}
                      onClick={() => handleRemoveImage("media")}
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
                    {media.name || media.mediaUrl.split('/files/')[1]}
                  </Typography>
                </Box>
              )}
            </Grid>
            {/* ضمیمه اعلان */}
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={attachment ? <CloudDoneIcon /> : <CloudUploadIcon />}
                color={attachment ? 'success' : 'primary'}
                fullWidth
                sx={{ mb: 1 }}
              >
                آپلود ضمیمه اعلان
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange("attachment", e)}
                />
              </Button>

              {attachment && (
                <Box
                  sx={{
                    width: 420, // عرض ثابت کارت
                    height: 200, // ارتفاع ثابت کارت
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
                      height: 200, // ارتفاع ثابت برای بخش عکس
                      overflow: 'hidden',
                      borderRadius: 1,
                    }}
                  >
                    <img
                      src={attachment.preview || attachment.mediaUrl}
                      alt="کارت ملی"
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
                    {attachment.name || attachment.mediaUrl.split('/files/')[1]}
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
export default ReciverNotificationModal;
