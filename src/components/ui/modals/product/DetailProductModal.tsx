import React from 'react';

// API **************************************************
import GetProductApi from '../../../api/Product/GetOne';
// TOAST *******************************************************
import * as toast from '../../../ui/Toast';
// MUI **************************************************
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from "@mui/material/IconButton";
// MUi Icon **************************************************
import CancelIcon from '@mui/icons-material/Cancel';
// OTHER *******************************************************
import { numberSpace } from '../../../helpers/NumberTools'
import {
  jalaliDate,
} from '../../../helpers/convertDate.helper';
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

const DetailCourseLevelCatModal = (props) => {
  const { token, id, openModal, setOpenModal } = props;
  // HOOKS FORM **************************************************
  const [data, setData] = React.useState(null);
  const [openImageModal, setOpenImageModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState('');
  // GET Product ********************************************
  const getProduct = async () => {
    if (id) {
      try {
        const product = await GetProductApi(token, id);
        if (product.status === 200) {
          setData(product.data);
        } else {
          toast.ErrorNotify(product.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading product:", error);
        setOpenModal(false);
      }
    }
  }
  // OPEN IMAGE DIALOG ***************************************
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenImageModal(true);
  };
  const handleCloseImageModal = () => {
    setOpenImageModal(false);
  };
  // HANDLE CLOSE *****************************************
  const handleCancel = () => {
    setData(null);
    setOpenModal(false);
  };
  // USE EFFECT **********************************************
  React.useEffect(() => {
    getProduct();
  }, [id]);
  // RETURN **************************************************
  return (
    <Modal
      open={openModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <React.Fragment>
        <Box sx={style} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={12} alignItems="center" className='text-center'>
            <Typography variant="h5">
              {id && `جزئیات محصول`}
            </Typography>
          </Grid>
          <hr />
          <form>
            <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
              <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
                <span className={"text-secondary"}>
                  نام محصول  : {"  "}
                </span>
                <span>
                  {`   ${data?.title}`}
                </span>
              </Grid>
              <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
                <span className={"text-secondary"}>
                  قیمت محصول  : {"  "}
                </span>
                <span>
                  {`  ${numberSpace(data?.price)} ریال `}
                </span>
              </Grid>
              <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
                <span className={"text-secondary"}>
                  دسته بندی : {"  "}
                </span>
                <span>
                  {`${data?.productCategory?.title}`}
                </span>
              </Grid>
              <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
                <span className={"text-secondary"}>
                  جنس محصول : {" "}
                </span>
                <span>
                  {data?.material || "-"}
                </span>
              </Grid>
              <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
                <span className={"text-secondary"}>
                  رنگ محصول: {" "}
                </span>
                <span>
                  {data?.color || "-"}
                </span>
              </Grid>
              <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
                <span className={"text-secondary"}>
                  سایز محصول: {" "}
                </span>
                <span>
                  {data?.size || "-"}
                </span>
              </Grid>
              <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
                <span className={"text-secondary"}>
                  جنسیت محصول: {" "}
                </span>
                <span>
                  {data?.gender || "-"}
                </span>
              </Grid>
              <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
                <span className={"text-secondary"}>
                  وضعیت محصول: {" "}
                </span>
                <span>
                  {data?.status || "-"}
                </span>
              </Grid>
              <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
                <span className={"text-secondary"}>
                  توضیحات: {" "}
                </span>
                <span>
                  {data?.description || "-"}
                </span>
              </Grid>
              <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
                <span className={"text-secondary"}>
                  تاریخ ثبت : {" "}
                </span>
                <span>
                  {jalaliDate(data?.createdAt)}
                </span>
              </Grid>
              <Grid item xs={12} md={12}>
                {data?.ProductMedias.length > 0 && (
                  <>
                    <Divider className={"text-secondary"}>تصاویر محصول</Divider>
                    <Grid container spacing={3} mt={1}>
                      {data?.ProductMedias.map((item) => (
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{
                              position: 'relative',
                              width: '100%',
                              paddingTop: '62%',
                              borderRadius: 2,
                              overflow: 'hidden',
                              boxShadow: 3,
                              cursor: 'pointer',
                              transition: 'transform 0.3s',
                              '&:hover': {
                                transform: 'scale(1.05)',
                              },
                            }}
                            onClick={() => handleImageClick(item?.media?.mediaUrl)}
                          >
                            <img
                              src={item?.media?.mediaUrl}
                              alt="خطا در نمایش تصویر کارت مربیگری"
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12} sx={{ mx: 'auto' }}>
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
                  }}
                >
                  انصراف
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
        {/* اینجا Modal مربوط به نمایش بزرگ تصاویر */}
        <Dialog open={openImageModal} onClose={handleCloseImageModal} maxWidth="md">
          <IconButton
            aria-label="close"
            onClick={handleCloseImageModal}
            sx={{ position: 'absolute', right: 8, top: 8, color: '#555' }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent>
            <Box
              sx={{
                width: 600,
                height: 400,
                mx: 'auto',
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: '#f0f0f0',
                boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
              }}
            >
              <img
                src={selectedImage}
                alt="تصویر"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </Modal>
  );
};
export default DetailCourseLevelCatModal;
