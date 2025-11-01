import React from 'react';

// API **************************************************
import GetNotificationApi from '../../../api/Notification/GetOne';
// TOAST *******************************************************
import * as toast from '../../../ui/Toast';
// MUI **************************************************
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Divider from '@mui/material/Divider';
import IconButton from "@mui/material/IconButton"
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
// MUi Icon **************************************************
import CancelIcon from '@mui/icons-material/Cancel';
// OTHER *******************************************************
import {
  jalaliDateWithTime
} from '../../../helpers/convertDate.helper';
import { Chip } from '@mui/material';
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

const DetailNotificationModal = (props) => {
  const { token, id, openModal, setOpenModal } = props;
  // HOOKS FORM **************************************************
  const [data, setData] = React.useState(null);
  const [openImageModal, setOpenImageModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState('');
  // GET NOTIFICATION ********************************************
  const getNotification = async () => {
    if (id) {
      try {
        const notification = await GetNotificationApi(token, id);
        if (notification.status === 200) {
          setData(notification.data);
        } else {
          toast.ErrorNotify(notification.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading notification:", error);
        setOpenModal(false);
      }
    }
  }
  // HANDLE CLOSE *****************************************
  const handleCancel = () => {
    setData(null);
    setOpenModal(false);
  };
  // OPEN IMAGE DIALOG ***************************************
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenImageModal(true);
  };
  const handleCloseImageModal = () => {
    setOpenImageModal(false);
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
      <React.Fragment>
        <Box
          sx={{
            ...style,
            maxWidth: 1000,
            bgcolor: '#fafafa',
            borderRadius: 3,
            boxShadow: 4,
            p: 4,
            mx: 'auto',
          }}
        >
          <Typography variant="h5" gutterBottom align="center">
            {id && 'جزئیات اعلان'}
          </Typography>
          <Divider sx={{ my: 1 }}></Divider>

          <Box mb={2}>
            <Grid container spacing={2} className='text-end'>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2" className='text-secondary'>
                    {"عنوان اعلان"} :{" "}<Typography component="span" className='text-dark'>{data?.title}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2" className='text-secondary'>
                    {"لینک اعلان"} : {" "}
                    <Typography component="span" className='text-dark'>{data?.link || '-'}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2" className='text-secondary'>
                    {"نوع مخاطب"}  : {" "}
                    <Typography component="span" className='text-dark'>{data?.type}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2" className='text-secondary'>
                    {"وضعیت"} : {" "}
                    <Typography component="span" className='text-dark'>{data?.active}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Box>
                  <Typography variant="body2" className='text-secondary' >
                    {"متن اعلان"} : {" "}
                    <Typography component="span" className='text-dark'>{data?.text}</Typography>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* گالری تصاویر */}
          <Box mb={3} mt={1}>
            <Grid container spacing={2}>
              {data?.mediaId && (
                <Grid item xs={12} sm={6}>
                  <Divider sx={{ my: 2 }}>{"تصویر اعلان"}</Divider>
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
                    onClick={() => handleImageClick(data?.media?.mediaUrl)}
                  >
                    <img
                      src={data?.media?.mediaUrl}
                      alt={"خطا در نمایش تصویر اعلان"}
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
              )}
              {data?.attachmentId && (
                <Grid item xs={12} sm={6}>
                  <Divider sx={{ my: 2 }}>{"پیوست اعلان"}</Divider>
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
                    onClick={() => handleImageClick(data?.attachment?.mediaUrl)}
                  >
                    <img
                      src={data?.attachment?.mediaUrl}
                      alt={"خطا در نمایش پیوست"}
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
              )}
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="error" endIcon={<CancelIcon />} onClick={handleCancel}>
              انصراف
            </Button>
          </Box>
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
export default DetailNotificationModal;