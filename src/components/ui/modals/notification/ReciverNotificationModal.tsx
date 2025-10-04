import React from 'react';

// API **************************************************
import GetNotificationApi from '../../../api/Notification/GetOne';
import RemoveReciverSendTimeApi from '../../../api/Notification/RemoveReciverSendTime';
// TOAST *******************************************************
import * as toast from '../../../ui/Toast';
// MUI **************************************************
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
// MUi Icon **************************************************
import CancelIcon from '@mui/icons-material/Cancel';
import IconTrash from '../../icon/IconTrash';
// component ***************************************************
import NewDataGrid from './../../grid/NewDataGrid';
// OTHER *******************************************************
import {
  jalaliDateWithTime,
  jalaliDate,
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
// GENERATE TABLE ***********************************************
const header = ['ردیف', 'گیرنده', 'لینک', 'وضعیت ارسال', 'تاریخ ارسال'];
// Generate fake data (e.g., 100 people)
const columns = [
  {
    accessorKey: 'id',
    header: 'ردیف',
    size: 20,
  },
  {
    accessorKey: 'name',
    header: 'گیرنده',
    size: 50,
  },
  {
    accessorKey: 'status',
    header: 'وضعیت ارسال ',
    size: 50,
  },
  {
    accessorKey: 'sentAt',
    header: 'تاریخ ارسال',
    size: 50,
  },
  {
    accessorKey: 'option',
    header: 'عملیات',
    size: 120,
  },
];
const ReciversNotificationModal = (props) => {
  const { token, id, openModal, setOpenModal } = props;
  // HOOKS FORM **************************************************
  const [data, setData] = React.useState([]);
  // DELETE TIME *****************************************
  const openDeleteModal = async (selectedId: number) => {
    const body = { "userId": selectedId, "notificationId": id }
    const result = await RemoveReciverSendTimeApi(token, body);
    if (result.status === 200) {
      toast.SuccessNotify("با موفقیت حذف شد.");
      getNotification(id);
    } else {
      toast.ErrorNotify(result.message);
    }
  };
  // GET COLOR STATUS *************************************
  const getStatusColor = (status) => {
    switch (status) {
      case 'زمان‌بندی شده':
        return "info";
      case 'در حال ارسال':
        return "warning";
      case 'ارسال شده':
        return "success";
      case 'منقضی شده':
        return "default";
      case 'ارسال ناموفق':
        return "error";
      default:
        return "default";
    }
  };
  // GET NOTIFICATION ****************************************
  const getNotification = async (id) => {
    if (id) {
      try {
        const notification = await GetNotificationApi(token, id);
        if (notification.status === 200) {
          const recivers = notification.data.recivers || [];
          const list = recivers.map((item, index: number) => ({
            id: item?.user?.id,
            name: item?.user?.name + ' ' + item?.user?.lastName,
            status: (
              <Tooltip title={item.status} arrow>
                <Chip
                  label={item.status}
                  color={getStatusColor(item.status)}
                  variant="outlined"
                  sx={{ fontWeight: "bold" }}
                />
              </Tooltip>
            ),
            sentAtRaw: new Date(item.SentAt),
            sentAt: (
              <Tooltip title={jalaliDateWithTime(item.SentAt)} arrow>
                <span>{jalaliDateWithTime(item.SentAt)}</span>
              </Tooltip>
            ),
            option: (
              <>
                <Tooltip title="حذف" arrow>
                  <span
                    className="svg-container cursor-pointer"
                    onClick={() => openDeleteModal(item.id)}
                  >
                    <IconTrash className="svg-menu-icon text-danger" />
                  </span>
                </Tooltip>
              </>
            ),
          }));
          const sortedList = list.sort(
            (a, b) => a.sentAtRaw.getTime() - b.sentAtRaw.getTime()
          );
          setData(sortedList);
        }
      } catch (error) {
        console.error("Error loading notification:", error);
        setOpenModal(false);
      }
    }
  }
  // HANDLE CLOSE *****************************************
  const handleCancel = () => {
    setData([]);
    setOpenModal(false);
  };
  // USE EFFECT **********************************************
  React.useEffect(() => {
    getNotification(id);
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
            {id && 'گیرندگان و زمانبندی ارسال اعلان'}
          </Typography>
          <Divider sx={{ my: 1 }}></Divider>

          <div className="overflow-x-auto">
            <NewDataGrid init={
              { data, columns, header }
            } />
          </div>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="error" endIcon={<CancelIcon />} onClick={handleCancel}>
              انصراف
            </Button>
          </Box>
        </Box>
      </React.Fragment>
    </Modal>
  );
};
export default ReciversNotificationModal;
