import React from 'react';

// API *************************************************
import ProductCatUpdateApi from '../../../api/ProductCat/Update';
import ProductCatCreateApi from '../../../api/ProductCat/Add';
import GetProductCatApi from '../../../api/ProductCat/GetOne';
import UploadFileApi from '../../../api/Common/UploadFile';
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
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
// MUi Icon **************************************************
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
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

const CreateProductCatModal = (props) => {
  const { token, id, openModal, setOpenModal, list } = props;
  // HOOKS FORM **************************************************
  const [sending, setSending] = React.useState(false);
  const [coverImage, setCoverImage] = React.useState(null);
  // FORMIK *******************************************************
  const formik = useFormik({
    initialValues: {
      title: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("عنوان دسته بندی الزامی است")
        .min(3, "عنوان دسته بندی باید حداقل ۳ کاراکتر باشد"),
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
    if (id) {
      //updated
      const body = {
        title: values.title,
        mediaId: coverImage ? coverImage.id : null,
        id,
      }
      const updated = await ProductCatUpdateApi(token, body);
      if (updated.status === 200) {
        toast.SuccessNotify('دسته بندی محصول با موفقیت بروزرسانی شد');
        handleCancel();
        setSending(false);
        list()
      } else {
        toast.ErrorNotify(updated.data.error);
        setSending(false);
      }
    } else {
      const bodyForm = {
        title: values.title,
        mediaId: coverImage ? coverImage.id : null,
      }
      // created
      const created = await ProductCatCreateApi(token, bodyForm);
      if (created.status === 200) {
        toast.SuccessNotify("دسته بندی جدید با موفقیت ثبت شد");
        handleCancel();
        setSending(false);
        list();
      } else {
        toast.ErrorNotify(created.data.error);
        setSending(false);
      }
    }
  };
  // GET productCat ********************************************
  const getProductCat = async () => {
    if (id) {
      try {
        const productCat = await GetProductCatApi(token, id);
        if (productCat.status === 200) {
          formik.setValues({
            title: productCat.data.title || "",
          });
          setCoverImage(productCat.data.media);
        } else {
          toast.ErrorNotify(productCat.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading productCat:", error);
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
    setCoverImage(null);
  };
  // HANDLE FILE CHANGE **************************************
  const handleFileChange = async (event) => {
    const formData = {
      file: event.target.files[0],
      dist: event.target.files[0].name,
    }
    const fileUploaded = await UploadFileApi(token, formData);
    if (fileUploaded && fileUploaded.data) {
      setCoverImage(fileUploaded.data);
    }
  }
  // HANDLE REMOVE FILE *************************************
  const handleRemoveImage = () => {
    setCoverImage(null);
  }
  // USE EFFECT **********************************************
  React.useEffect(() => {
    getProductCat();
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
            {id ? `ویرایش دسته بندی ${formik.values.title}` : ` ثبت دسته بندی جدید`}
          </Typography>
        </Grid>
        <hr />
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`عنوان دسته بندی *`}
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
            {/* تصویر کاور دسته بندی */}
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={coverImage ? <CloudDoneIcon /> : <CloudUploadIcon />}
                color={coverImage ? 'success' : 'primary'}
                fullWidth
                sx={{ mb: 1 }}
              >
                آپلود تصویر دسته بندی
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e)}
                />
              </Button>

              {coverImage && (
                <Box
                  sx={{
                    width: 570, // عرض ثابت کارت
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
                      src={coverImage.preview || coverImage.mediaUrl}
                      alt="تصویر دسته بندی"
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
                      onClick={() => handleRemoveImage()}
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
                    {coverImage.name || coverImage.mediaUrl.split('/files/')[1]}
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
export default CreateProductCatModal;
