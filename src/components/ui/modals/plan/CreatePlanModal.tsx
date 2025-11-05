import React from 'react';

// API *************************************************
import PlanUpdateApi from '../../../api/Plan/Update';
import PlanCreateApi from '../../../api/Plan/Add';
import GetPlanApi from '../../../api/Plan/GetOne';
import ClassListApi from '../../../api/Class/GetAll';
import GetAllClassEnrollment from '../../../api/ClassEnrollment/GetAll';
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
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
// MUi Icon **************************************************
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
// Formik & yup ************************************************
import { useFormik } from 'formik';
import * as Yup from 'yup';
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

const CreatePlanModal = (props) => {
  const { token, id, openModal, setOpenModal, list } = props;
  // HOOKS FORM **************************************************
  const [sending, setSending] = React.useState(false);
  const [attachFile, setAttachFile] = React.useState(null);
  const [classes, setClasses] = React.useState([]);
  const [students, setStudents] = React.useState([]);
  // FORMIK *******************************************************
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      status: "",
      classId: null,
      studentId: null,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("عنوان برنامه الزامی است")
        .min(3, "عنوان برنامه باید حداقل ۳ کاراکتر باشد"),
      status: Yup.string()
        .required("نوع برنامه الزامی است")
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
      "description": values.description,
      "status": values.status,
      "attachFileId": attachFile ? attachFile.id : null,
      "classId": values.classId || null,
      "studentId": values.studentId || null,
    }
    if (id) {
      //updated
      const updateBody = { id, ...body }
      const updated = await PlanUpdateApi(token, updateBody);
      if (updated.status === 200) {
        toast.SuccessNotify('برنامه غذایی با موفقیت بروزرسانی شد');
        handleCancel();
        setSending(false);
        list()
      } else {
        toast.ErrorNotify(updated.data.error);
        setSending(false);
      }
    } else {
      // created
      const created = await PlanCreateApi(token, body);
      if (created.status === 200) {
        toast.SuccessNotify("برنامه غذایی جدید با موفقیت ثبت شد");
        handleCancel();
        setSending(false);
        list();
      } else {
        toast.ErrorNotify(created.data.error);
        setSending(false);
      }
    }
  };
  // HANDLE CLOSE *****************************************
  const handleCancel = () => {
    formik.resetForm();
    setOpenModal(false);
    setAttachFile(null);
    setClasses([]);
    setStudents([]);
  };
  // HANDLE FILE CHANGE **************************************
  const handleFileChange = async (event) => {
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
      setAttachFile(fileUploaded.data);
    }
  }
  const isImage = (file) => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    const fileName = file.name || file.mediaUrl || '';
    return (
      imageTypes.includes(file.type) ||
      /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName)
    );
  };

  // بررسی اینکه فایل PDF است یا نه
  const isPdf = (file) => {
    const fileName = file.name || file.mediaUrl || '';
    return (
      file.type === 'application/pdf' ||
      /\.pdf$/i.test(fileName)
    );
  };
  // HANDLE REMOVE FILE *************************************
  const handleRemoveImage = () => {
    setAttachFile(null);
  }
  //GET ALL CLASS ******************************************
  const getAllClasses = async () => {
    const result = await ClassListApi(token);
    if (result.status == 200 || result.status == 201) {
      setClasses(result.data);
    }
  }
  //GET ALL STUDENT ******************************************
  const getStudentsClass = async (classId) => {
    const result = await GetAllClassEnrollment(token, classId);
    if (result.status == 200 || result.status == 201) {
      setStudents(result.data);
    }
  }
  // GET plan ********************************************
  const getPlan = async () => {
    if (id) {
      try {
        const plan = await GetPlanApi(token, id);
        getStudentsClass(plan.data.classId);
        if (plan.status === 200) {
          formik.setValues({
            title: plan.data.title || " ",
            description: plan.data.description || " ",
            status: plan.data.status || " ",
            classId: plan.data.classId || " ",
            studentId: plan.data.studentId || '',
          });
          setAttachFile(plan.data.attachFile);
        } else {
          toast.ErrorNotify(plan.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading plan:", error);
        setOpenModal(false);
      }
    } else {
      formik.resetForm();
    }
  }
  // USE EFFECT **********************************************
  React.useEffect(() => {
    getAllClasses();
    getPlan();
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
            {id ? `ویرایش برنامه غذایی ${formik.values.title}` : ` ثبت برنامه غذایی جدید`}
          </Typography>
        </Grid>
        <hr />
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            <Grid item xs={6} md={12} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`عنوان *`}
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
                label={`توضیحات `}
                variant="outlined"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                size="small"
              />
            </Grid>
            <Grid item xs={6} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                select
                label="نوع عمومیت برنامه را انتخاب کنید  *"
                variant="outlined"
                name="status"
                value={formik.values.status}
                onChange={(e) => { formik.handleChange(e) }}
                onBlur={formik.handleBlur}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
                size="small"
              >
                <MenuItem value="PUBLIC"> عمومی </MenuItem>
                <MenuItem value="PRIVATE"> خصوصی </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} md={6} sx={{ mx: 'auto', my: 'auto', display: formik.values.status !== 'PRIVATE' ? 'none' : 'block' }}>
              <TextField
                fullWidth
                select
                label="انتخاب کلاس آموزشی  *"
                variant="outlined"
                name="classId"
                value={formik.values.classId ?? ''}
                onChange={(e) => { formik.handleChange(e), getStudentsClass(e.target.value) }}
                onBlur={formik.handleBlur}
                size="small"
                SelectProps={{
                  displayEmpty: true,
                }}
              >
                {classes && classes.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item?.id}>
                      {item?.name}
                    </MenuItem>
                  )
                })}
              </TextField>
            </Grid>
            <Grid item xs={6} md={6} sx={{ mx: 'auto', my: 'auto', display: formik.values.status !== 'PRIVATE' ? 'none' : 'block' }}>
              <TextField
                fullWidth
                select
                label="انتخاب دانش آموز  *"
                variant="outlined"
                name="studentId"
                value={formik.values.studentId}
                onChange={(e) => { formik.handleChange(e) }}
                onBlur={formik.handleBlur}
                size="small"
                SelectProps={{
                  displayEmpty: true,
                }}
              >
                {students && students.map((item) => {
                  return (
                    <MenuItem key={item?.student?.id} value={item?.student?.id}>
                      {item?.student?.user?.name + ' ' + item?.student?.user?.lastName}
                    </MenuItem>
                  )
                })}
              </TextField>
            </Grid>
            {/* ضمیمه */}
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={attachFile ? <CloudDoneIcon /> : <CloudUploadIcon />}
                color={attachFile ? 'success' : 'primary'}
                fullWidth
                sx={{ mb: 1 }}
              >
                آپلود ضمیمه
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e)}
                />
              </Button>

              {attachFile && (
                <Box
                  sx={{
                    width: {
                      xs: '100%',
                      sm: 570,
                      md: 860,
                    },
                    height: {
                      xs: 80,
                      md: 200,
                    },
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
                      height: {
                        xs: 50,
                        md: 200,
                      },
                      overflow: 'hidden',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    {isImage(attachFile) ? (
                      <img
                        src={attachFile.preview || attachFile.mediaUrl}
                        alt="ضمیمه تصویری"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 4,
                          display: 'block',
                        }}
                      />
                    ) : isPdf(attachFile) ? (
                      <>
                        <PictureAsPdfIcon sx={{ fontSize: { xs: 40, md: 60 }, color: '#d32f2f' }} />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          فایل PDF انتخاب شده است
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2">فرمت فایل پشتیبانی نمی‌شود</Typography>
                    )}

                    <IconButton
                      color="error"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                      }}
                      onClick={() => handleRemoveImage()}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      textAlign: 'center',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: {
                        xs: '0.7rem',
                        md: '0.75rem',
                      },
                    }}
                  >
                    {attachFile.name || attachFile.mediaUrl?.split('/files/')[1]}
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
    </Modal>
  );
};
export default CreatePlanModal;
