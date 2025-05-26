import React from 'react';

// API *************************************************
import DeleteCoachApi from '../../../api/Coach/Delete';
import GetCoachApi from '../../../api/Coach/GetOne';
// TOAST ************************************************
import * as toast from '../../../ui/Toast';
// MUI **************************************************
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
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

const DeleteCoachModal = (props) => {
  const { token, id, openModal, setOpenModal, list } = props;
  // HOOKS FORM **************************************************
  const [coach, setCoach] = React.useState(null);
  const [sending, setSending] = React.useState(false);
  // SUBMIT **************************************************
  const handleDeleteCoach = async() => {
    if (id) {
      //updated
      const body = {
        id,
      }
      const deleted = await DeleteCoachApi(token, body);
      if (deleted.status === 200) {
        toast.SuccessNotify('مربی با موفقیت از سیستم حذف شد');
        handleCancel();
        setSending(false);
        list();
      } else {
        toast.ErrorNotify(deleted.data.error);
        setSending(false);
      }
    }
  };
  // GET Coach ********************************************
  const getCoach = async () => {
    if (id) {
      try {
        const coach = await GetCoachApi(token, id);
        if (coach.status === 200) {
          setCoach(coach.data);
        } else {
          toast.ErrorNotify(coach.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading coach:", error);
        setOpenModal(false);
      }
    }
  }
  // HANDLE CLOSE *****************************************
  const handleCancel = () => {
    setOpenModal(false);
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
      <Box sx={style} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={12} alignItems="center">
          <Typography variant="h5" gutterBottom>
            {`حذف اطلاعات مربی`}
          </Typography>
        </Grid>
        <hr />
        <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
          <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
            <Typography>
              آیا برای حذف مربی <span className='text-danger'>{coach?.user?.name + ' ' + coach?.user?.lastName}</span> اطمینان دارید؟
            </Typography>
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
              color="error"
              type="submit"
              startIcon={<DeleteIcon />}
              loading={sending}
              loadingPosition="start"
              variant="contained"
              disabled={sending}
              onClick={() => handleDeleteCoach()}
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
              color="inherit"
              endIcon={<CancelIcon />}
              onClick={() => {
                handleCancel();
                setSending(false);
              }}
            >
              انصراف
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
export default DeleteCoachModal;
