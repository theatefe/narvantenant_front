import React from 'react';

// API *************************************************
import GetProductCatListApi from '../../../api/ProductCat/GetAll';
import ProductUpdateApi from '../../../api/Product/Update';
import ProductCreateApi from '../../../api/Product/Add';
import GetProductApi from '../../../api/Product/GetOne';
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
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton"
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
// UI ********************************************************
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
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
};

const CreateProductModal = (props) => {
  const { token, id, openModal, setOpenModal, list } = props;
  // HOOKS FORM **************************************************
  const [productCats, setProductCats] = React.useState([]);
  const [selectedProductMedia, setSelectedProductMedias] = React.useState([]);
  const [sending, setSending] = React.useState(false);
  // FORMIK *******************************************************
  const formik = useFormik({
    initialValues: {
      categoryId: "",
      title: "",
      description: "",
      gender: null,
      size: "",
      color: "",
      material: "",
      price: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("نام محصول الزامی است")
        .min(3, "نام محصول باید حداقل ۳ کاراکتر باشد"),
      price: Yup.string()
        .required("قیمت محصول الزامی است"),
      categoryId: Yup.mixed()
        .required("انتخاب دسته بندی الزامی است")
        .test("is-valid-category", "دسته بندی محصول نامعتبر است", (value) => value !== null),
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
      "categoryId": values.categoryId,
      "title": values.title,
      "description": values.description,
      "gender": values.gender,
      "size": values.size,
      "color": values.color,
      "material": values.material,
      "price": values.price,
      "CreateProductMedias": selectedProductMedia.map((media) => {
        return {
          "mediaId": media.id,
        };
      })
    }
    if (id) {
      //updated
      const updated = await ProductUpdateApi(token, { ...body, id });
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
      const created = await ProductCreateApi(token, body);
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
  // FORMAT AMOUNT *******************************************
  const formatAmount = (value) => {
    if (!value) return "";
    const cleaned = value.toString().replace(/,/g, "");
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const unformatAmount = (value) => {
    return value.replace(/,/g, "");
  };
  // GET PRODUCT ***********************************************
  const getProduct = async () => {
    if (id) {
      try {
        const product = await GetProductApi(token, id);
        if (product.status === 200) {
          formik.setValues({
            categoryId: product.data.categoryId,
            title: product.data.title,
            description: product.data.description,
            gender: product.data.gender == "دختر" ? "FEMALE" : product.data.gender == "پسر" ? "MALE" : "null",
            size: product.data.size,
            color: product.data.color,
            material: product.data.material,
            price: product.data.price,
          });
          setSelectedProductMedias(product.data.ProductMedias.map((item) => ({
            id: item.id,
            mediaId: item.media.id,
            mediaUrl: item.media.mediaUrl,
          })));
        } else {
          toast.ErrorNotify(product.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading product:", error);
        setOpenModal(false);
      }
    } else {
      formik.resetForm();
    }
  }
  // GET ProductCat LIST *******************************************
  const getProductCatList = async () => {
    const result = await GetProductCatListApi(token);
    if (result.status === 200) {
      const cats = result.data && result.data.map((item) => ({
        value: item.id, label: item.title
      }));
      setProductCats(cats);
    }
  }
  // HANDLE FILE CHANGE ***************************************
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).map(async (file: File) => {
      const formData: { file: File; dist: string } = {
        file: file,
        dist: 'a',
      };
      const media = await UploadFileApi(token, formData);
      if (media) {
        setSelectedProductMedias((prev) => [...prev, media.data]);
      } else {
        console.error("Invalid media response:", media);
      }
    });
  };
  // HANDLE DELETE ***************************************
  const handleDelete = (item) => {
    const updatedMedia = [...selectedProductMedia];
    const findindex = updatedMedia.find((x) => x.id === item.id)
    updatedMedia.splice(findindex, 1);
    setSelectedProductMedias(updatedMedia);
  };
  // HANDLE CLOSE *****************************************
  const handleCancel = () => {
    formik.resetForm();
    setSelectedProductMedias([]);
    setOpenModal(false);
  };
  // USE EFFECT **********************************************
  React.useEffect(() => {
    getProduct();
    getProductCatList();
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
            {id ? `ویرایش محصول :  ${formik.values.title}` : ` ثبت محصول جدید`}
          </Typography>
        </Grid>
        <hr />
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <Autocomplete
                disablePortal
                fullWidth
                options={productCats}
                size="small"
                value={productCats.find((option) => option.value === formik.values.categoryId) || null}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={(event, item) => {
                  formik.setFieldValue("categoryId", item ? item.value : "");
                }}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    id="categoryId"
                    name="categoryId"
                    type="text"
                    {...params}
                    size="small"
                    label="دسته بندی محصول *"
                    error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                    helperText={formik.touched.categoryId && typeof formik.errors.categoryId === 'string' ? formik.errors.categoryId : undefined}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`عنوان محصول *`}
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
                label={`جنس محصول *`}
                variant="outlined"
                name="material"
                value={formik.values.material}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.material && Boolean(formik.errors.material)}
                helperText={formik.touched.material && formik.errors.material}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`رنگ محصول *`}
                variant="outlined"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.color && Boolean(formik.errors.color)}
                helperText={formik.touched.color && formik.errors.color}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`سایز محصول *`}
                variant="outlined"
                name="size"
                value={formik.values.size}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.size && Boolean(formik.errors.size)}
                helperText={formik.touched.size && formik.errors.size}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`قیمت محصول (ریال) *`}
                variant="outlined"
                name="price"
                value={formatAmount(formik.values.price)}
                onChange={(e) => {
                  const rawValue = unformatAmount(e.target.value);
                  if (/^\d*$/.test(rawValue)) {
                    formik.setFieldValue("price", rawValue);
                  }
                }}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                select
                label="جنسیت محصول  *"
                variant="outlined"
                name="gender"
                value={formik.values.gender}
                onChange={(e) => { formik.handleChange(e) }}
                onBlur={formik.handleBlur}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
                size="small"
              >
                <MenuItem value="null">بدون جنسیت</MenuItem>
                <MenuItem value="FEMALE">زنانه</MenuItem>
                <MenuItem value="MALE">مردانه</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`توضیحات محصول *`}
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
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                انتخاب تصاویر محصول ...
                <VisuallyHiddenInput
                  type="file"
                  multiple
                  onChange={(e) => handleFileChange(e)}
                />
              </Button>
            </Grid>
            <Grid container spacing={2} className='mt-1 mx-2'>
              {selectedProductMedia.map((item, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '75%', // مربع کامل، برای نسبت 4:3 میشه '75%'
                    overflow: 'hidden',
                    borderRadius: '12px',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                  }}>
                    <img src={item.mediaUrl} alt={`Image ${index}`} style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }} />
                    <IconButton
                      className='bg-danger text-white'
                      aria-label="delete"
                      onClick={() => handleDelete(item)}
                      style={{ position: 'absolute', top: 5, right: 5, backgroundColor: 'white' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </Grid>
              ))}
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
export default CreateProductModal;
