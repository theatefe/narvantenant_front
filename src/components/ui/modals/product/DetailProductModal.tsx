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

// MUi Icon **************************************************
import CancelIcon from '@mui/icons-material/Cancel';
// OTHER *******************************************************
import { numberSpace } from '../../../helpers/NumberTools'
import {
  jalaliDateWithTime,
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
  // GET Product ********************************************
  const getProduct = async () => {
    if (id) {
      try {
        const product = await GetProductApi(token, id);
        if (product.status === 200) {
          console.log(product.data);
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
      <Box sx={style} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={12} alignItems="center">
          <Typography variant="h5" gutterBottom>
            {id && `جزئیات محصول: ${data?.title} `}
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
                {jalaliDateWithTime(data?.createdAt)}
              </span>
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
    </Modal>
  );
};
export default DetailCourseLevelCatModal;
