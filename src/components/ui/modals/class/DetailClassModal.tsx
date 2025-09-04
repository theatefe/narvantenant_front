import React from 'react';

// API **************************************************
import GetTenant from '../../../api/CourseLevelCat/GetOne';
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
import {
  jalaliDateWithTime,
} from '../../../helpers/convertDate.helper';
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

const DetailCourseLevelCatModal = (props) => {
  const { token, id, openModal, setOpenModal } = props;
  // HOOKS FORM **************************************************
  const [data, setData] = React.useState(null);
  // GET Tenant ********************************************
  const getTenant = async () => {
    if (id) {
      try {
        const tenant = await GetTenant(token, id);
        if (tenant.status === 200) {
          const info = {
            name: tenant.data.name || "",
            packageId: tenant.data.packageId || "",
            tenantType: tenant.data.tenantType || "",
            logoId: null,
            phoneNumber: tenant.data.phoneNumber || "",
            address: tenant.data.address || "",
            managerName: tenant.data.managerName || "",
            instagramUrl: tenant.data.instagramUrl || "",
            websiteUrl: tenant.data.websiteUrl || "",
            createdAt: tenant.data.createdAt || "",
          };
          setData(info);
        } else {
          toast.ErrorNotify(tenant.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading Tenant:", error);
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
    getTenant();
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
            {id && `اطلاعات مجموعه: ${data?.tenantType} ${data?.name} `}
          </Typography>
        </Grid>
        <hr />
        <form>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <span className={"text-secondary"}>
                نام مجموعه  : {"  "}
              </span>
              <span>
                {`   ${data?.name}`}
              </span>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <span className={"text-secondary"}>
                نوع مجموعه  : {"  "}
              </span>
              <span>
                {`${data?.tenantType}`}
              </span>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <span className={"text-secondary"}>
                مدیریت مجموعه  : {" "}
              </span>
              <span>
                {data?.managerName}
              </span>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <span className={"text-secondary"}>
                شناسه پکیج : {" "}
              </span>
              <span>
                {data?.packageId}
              </span>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <span className={"text-secondary"}>
                شماره تماس : {" "}
              </span>
              <span>
                {data?.phoneNumber || "وارد نشده است"}
              </span>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <span className={"text-secondary"}>
                آیدی اینستاگرام : {" "}
              </span>
              <span>
                {data?.instagramUrl || "وارد نشده است"}
              </span>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <span className={"text-secondary"}>
                آدرس سایت : {" "}
              </span>
              <span>
                {data?.websiteUrl || "وارد نشده است"}
              </span>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <span className={"text-secondary"}>
                نشانی: {" "}
              </span>
              <span>
                {data?.address || "وارد نشده است"}
              </span>
            </Grid>
            <Grid item xs={12} md={12} sx={{ mx: 'auto' }}>
              <span className={"text-secondary"}>
                تاریخ ثبت مجموعه : {" "}
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
