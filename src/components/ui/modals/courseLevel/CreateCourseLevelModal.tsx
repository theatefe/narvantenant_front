import React from 'react';

// API *************************************************
import CourseLevelUpdateApi from '../../../api/CourseLevel/Update';
import CourseLevelCreateApi from '../../../api/CourseLevel/Add';
import GetCourseLevelApi from '../../../api/CourseLevel/GetOne';
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

// MUi Icon **************************************************
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
// Formik & yup ************************************************
import { useFormik } from 'formik';
import * as Yup from 'yup';
// redux seters ************************************************

// STYLE MODAL
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

const CreateCourseLevelCatModal = (props) => {
  const {
    token, categoryId, id, openModal, setOpenModal, list
  } = props;
  // HOOKS FORM **************************************************
  const [sending, setSending] = React.useState(false);
  // FORMIK *******************************************************
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      gender: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("عنوان سطح آموزشی الزامی است")
        .min(3, "عنوان سطح باید حداقل ۳ کاراکتر باشد"),
      description: Yup.string()
        .required("توضیحات سطح آموزشی الزامی است")
        .min(10, "توضیحات سطح آموزشی باید حداقل 10 کاراکتر باشد"),
      gender: Yup.string()
        .required("جنسیت سطح آموزشی را انتخاب کنید")
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
      categoryId: Number(categoryId),
      title: values.title,
      description: values.description,
      gender: values.gender,
      id,
    }
    if (id) {
      //updated
      const values = { ...body, id }
      const updated = await CourseLevelUpdateApi(token, values);
      if (updated.status === 200) {
        toast.SuccessNotify('سطح آموزشی با موفقیت بروزرسانی شد');
        handleCancel();
        setSending(false);
        list()
      } else {
        toast.ErrorNotify(updated.data.error);
        setSending(false);
      }
    } else {
      // created
      const created = await CourseLevelCreateApi(token, body);
      if (created.status === 200) {
        toast.SuccessNotify("سطح آموزشی جدید با موفقیت ثبت شد");
        handleCancel();
        setSending(false);
        list();
      } else {
        toast.ErrorNotify(created.data.error);
        setSending(false);
      }
    }
  };
  // GET CourseLevel ********************************************
  const getCourseLevel = async () => {
    if (id) {
      try {
        const courseLevel = await GetCourseLevelApi(token, id);
        if (courseLevel.status === 200) {
          formik.setValues({
            title: courseLevel.data.title || "",
            description: courseLevel.data.description || "",
            gender: courseLevel.data.gender == "پسر" ? 'MALE' : "FEMALE",
          });
        } else {
          toast.ErrorNotify(courseLevel.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading courseLevel:", error);
        setOpenModal(false);
      }
    } else {
      formik.resetForm();
    }
  }
  // HANDLE CLOSE *****************************************
  const handleCancel = () => {
    formik.resetForm();
    setOpenModal(false);
  };
  // USE EFFECT **********************************************
  React.useEffect(() => {
    getCourseLevel();
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
            {id ? `ویرایش سطح ${formik.values.title}` : ` ثبت سطح آموزشی جدید`}
          </Typography>
        </Grid>
        <hr />
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`عنوان سطح *`}
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
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label="توضیحات"
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
export default CreateCourseLevelCatModal;
