import React from 'react';

// API **************************************************
import CreateCommentAttendanceApi from '../../../api/Attendance/Update';
import GetAttendanceApi from '../../../api/Attendance/GetOne';
// TOAST *******************************************************
import * as toast from '../../../ui/Toast';
// MUI **************************************************
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
// Formik & yup ************************************************
import { useFormik } from 'formik';
import * as Yup from 'yup';
// MUi Icon **************************************************
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
// OTHER *******************************************************
import IconStar from '../../../ui/icon/IconStar';
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

const CommentAttendanceModal = (props) => {
  const {
 list,isPoolTenant, token, id, openModal, setOpenModal
} = props;
  // HOOKS FORM **************************************************
  const [data, setData] = React.useState(null);
  const [score, setScore] = React.useState(0);
  const [hoverScore, setHoverScore] = React.useState(0);
  const [sending, setSending] = React.useState(false);
  // HANDLE CLOSE *****************************************
  const handleCancel = () => {
    setScore(null);
    setOpenModal(false);
  };
  // HANDLE SET SCORE ********************************************
  const handleSetScore = (score) => {
    setScore(Number(score));
  }
  // HANDLE MOUDE CLICK *******************************************
  const handleMouseEnter = (hoverScore) => {
    setHoverScore(hoverScore);
  };
  const handleMouseLeave = () => {
    setHoverScore(0);
  };
  const getStarClass = (starNumber) => {
    const currentRating = hoverScore || score;
    return currentRating >= starNumber ? "svg-menu-icon text-warning" : "svg-menu-icon text-warning";
  };
  const getStarFill = (starNumber) => {
    const currentRating = hoverScore || score;
    return currentRating >= starNumber ? "orange" : "none";
  }
  // FORMIK *******************************************************
  const formik = useFormik({
    initialValues: {
      description: "",
    },
    validationSchema: Yup.object({
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
      "id": id,
      "score": score,
      "comment": values.description,
    }
    const commented = await CreateCommentAttendanceApi(token, body);
    if (commented.status === 200) {
      toast.SuccessNotify(`امتیاز ${isPoolTenant?'شناگر':'دانش آموز'} با موفقیت ثبت شد`);
      handleCancel();
      setSending(false);
      list()
    } else {
      toast.ErrorNotify(commented.data.error);
      setSending(false);
    }
  }
  // GET ATTANDENCE ******************************************
  const getAttendance = async () => {
    if (id) {
      const result = await GetAttendanceApi(token, id);
      if (result.status === 200) {
        setData(result.data);
        setScore(result.data.score);
        getStarClass(result.data.score);
        getStarFill(result.data.score);
        formik.setValues({
          description: result.data.comment || "",
        })
      }
    }
  }
  // USE EFFECT **********************************************
  React.useEffect(() => {
    getAttendance();
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
            {` ثبت امتیاز و عملکرد${isPoolTenant ? 'شناگر' : 'دانش آموز'} ${data?.classEnrollment?.student?.user?.name + ' ' + data?.classEnrollment?.student?.user?.lastName}`}
          </Typography>
        </Grid>
        <hr />
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`توضیحاتی برای عملکرد ${isPoolTenant ? 'شناگر' : 'دانش آموز'} بنویسید ... `}
                variant="outlined"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                size="small"
                rows={4}
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }} className='text-center'>
              <span>ثبت امتیاز: </span>
              {[5, 4, 3, 2, 1].map((starNumber) => (
                <Tooltip
                  key={starNumber}
                  className='mx-1'
                  title={
                    starNumber === 5 ? "عالی" :
                      starNumber === 4 ? "خوب" :
                        starNumber === 3 ? "متوسط" :
                          starNumber === 2 ? "ضعیف" : "خیلی ضعیف"
                  }
                  arrow
                >
                  <span
                    className="svg-container cursor-pointer"
                    onClick={() => handleSetScore(starNumber)}
                    onMouseEnter={() => handleMouseEnter(starNumber)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <IconStar className={getStarClass(starNumber)} fill={getStarFill(starNumber)} />
                  </span>
                </Tooltip>
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
    </Modal>
  );
};
export default CommentAttendanceModal;
