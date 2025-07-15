import React from 'react';

// API **************************************************
import GetStudent from '../../../api/Student/GetOne';
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
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
};

const DetailStudentModal = (props) => {
  const { token,isPoolTenant, id, openModal, setOpenModal } = props;
  // HOOKS FORM **************************************************
  const [data, setData] = React.useState(null);
  const [openImageModal, setOpenImageModal] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState('');
  // GET Student ********************************************
  const getStudent = async () => {
    if (id) {
      try {
        const student = await GetStudent(token, id);
        if (student.status === 200) {
          setData(student.data);
        } else {
          toast.ErrorNotify(student.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading student:", error);
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
    getStudent();
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
            {id && isPoolTenant ? 'شناگر' : 'دانش آموز'}
          </Typography>
          <Divider sx={{ my: 2 }}>اطلاعات شخصی</Divider>

          {/* اطلاعات شخصی */}
          <Box mb={2}>
            <Grid container spacing={3} className='text-end'>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2">
                    {"نام"} :{" "}<Typography component="span" fontWeight="bold">{data?.user?.name}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" >
                    {"نام‌خانوادگی"} : {" "}
                    <Typography component="span" fontWeight="bold">{data?.user?.lastName}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2">
                    {"جنسیت"} : {" "}
                    <Typography component="span" fontWeight="bold">{data?.user?.genderText}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2">
                    {"تاریخ تولد"} : {" "}
                    <Typography component="span" fontWeight="bold"> {jalaliDate(data?.user?.dateOfBirth) || "-"}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2">
                    {"کدملی"} : {" "}
                    <Typography component="span" fontWeight="bold">{data?.user?.nationalCode}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2">
                    {"شماره همراه"}  : {" "}
                    <Typography component="span" fontWeight="bold">{data?.user?.mobile}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2">
                    {"آدرس"}  : {" "}
                    <Typography component="span" fontWeight={data?.user?.address ? 'bold' : ''}>{data?.user?.address || "وارد نشده است."}</Typography>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/* اطلاعات والدین */}
          <Box mb={2}>
            <Divider sx={{ my: 2 }}>اطلاعات والدین</Divider>
            <Grid container spacing={4} className='text-end'>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2">
                    {"نام پدر"} :{" "}<Typography component="span" fontWeight="bold">{data?.fatherName || "-"}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2" >
                    {"تحصیلات پدر"} : {" "}
                    <Typography component="span" fontWeight="bold">{data?.fatherEducation || "-"}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2">
                    {"شغل پدر"} : {" "}
                    <Typography component="span" fontWeight="bold">{data?.fatherJob || "-"}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2">
                    {"همراه پدر"} : {" "}
                    <Typography component="span" fontWeight="bold"> {data?.fatherPhone || "-"}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2">
                    {"نام مادر"} : {" "}
                    <Typography component="span" fontWeight="bold">{data?.motherName || "-"}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2">
                    {"تحصیلات مادر"}  : {" "}
                    <Typography component="span" fontWeight="bold">{data?.motherEducation || "-"}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2">
                    {"شغل مادر"}  : {" "}
                    <Typography component="span" fontWeight="bold">{data?.motherJob || "-"}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Box>
                  <Typography variant="body2">
                    {"همراه مادر"}  : {" "}
                    <Typography component="span" fontWeight="bold">{data?.motherPhone || "-"}</Typography>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* اطلاعات تکمیلی */}
          <Box mb={2}>
            <Divider sx={{ my: 2 }}>اطلاعات تکمیلی</Divider>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2">
                    {`سطح ${isPoolTenant ? 'شناگر' : 'دانش آموز'}`} : {" "}
                    <Typography component="span" fontWeight="bold">{data?.level?.title}</Typography>
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}></Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2">
                    {"تاریخ ثبت نام"} : {" "}
                    <Typography component="span" fontWeight="bold"> {jalaliDate(data?.createdAt) || '-'}</Typography>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* گالری تصاویر */}
          <Box mb={3} mt={3}>
            <Grid container spacing={2}>
              {data?.personalImageId && (
                <Grid item xs={12} sm={4}>
                  <Divider sx={{ my: 2 }}>{"تصویر پرسنلی"}</Divider>
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
                    onClick={() => handleImageClick(data?.personalImage?.mediaUrl)}
                  >
                    <img
                      src={data?.personalImage?.mediaUrl}
                      alt={"خطا در نمایش تصویر پرسنلی"}
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
              {data?.birthCertificateImageId && (
                <Grid item xs={12} sm={4}>
                  <Divider sx={{ my: 2 }}>{"تصویر کارت ملی یا شناسنامه"}</Divider>
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
                    onClick={() => handleImageClick(data?.birthCertificateImage?.mediaUrl)}
                  >
                    <img
                      src={data?.birthCertificateImage?.mediaUrl}
                      alt={"خطا در نمایش تصویر کارت ملی یا شناسنامه"}
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
                  <Divider sx={{ my: 2 }}>{"تصویر کارت بیمه ورزشی"}</Divider>
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
                      alt={"خطا در نمایش تصویر کارت بیمه ورزشی"}
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

          <Divider sx={{ my: 3 }} />
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
export default DetailStudentModal;
