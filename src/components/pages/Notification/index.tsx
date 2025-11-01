import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// REDUX SETTER *****************************************
import { RootState } from '../../redux/reducers';
import { setIsLoading, setMetaData } from '../../redux/reducers/page';
// API **************************************************
import GetAllNotificationsApi from '../../api/Notification/GetAll';
import ChangeActiveApi from '../../api/Notification/ChangeActive';
// MUI **************************************************
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
// MUi Icon **************************************************
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconEdit from '../../ui/icon/IconEdit';
import IconTrash from '../../ui/icon/IconTrash';
import IconInfo from '../../ui/icon/IconInfoCircle';
import IconUsersGroup from '../../ui/icon/IconUsersGroup';
// component ***************************************************
import NewDataGrid from '../../ui/grid/NewDataGrid';
// TOAST ******************************************************
import * as toast from '../../ui/Toast';
// MODELS ******************************************************
import CreateNotificationModal from '../../ui/modals/notification/CreateNotificationModal';
import DeleteStudentModal from '../../ui/modals/notification/DeleteNotificationModal';
import DetailStudentModal from '../../ui/modals/notification/DetailNotificationModal';
import ReciversNotificationModal from '../../ui/modals/notification/ReciverNotificationModal';
// OTHER *******************************************************
import {
  jalaliDate,
  jalaliDateWithTime,
} from '../../helpers/convertDate.helper';
import { Chip, Switch } from '@mui/material';
// COLUMNS FOR GRID **************************************************
// GENERATE TABLE ***********************************************
const header = ['ردیف', 'عنوان', 'لینک', 'گروه مخاطب', 'نوع مخاطب', 'زمان ارسال', 'وضعیت اعلان', 'تاریخ ثبت نام'];
// Generate fake data (e.g., 100 people)
const columns = [
  {
    accessorKey: 'id',
    header: 'ردیف',
    size: 20,
  },
  {
    accessorKey: 'title',
    header: 'عنوان',
    size: 50,
  },
  {
    accessorKey: 'link',
    header: 'لینک',
    size: 50,
  },
  {
    accessorKey: 'type',
    header: 'گیرنده اعلان',
    size: 50,
  },
  {
    accessorKey: 'active',
    header: 'وضعیت',
    size: 50,
  },
  {
    accessorKey: 'date',
    header: 'تاریخ ثبت',
    size: 50,
  },
  {
    accessorKey: 'option',
    header: 'عملیات',
    size: 120,
  },
];


const NotificationList = () => {
  // REDUX *********************************************************
  const dispatch = useDispatch();
  const { auth } = useSelector((state: RootState) => state.userAuth);
  const permissions = auth.userInfo.Role.Permissions;
  const token = auth.token;
  // STATE *********************************************************
  const [selectedNotifId, setSelectedNotifId] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [isLoaded, setIsloaded] = React.useState(false);
  // modal *********************************************************
  const [modal, setModal] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [infoModal, setInfoModal] = React.useState(false);
  const [reciversModal, setReciversModal] = React.useState(false);
  // QUERY *********************************************************
  // ***************************************************************
  // open delete modal ***********************************************
  const openDeleteModal = (id: number) => {
    setSelectedNotifId(id);
    setDeleteModal(true);
  };
  // open edit modal ************************************************
  const openEditModal = (id: number) => {
    setSelectedNotifId(id);
    setModal(true);
  };
  // open info modal ***********************************************
  const openInfoModal = (id: number) => {
    setSelectedNotifId(id);
    setInfoModal(true);
  };
  // open reciver modal *********************************************
  const openReciversModal = (id: number) => {
    setSelectedNotifId(id);
    setReciversModal(true);
  }
  // close modal ****************************************************
  const closeModal = () => {
    setSelectedNotifId(null);
    setDeleteModal(false);
    setInfoModal(false);
    setReciversModal(false);
    setModal(false);
  };
  // TOGGLE ACTIVE ****************************************
  const toggleActive = async (id: number) => {
    try {
      const body = { id };
      const result = await ChangeActiveApi(token, body);
      if (result.status === 200) {
        getNotificationList();
        toast.SuccessNotify('وضعیت اعلان با موفقیت به روز رسانی شد');
        return;
      } else {
        toast.ErrorNotify(result.data.error);
      }
    } catch (e) {
      console.error("خطا در تغییر وضعیت ", e);
    }
  }
  // Get NOTIFICATION List ********************************
  const getNotificationList = async () => {
    const list = await GetAllNotificationsApi(token);
    if (list.status === 403) {
      setTimeout(() => {
        window.location.href = '/';
      }, 3400);
      toast.ErrorNotify('خطای دسترسی ! شما مجوز ورود به این بخش را ندارید');
      return;
    }
    if (list.status === 200) {
      const arr = list.data.map((item, index: number) => ({
        id: index + 1,
        title: item.title,
        link: item?.link || "-",
        type: item?.type,
        active: (
          <>
            {permissions.find((p) => p.operationId === "tenantChangeActiveNotification") ? (
              <Switch
                checked={item.active === "غیرفعال" ? false : true}
                color="success"
                onChange={() => toggleActive(item.id)}
              />) : item?.active}
          </>
        ),
        date: (
          <Tooltip title={jalaliDateWithTime(item.createdAt)} arrow>
            <span>{jalaliDate(item.createdAt)}</span>
          </Tooltip>
        ),

        option: (
          <>
            {permissions.find((p) => p.operationId === "tenantUpdateNotification") ? (
              <Tooltip className="mx-1" title="ویرایش" arrow>
                <span
                  className="svg-container cursor-pointer"
                  onClick={() => openEditModal(item.id)}
                >
                  <IconEdit className="svg-menu-icon" />
                </span>
              </Tooltip>
            ) : null}
            {permissions.find((p) => p.operationId === "tenantGetNotification") ? (
              <Tooltip className="mx-1" title="مشاهده جزئیات" arrow>
                <span
                  className="svg-container cursor-pointer"
                  onClick={() => openInfoModal(item.id)}
                >
                  <IconInfo className="svg-menu-icon" />
                </span>
              </Tooltip>
            ) : null}
            <Tooltip className="mx-1 text-dark" title=" گیرندگان اعلان" arrow>
              <Link to={`/recipients/${item.id}`}>
                <span
                  className="svg-container cursor-pointer"
                >
                  <IconUsersGroup className="svg-menu-icon" />
                </span>
              </Link>
            </Tooltip>
            {permissions.find((p) => p.operationId === "tenantDeleteNotification") ? (
              <Tooltip title="حذف" arrow>
                <span
                  className="svg-container cursor-pointer"
                  onClick={() => openDeleteModal(item.id)}
                >
                  <IconTrash className="svg-menu-icon text-danger" />
                </span>
              </Tooltip>
            ) : null}
          </>
        ),
      }));
      setData(arr);
    }
    dispatch(setIsLoading(false));
    setIsloaded(true)
  };
  // USE EFFECT *****************************************************
  React.useEffect(() => {
    dispatch(
      setMetaData({
        title: 'نارون - اعلانات',
        description: ' مدیریت اعلانات',
      }),
    );
    getNotificationList();
  }, []);
  // RETURN **********************************************************
  return (
    <Box sx={{ flexGrow: 1 }}>
      <div className="flex flex-col h-full">
        <div className="flex-grow flex items-center justify-center mt-3">
          {isLoaded ? <div className="w-full  bg-white shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <div className="p-4">
              {/* Header Section */}
              <div className="row mb-4">
                <div className="col-6 text-right"><h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 float-left">
                  {'مدیریت اعلانات'}
                </h3></div>
                <div className="col-6 text-left">
                  {
                    permissions.find((p) => p.operationId === 'tenantCreateNotification') ?
                      <Button
                        onClick={() => {
                          setModal(true);
                        }}
                        sx={{ m: 1, mb: 0, backgroundColor: '#2eb360' }}
                        color="success"
                        variant="contained"
                        disableElevation
                        endIcon={<AddCircleOutlineIcon />}
                      >
                        {'ثبت اعلان جدید'}
                      </Button> : null
                  }

                </div>
                <CreateNotificationModal
                  list={getNotificationList}
                  token={token}
                  id={selectedNotifId}
                  openModal={modal}
                  setOpenModal={closeModal}
                />
                <DeleteStudentModal
                  list={getNotificationList}
                  token={token}
                  id={selectedNotifId}
                  openModal={deleteModal}
                  setOpenModal={closeModal}
                />
                <DetailStudentModal
                  list={getNotificationList}
                  token={token}
                  id={selectedNotifId}
                  openModal={infoModal}
                  setOpenModal={closeModal}
                />
                <ReciversNotificationModal
                  list={getNotificationList}
                  token={token}
                  id={selectedNotifId}
                  openModal={reciversModal}
                  setOpenModal={closeModal}
                />
              </div>

              {/* Table Section */}
              <div className="overflow-x-auto">
                <NewDataGrid init={
                  { data, columns, header }
                } />
              </div>
            </div>
          </div> :
            <div className="w-full  bg-white shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <div className="p-4">
                {/* Header Section */}
                <div className="row mb-4">
                  <div className="col-11 text-right">
                    <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 float-left">
                      <Skeleton
                        sx={{ marginTop: '0px' }}
                        animation="wave"
                        variant="rounded"
                        width={'15%'}
                        height={40}
                      />
                    </h2></div>
                  <div className="col-1 text-left float-left">
                    <Skeleton
                      sx={{ marginTop: '0px', }}
                      animation="wave"
                      variant="rounded"
                      width={'100%'}
                      height={40}
                    />
                  </div>
                </div>
                {/* Table Section */}
                <div className="overflow-x-auto">
                  <Skeleton
                    sx={{ marginTop: '0px' }}
                    animation="wave"
                    variant="rounded"
                    width={'100%'}
                    height={650}
                  />
                </div>
              </div>
            </div>}
        </div>
      </div>
    </Box>
  );
};
export default NotificationList;