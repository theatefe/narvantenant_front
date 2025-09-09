import React from 'react';

// API **************************************************
import GetOrderApi from '../../../api/order/GetOne';
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

const DetailOredrModal = (props) => {
  const { token, id, openModal, setOpenModal } = props;
  // HOOKS FORM **************************************************
  const [data, setData] = React.useState(null);
  const [openImageModal, setOpenImageModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState('');
  // GET Order ********************************************
  const getOredr = async () => {
    if (id) {
      try {
        const order = await GetOrderApi(token, id);
        if (order.status === 200) {
          setData(order.data);
        } else {
          toast.ErrorNotify(order.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading order:", error);
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
    getOredr();
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
              {id && `جزئیات سفارش`}
            </Typography>
          </Grid>
          {data && data?.OrderProducts.map((item, index) => (
            <>
              <Divider className='my-3'>{` محصول (${index + 1}) `}</Divider>
              <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                <Grid item xs={6} md={3} sx={{ mx: 'auto' }}>
                  <span className={"text-secondary"}>
                    نام محصول  : {"  "}
                  </span>
                  <span>
                    {`   ${item?.product?.title}`}
                  </span>
                </Grid>
                <Grid item xs={6} md={3} sx={{ mx: 'auto' }}>
                  <span className={"text-secondary"}>
                    قیمت محصول  : {"  "}
                  </span>
                  <span>
                    {`  ${numberSpace(item?.product?.price)} ریال `}
                  </span>
                </Grid>
                <Grid item xs={6} md={3} sx={{ mx: 'auto' }}>
                  <span className={"text-secondary"}>
                    رنگ محصول: {" "}
                  </span>
                  <span>
                    {item?.product?.color || "-"}
                  </span>
                </Grid>
                <Grid item xs={6} md={3} sx={{ mx: 'auto' }}>
                  <span className={"text-secondary"}>
                    سایز محصول: {" "}
                  </span>
                  <span>
                    {item?.product?.size || "-"}
                  </span>
                </Grid>
                <Grid item xs={6} md={6} sx={{ mx: 'auto' }}>
                  <span className={"text-secondary"}>
                    تعداد محصول در سفارش: {" "}
                  </span>
                  <span>
                    {item?.total || "-"}
                  </span>
                </Grid>
                <Grid item xs={6} md={6} sx={{ mx: 'auto' }}>
                  <span className={"text-secondary"}>
                    قیمت محصول در سفارش: {" "}
                  </span>
                  <span>
                    {`  ${numberSpace(item?.total * item?.unitPrice)} ریال `}
                  </span>
                </Grid>
              </Grid>
            </>
          ))}
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
export default DetailOredrModal;
