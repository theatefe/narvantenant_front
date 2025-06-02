import React from 'react';

// API *************************************************
import SkillRangeUpdateApi from '../../../api/SkillRange/Update';
import SkillRangeCreateApi from '../../../api/SkillRange/Add';
import GetSkillRangeApi from '../../../api/SkillRange/GetOne';
// TOAST ************************************************
import * as toast from '../../../ui/Toast';
// MUI **************************************************
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
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
};

const CreateCourseLevelCatModal = (props) => {
  const { token, id, openModal, setOpenModal, list } = props;
  // HOOKS FORM **************************************************
  const [sending, setSending] = React.useState(false);
  // FORMIK *******************************************************
  const formik = useFormik({
    initialValues: {
      title: "",
      min: "",
      max: "",
      color: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("عنوان محدوده مهارت الزامی است"),
      min: Yup.string()
        .required("عدد حداقل بازه محدوده را وارد کنید"),
      max: Yup.string()
        .required("عدد حداکثر بازه محدوده را انتخاب کنید"),
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
      "min": values.min,
      "max": values.max,
      "color": values.color
    }
    if (id) {
      //updated
      const values={...body, id}
      const updated = await SkillRangeUpdateApi(token, values);
      if (updated.status === 200) {
        toast.SuccessNotify('محدوده مهارت با موفقیت بروزرسانی شد');
        handleCancel();
        setSending(false);
        list()
      } else {
        toast.ErrorNotify(updated.data.error);
        setSending(false);
      }
    } else {
      // created
      const created = await SkillRangeCreateApi(token, body);
      if (created.status === 200) {
        toast.SuccessNotify("محدوده مهارت جدید با موفقیت ثبت شد");
        handleCancel();
        setSending(false);
        list();
      } else {
        toast.ErrorNotify(created.data.error);
        setSending(false);
      }
    }
  };
  // GET SkillRange ********************************************
  const getSkillRange = async () => {
    if (id) {
      try {
        const skillRange = await GetSkillRangeApi(token, id);
        if (skillRange.status === 200) {
          formik.setValues({
            title: skillRange.data.name || "",
            min: skillRange.data.min || "",
            max: skillRange.data.max || "",
            color: skillRange.data.color || "",
          });
        } else {
          toast.ErrorNotify(skillRange.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading skillRange:", error);
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
    getSkillRange();
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
            {id ? `ویرایش محدوده  ${formik.values.title}` : ` ثبت محدوده مهارت جدید`}
          </Typography>
        </Grid>
        <hr />
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
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
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`حداقل بازه محدوده *`}
                variant="outlined"
                name="min"
                value={formik.values.min}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.min && Boolean(formik.errors.min)}
                helperText={formik.touched.min && formik.errors.min}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`حداکثر  بازه محدوده *`}
                variant="outlined"
                name="max"
                value={formik.values.max}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.max && Boolean(formik.errors.max)}
                helperText={formik.touched.max && formik.errors.max}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                type="color"
                name="color"
                label="رنگ محدوده"
                value={formik.values.color}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.color && Boolean(formik.errors.color)}
                helperText={formik.touched.color && formik.errors.color}
                size="small"
                InputLabelProps={{ shrink: true }} // برای نمایش درست برچسب
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
