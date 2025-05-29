import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// REDUX SETTER *****************************************
import { RootState } from '../../redux/reducers';
import { setIsLoading, setMetaData } from '../../redux/reducers/page';
// API **************************************************
import RoleListApi from '../../api/Role/GetAll';
import RoleChangeStatusApi from '../../api/Role/ChangeStatus';
// MUI **************************************************
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import Switch from '@mui/material/Switch';
// MUi Icon **************************************************
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import IconEdit from '../../ui/icon/IconEdit';
// component ***************************************************
import NewDataGrid from '../../ui/grid/NewDataGrid';
// MODELS ******************************************************
import RoleModal from '../../ui/modals/role/RoleModal';
import PermissionModal from '../../ui/modals/role/PermissionModal';
// OTHER *******************************************************
import {
  jalaliDate,
  jalaliDateWithTime,
} from '../../helpers/convertDate.helper';
// TOAST *******************************************************
import * as toast from '../../ui/Toast';
// COLUMNS FOR GRID *********************************************
// GENERATE TABLE ***********************************************
const header = ['ردیف', 'عنوان نقش', 'توضیحات', 'تاریخ ثبت'];
// Generate fake data (e.g., 100 people)
let columns = [
  {
    accessorKey: 'id',
    header: 'ردیف',
    size: 40,
  },
  {
    accessorKey: 'name',
    header: 'عنوان نقش',
    size: 120,
  },
  {
    accessorKey: 'description',
    header: 'توضیحات',
    size: 420,
  },
  {
    accessorKey: 'date',
    header: 'تاریخ ثبت',
    size: 60,
  },
  {
    accessorKey: 'active',
    header: 'وضعیت',
    size: 60,
  },
  {
    accessorKey: 'option',
    header: 'عملیات',
    size: 50,
  },
];


const RoleList = () => {
  // REDUX *********************************************************
  const dispatch = useDispatch();
  const { auth } = useSelector((state: RootState) => state.userAuth);
  const token = auth.token;
  const permissions = auth.userInfo.Role.Permissions;
  if (!permissions.find((p) => p.operationId === 'tenantUpdateRoleStatus')) {
    columns = columns.filter(i => i.accessorKey !== 'active')
  }
  // STATE *********************************************************
  const [selectedRoleId, setSelectedRoleId] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [isLoaded, setIsloaded] = React.useState(false);
  // modal *********************************************************
  const [modal, setModal] = React.useState(false);
  const [permissionModal, setPermissionModal] = React.useState(false);
  // QUERY *********************************************************
  // ***************************************************************
  // open edit modal **********************************************
  const openEditModal = (id: number) => {
    setSelectedRoleId(id);
    setModal(true);
  };
  // open edit permission modal ************************************
  const openEditPermissionModal = (id: number) => {
    setSelectedRoleId(id);
    setPermissionModal(true);
  };
  // close modal **************************************************
  const closeModal = () => {
    setSelectedRoleId(null);
    setModal(false);
  };
  // close permission modal **************************************
  const closePermissionModal = () => {
    setSelectedRoleId(null);
    setPermissionModal(false);
  };
  // Handle Change Status ******************************************
  const handleStatusChange = async (id: number) => {
    const response = await RoleChangeStatusApi(token, id);
    if (response.data && response.status == 200) {
      toast.SuccessNotify('وضعیت نقش بروزرسانی شد')
    } else {
      toast.ErrorNotify(response.data.error);
    }
  }
  // Get Role List *************************************************
  const getRoleList = async () => {
    const list = await RoleListApi(token);
    if (list.status === 200) {
      const arr = list.data.map((item, index: number) => ({
        id: index + 1,
        name: item?.name,
        description: item?.description,
        date: <Tooltip title={jalaliDateWithTime(item.createdAt)} arrow>
          <span>
            {jalaliDate(item.createdAt)}
          </span>
        </Tooltip>,
        active: (
          <Tooltip
            title={item.Users.length > 0 ? "این نقش به دلیل وجود کابران فعال، نمی تواند غیرفعال شود" : "تغییر وضعیت نقش"}
            arrow
          >
            <span>
              <Switch
                defaultChecked={item.isActive}
                onChange={() => handleStatusChange(item.id)}
                inputProps={{ 'aria-label': 'controlled' }}
                disabled={item.Users.length > 0}
              />
            </span>
          </Tooltip>
        ),
        option: (
          <>
            {permissions.find((p) => p.operationId === 'tenantUpdateRole') ?
              <Tooltip title="ویرایش" arrow>
                <span
                  className="svg-container cursor-pointer m-1"
                  onClick={() => openEditModal(item.id)}
                >
                  <IconEdit className="svg-menu-icon" />
                </span>
              </Tooltip> : null
            }
            {permissions.find((p) => p.operationId === 'tenantCreateNewPermission') ?
              <Tooltip title="مدیریت دسترسی ها" arrow>
                <span
                  className="svg-container cursor-pointer m-1"
                  onClick={() => openEditPermissionModal(item.id)}
                >
                  <LockPersonIcon className="svg-menu-icon" />
                </span>
              </Tooltip> : null
            }
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
        title: 'نارون - نقش ها و دسترسی ها',
        description: ' مدیریت نقش ها و دسترسی ها',
      }),
    );
    getRoleList();
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
                <div className="col-6 text-right"><h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 float-left">مدیریت نقش ها و دسترسی ها</h3></div>
                <div className="col-6 text-left">
                  {
                    permissions.find((p) => p.operationId === 'tenantCreatRole') ?
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
                        نقش جدید
                      </Button>
                      : null
                  }
                </div>
                <RoleModal
                  token={token}
                  id={selectedRoleId}
                  openModal={modal}
                  list={getRoleList}
                  setOpenModal={closeModal}
                />
                <PermissionModal
                  token={token}
                  id={selectedRoleId}
                  openModal={permissionModal}
                  setOpenModal={closePermissionModal}
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
export default RoleList;