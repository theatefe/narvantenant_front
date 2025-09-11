import React from 'react';

// API *************************************************
import UpdateNotificationApi from '../../../api/Notification/Update';
import AddNotificationApi from '../../../api/Notification/Add';
import GetNotificationApi from '../../../api/Notification/GetOne';
import GetAllCoachApi from '../../../api/Coach/GetAll';
import GetAllStudentApi from '../../../api/Student/GetAll';
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
import { Chip, Divider } from '@mui/material';
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

const CreateNotificationModal = (props) => {
  const {
    token, id, openModal, setOpenModal, list
  } = props;
  // HOOKS FORM **************************************************
  const [media, setMedia] = React.useState(null);
  const [attachment, setAttachment] = React.useState(null);
  const [sendType, setSendType] = React.useState('time');
  const [startedDate, setStartedDate] = React.useState(null);
  const [endedDate, setEndedDate] = React.useState(null);
  const [recivers, setRecivers] = React.useState([]);
  const [selectedRecivers, setSelectedRecivers] = React.useState([]);
  const [sending, setSending] = React.useState(false);
  // FORMIK *******************************************************
  const formik = useFormik({
    initialValues: {
      title: "",
      text: "",
      link: "",
      startedAt: null,
      endedAt: null,
      userType: "",
      publicOrPrivate: "",
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
      publicOrPrivate: Yup.string()
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
  // HANDLE SELECT RECIVER ***********************************
  const handleSelect = (event: any) => {
    const id = event.target.value;
    const student = recivers.find((s) => s.id === id);
    if (student && !selectedRecivers.find((s) => s.id === id)) {
      setSelectedRecivers([...selectedRecivers, student]);
      toast.SuccessNotify(`"${student.name}" به لیست دریافت‌کنندگان اضافه شد.`);
    }
  };
  const handleDelete = (id: string) => {
    const student = selectedRecivers.find((s) => s.id === id);
    setSelectedRecivers(selectedRecivers.filter((s) => s.id !== id));
    toast.SuccessNotify(`"${student.name}" از لیست دریافت‌کنندگان حذف شد.`);
  };
  // HANDLE CLOSE *****************************************
  const handleCancel = () => {
    formik.resetForm();
    setMedia(null);
    setAttachment(null);
    setStartedDate(null);
    setSendType('time');
    setEndedDate([]);
    setRecivers([]);
    setSelectedRecivers([]);
    setOpenModal(false);
  };
  // SUBMIT **************************************************
  const submitForm = async (values) => {
    let receivers = [];
    if (values.publicOrPrivate === "PRIVATE") {
      if (selectedRecivers.length === 0) {
        toast.ErrorNotify("لطفا حداقل یک دریافت‌کننده انتخاب کنید.");
        setSending(false);
        return;
      }
      receivers = selectedRecivers.map((s) => s.id);
    }
    console.log(endedDate);
    console.log(startedDate);
    const body = {
      "title": values.title,
      "text": values.text,
      "link": values.link,
      "mediaId": media ? media.id : null,
      "attachmentId": attachment ? attachment.id : null,
      "userType": values.userType,
      "active": 'ACTIVE',
      "type": values.publicOrPrivate,
      "startedAt": georgianDate(ToInt(startedDate)),
      "endedAt": endedDate ? georgianDate(ToInt(endedDate)) : null,
      "receivers": receivers,
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
  // GET NOTIFICATION ****************************************
  const getNotification = async () => {
    if (id) {
      try {
        const notification = await GetNotificationApi(token, id);
        if (notification.status === 200) {
          formik.setValues({
            title: notification.data.title || "",
            text: notification.data.text || "",
            link: notification.data.link || "",
            startedAt: notification.data.startedAt ? jalaliDate(notification.data.startedAt) : null,
            endedAt: notification.data.endedAt ? jalaliDate(notification.data.endedAt) : null,
            userType: notification.data.userType === "مربی" ? 'COACH' : notification.data.userType === "شناگر" ? 'STUDENT' : 'ADMIN',
            publicOrPrivate: notification.data.type === "همه افراد" ? 'PUBLIC' : 'PRIVATE',
          });
          setStartedDate(notification.data.startedAt);
          setEndedDate(notification.data.endedAt);
          setMedia(notification.data.media || null);
          setAttachment(notification.data.attachment || null);
          const list = notification?.data?.recivers.map((item) => ({
            id: item.id,
            name: item?.name + ' ' + item?.lastName,
          }));
          setSelectedRecivers(list);
          if (notification.data.endedAt === null) {
            setSendType('time');
          } else { setSendType('between') }
        } else {
          toast.ErrorNotify(notification.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading notification:", error);
        setOpenModal(false);
      }
    } else {
      formik.resetForm();
    }
  }
  // GET RECIVERS LIST ****************************************
  const getReciverList = async () => {
    if (formik.values.userType === "COACH") {
      const list = await GetAllCoachApi(token);
      if (list.status === 403) {
        setTimeout(() => {
          window.location.href = '/';
        }, 3400);
        toast.ErrorNotify('خطای دسترسی ! شما مجوز ورود به این بخش را ندارید');
        return;
      }
      if (list.status === 200) {
        const arr = list.data.map((item) => ({
          id: item?.user?.id,
          name: item?.user?.name + ' ' + item?.user?.lastName,
        }));
        setRecivers(arr);
      }
    }
    if (formik.values.userType === "STUDENT") {
      const list = await GetAllStudentApi(token);
      if (list.status === 403) {
        setTimeout(() => {
          window.location.href = '/';
        }, 3400);
        toast.ErrorNotify('خطای دسترسی ! شما مجوز ورود به این بخش را ندارید');
        return;
      }
      if (list.status === 200) {
        const arr = list.data.map((item) => ({
          id: item?.user?.id,
          name: item?.user?.name + ' ' + item?.user?.lastName,
        }));
        setRecivers(arr);
      }
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
            <Grid item xs={6} md={6} sx={{ mx: 'auto' }}>
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
            <Grid item xs={6} md={6} sx={{ mx: 'auto' }}>
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
            <Grid item xs={sendType === 'between' ? 4 : 6} md={sendType === 'between' ? 4 : 6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                select
                label="زمان ارسال *"
                variant="outlined"
                size="small"
                value={sendType}
                onChange={(e) => setSendType(e.target.value)}
              >
                <MenuItem value="time"> زمان ارسال</MenuItem>
                <MenuItem value="between">بازه زمانی ارسال</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={sendType === 'between' ? 4 : 6} md={sendType === 'between' ? 4 : 6} sx={{ mx: 'auto' }}>
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
            <Grid item xs={4} md={4} sx={{ mx: 'auto', display: sendType === 'between' ? 'block' : 'none' }}>
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
            <Grid item xs={6} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                select
                label="نوع مخاطب *"
                variant="outlined"
                name="publicOrPrivate"
                value={formik.values.publicOrPrivate}
                onChange={(e) => { formik.handleChange(e); getReciverList(); }}
                onBlur={formik.handleBlur}
                error={formik.touched.publicOrPrivate && Boolean(formik.errors.publicOrPrivate)}
                helperText={formik.touched.publicOrPrivate && formik.errors.publicOrPrivate}
                size="small"
              >
                <MenuItem value="PUBLIC">همه افراد</MenuItem>
                <MenuItem value="PRIVATE">افراد خاص</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} md={6} sx={{ mx: 'auto' }}>
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
                <MenuItem value="COACH">مربیان</MenuItem>
                <MenuItem value="STUDENT">شناگران</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                select
                label="انتخاب گیرندگان"
                variant="outlined"
                name="recivers"
                size="small"
                onChange={handleSelect}
                sx={{ display: formik.values.publicOrPrivate === "PRIVATE" ? 'block' : 'none' }}
              >
                {recivers.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {selectedRecivers.map((item) => (
                  <Chip
                    key={item.id}
                    label={item.name}
                    onDelete={() => handleDelete(item.id)} // امکان حذف
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <Divider> آپلود فایل </Divider>
            </Grid>
            {/* تصویر اعلان */}
            <Grid item xs={6} md={6} sx={{ mx: 'auto' }}>
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
                    width: { xs: '90%', sm: 280, md: 420 },
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
            <Grid item xs={6} md={6} sx={{ mx: 'auto' }}>
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
                    width: { xs: '90%', sm: 280, md: 420 },
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
                      onClick={() => handleRemoveImage("attachment")}
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
export default CreateNotificationModal;
