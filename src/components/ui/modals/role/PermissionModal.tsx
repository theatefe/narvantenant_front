import React from 'react';

// API *************************************************
import AddPermissionApi from '../../../api/Role/Permission/Add';
import DeletePermissionApi from '../../../api/Role/Permission/Delete';
import AllRoutesApi from '../../../api/Role/Permission/GetAll';
import GetRoleApi from '../../../api/Role/GetOne';
// TOAST ************************************************
import * as toast from '../../../ui/Toast';
// MUI **************************************************
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
// MUi Icon **************************************************
import CancelIcon from '@mui/icons-material/Cancel';
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

const PermissionModal = (props) => {
  const { token, id, openModal, setOpenModal } = props;
  // HOOKS FORM **************************************************
  const [role, setRole] = React.useState(null);
  const [allRoutes, setAllRoutes] = React.useState([]);
  // Get Role *****************************************************
  const getRole = async () => {
    if (!id) return
    try {
      const role = await GetRoleApi(token, id);
      const routes = await AllRoutesApi(token);
      if (role.status === 200) {
        setRole(role.data);
        setAllRoutes(routes.data)
      } else {
        toast.ErrorNotify(role.data.error);
      }
    } catch (error) {
      console.error("Error loading Role:", error);
    }
  }
  // HANDLE CLOSE *****************************************
  const handleCancel = () => {
    setOpenModal(false);
    setRole(null);
  };
  // handle change status *****************************************
  const handleStatusChange = async (status: boolean, operationId: string) => {
    // Call your API to change the status
    if (status) {
      const response = await AddPermissionApi(token, { operationId, roleId: id });
      if (response.data && response.status === 200) {
        // Update the state with the new status
        toast.SuccessNotify(' دسترسی برای نقش باز شد')
      } else {
        toast.ErrorNotify('خطا! مجدد تلاش کنید');
      }

    }
    else {
      const response = await DeletePermissionApi(token, { operationId, roleId: id });
      if (response.data && response.status === 200) {
        // Update the state with the new status
        toast.WarnNotify(' دسترسی برای نقش حذف شد')
      } else {
        toast.ErrorNotify('خطا! مجدد تلاش کنید');
      }
    }

  };
  // USE EFFECT **********************************************
  React.useEffect(() => {
    getRole();
  }, [id]);
  // RETURN **************************************************
  return (
    <Modal
      open={openModal}
      onClose={handleCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} justifyContent="center" alignItems="center">
        {role ? <>
          <Grid item xs={12} md={12} alignItems="center">
            <Typography variant="h5" gutterBottom>
              ویرایش دسترسی های نقش : {role.name}
            </Typography>
          </Grid>
          <hr />
          <Grid className='permission-list' item xs={12} md={12} alignItems="center">
            {
              allRoutes && allRoutes.map((item, index) =>
                <Grid container sx={{
                  justifyContent: "center",
                }} columns={{ xs: 12, sm: 12, md: 12 }} key={index}>
                  <Grid item xs={12} md={12}
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }} className='p-3 bg-success text-white' >
                    {item.group}
                  </Grid>
                  <Grid item xs={11} md={11} className='mt-2' >
                    {
                      item.routes.map((route, index) =>
                        <Grid container className='border-top' columns={{ xs: 12, sm: 12, md: 12 }} key={index}>
                          <Grid item xs={1} md={1} className='mt-2' >
                            {index + 1}
                          </Grid>
                          <Grid item xs={9} md={9} className='mt-2' >
                            - {route.title}
                          </Grid>
                          <Grid item xs={2} md={2} className='mb-3' >
                            <Switch
                              defaultChecked={!!role.Permissions.find(e => e.operationId === route.operationId)}
                              onChange={(e) => handleStatusChange(e.target.checked, route.operationId)}
                              inputProps={{ 'aria-label': 'controlled' }}
                            />
                          </Grid>
                        </Grid>
                      )
                    }
                  </Grid>

                </Grid>
              )
            }
          </Grid>
        </> : 'در حال دریافت اطلاعات'}

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
              بستن
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
export default PermissionModal;
