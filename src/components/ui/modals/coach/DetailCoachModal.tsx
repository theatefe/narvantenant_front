import React from 'react';

// API **************************************************
import GetCoach from '../../../api/Coach/GetOne';
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
  jalaliDate,
} from '../../../helpers/convertDate.helper';
// redux seters ************************************************

// STYLE MODAL
const style = {
  position: 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
};

const DetailCoachModal = (props) => {
  const { token, id, openModal, setOpenModal } = props;
  // HOOKS FORM **************************************************
  const [data, setData] = React.useState(null);
  const [openImageModal, setOpenImageModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState('');
  // GET Coach ********************************************
  const getCoach = async () => {
    if (id) {
      try {
        const coach = await GetCoach(token, id);
        if (coach.status === 200) {
          setData(coach.data);
        } else {
          toast.ErrorNotify(coach.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading Coach:", error);
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
    getCoach();
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
            maxWidth: 900,
            bgcolor: '#fff',
            borderRadius: 4,
            boxShadow: 24,
            p: 4,
            mx: 'auto',
          }}
        >
          <Typography variant="h5" gutterBottom align="center">
            {id && `اطلاعات مربی`}
          </Typography>

          <Divider sx={{ my: 2 }}>اطلاعات شخصی</Divider>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography color="text.secondary">نام مربی:</Typography>
              <Typography fontWeight="bold">{data?.user?.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}></Grid>
            <Grid item xs={12} sm={4}>
              <Typography color="text.secondary">نام خانوادگی مربی:</Typography>
              <Typography fontWeight="bold">{data?.user?.lastName}</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography color="text.secondary">جنسیت:</Typography>
              <Typography fontWeight="bold">{data?.user?.genderText}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}></Grid>
            <Grid item xs={12} sm={4}>
              <Typography color="text.secondary">تاریخ تولد:</Typography>
              <Typography fontWeight="bold">{jalaliDate(data?.user?.dateOfBirth) || "-"}</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography color="text.secondary">کد ملی:</Typography>
              <Typography fontWeight="bold">{data?.user?.nationalCode}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}></Grid>
            <Grid item xs={12} sm={4}>
              <Typography color="text.secondary">شماره همراه:</Typography>
              <Typography fontWeight="bold">{data?.user?.mobile}</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography color="text.secondary">آدرس:</Typography>
              <Typography fontWeight="bold">{data?.user?.address || "-"}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}></Grid>
            <Grid item xs={12} sm={4}>
              <Typography color="text.secondary">وضعیت مربی:</Typography>
              <Typography fontWeight="bold" color={data?.activeStatus === "فعال" ? 'success.main' : 'error.main'}>{data?.activeStatus}</Typography>
            </Grid>


            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>اطلاعات تکمیلی</Divider>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography color="text.secondary">تاریخ صدور کارت مربیگری:</Typography>
              <Typography fontWeight="bold">
                {jalaliDate(data?.coachingCardIssueDate) || '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}></Grid>
            <Grid item xs={12} sm={4} >
              <Typography color="text.secondary">تاریخ ثبت نام:</Typography>
              <Typography fontWeight="bold">{jalaliDate(data?.createdAt)}</Typography>
            </Grid>

            {/* تصاویر */}
              <Grid container spacing={3} mt={2}>
                {data?.coachingCardImageId && (
                  <Grid item xs={12} sm={4}>
                    <Typography mb={1}>تصویر کارت مربیگری</Typography>
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
                      onClick={() => handleImageClick(data?.coachingCardImage?.mediaUrl)}
                    >
                      <img
                        src={data?.coachingCardImage?.mediaUrl}
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
                )}

                {data?.nationalCardImageId && (
                  <Grid item xs={12} sm={4}>
                    <Typography mb={1}>تصویر کارت ملی</Typography>
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
                      onClick={() => handleImageClick(data?.nationalCardImage?.mediaUrl)}
                    >
                      <img
                        src={data?.nationalCardImage?.mediaUrl}
                        alt="خطا در نمایش تصویر کارت ملی"
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

                {data?.sportsInsuranceImageId && (
                  <Grid item xs={12} sm={4}>
                    <Typography mb={1}>تصویر کارت بیمه ورزشی</Typography>
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
                      onClick={() => handleImageClick(data?.sportsInsuranceImage?.mediaUrl)}
                    >
                      <img
                        src={data?.sportsInsuranceImage?.mediaUrl}
                        alt="خطا در نمایش کارت بیمه ورزشی"
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
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="error"
              endIcon={<CancelIcon />}
              onClick={handleCancel}
            >
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
export default DetailCoachModal;
