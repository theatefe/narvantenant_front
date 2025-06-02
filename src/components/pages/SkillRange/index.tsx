import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// REDUX SETTER *****************************************
import { RootState } from '../../redux/reducers';
import { setIsLoading, setMetaData } from '../../redux/reducers/page';
// API **************************************************
import GetAllSkillRangeApi from '../../api/SkillRange/GetAll';
// MUI **************************************************
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
// TOAST ******************************************************
import * as toast from '../../ui/Toast';
// MUi Icon **************************************************
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconEdit from '../../ui/icon/IconEdit';
import IconTrash from '../../ui/icon/IconTrash';
import IconListCheck from '../../ui/icon/IconListCheck';
// component ***************************************************
import NewDataGrid from '../../ui/grid/NewDataGrid';
// MODELS ******************************************************
import CreateSkillRangeModal from '../../ui/modals/skillRange/CreateSkillRangeModal';
import DeleteSkillRangeModal from '../../ui/modals/skillRange/DeleteSkillRangeModal';
// OTHER *******************************************************
import {
  jalaliDate,
  jalaliDateWithTime,
} from '../../helpers/convertDate.helper';
// COLUMNS FOR GRID **************************************************
// GENERATE TABLE ***********************************************
const header = ['ردیف', 'عنوان', 'رنگ محدوده','حداقل محدوده','حداکثر محدوده', 'تاریخ ثبت'];
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
    size: 120,
  },
  {
    accessorKey: 'color',
    header: 'رنگ محدوده',
    size: 120,
  },
  {
    accessorKey: 'min',
    header: 'حداقل محدوده',
    size: 60,
  },
  {
    accessorKey: 'max',
    header: 'حداکثر محدوده',
    size: 60,
  },
  {
    accessorKey: 'date',
    header: 'تاریخ ثبت',
    size: 120,
  },
  {
    accessorKey: 'option',
    header: 'عملیات',
    size: 50,
  },
];


const SkillRangeList = () => {
  // REDUX *********************************************************
  const dispatch = useDispatch();
  const { auth } = useSelector((state: RootState) => state.userAuth);
  const permissions = auth.userInfo.Role.Permissions;
  const token = auth.token;
  // STATE *********************************************************
  const [selectedSkillRangeId, setSelectedSkillRangeId] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [isLoaded, setIsloaded] = React.useState(false);
  // modal *********************************************************
  const [modal, setModal] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  // QUERY *********************************************************
  // ***************************************************************
  // open info modal ***********************************************
  const openDeleteModal = (id: number) => {
    setSelectedSkillRangeId(id);
    setDeleteModal(true);
  };
  // open edit modal ************************************************
  const openEditModal = (id: number) => {
    setSelectedSkillRangeId(id);
    setModal(true);
  };
  // close modal ****************************************************
  const closeModal = () => {
    setSelectedSkillRangeId(null);
    setDeleteModal(false);
    setModal(false);
  };
  // Get SkillRange List ********************************
  const getSkillRangeList = async () => {
    const list = await GetAllSkillRangeApi(token);
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
        title: item.name,
        min: item?.min,
        max: item?.max,
        color: <span className='border mx-3 px-3 py-1 rounded' style={{ backgroundColor:`${item.color}` }} >
          { item.color }
        </span >,
  date: <Tooltip title={jalaliDateWithTime(item.createdAt)} arrow>
    <span>
      {jalaliDate(item.createdAt)}
    </span>
  </Tooltip>,
    option: (
      <>
        {permissions.find((p) => p.operationId === 'tenantUpdateSkillRange') ?
          <Tooltip className="mx-2" title="ویرایش" arrow>
            <span
              className="svg-container cursor-pointer"
              onClick={() => openEditModal(item.id)}
            >
              <IconEdit className="svg-menu-icon" />
            </span>
          </Tooltip>
          : null
        }
        {permissions.find((p) => p.operationId === 'tenantDeleteSkillRange') ?
          <Tooltip title="حذف" arrow>
            <span
              className="svg-container cursor-pointer"
              onClick={() => openDeleteModal(item.id)}
            >
              <IconTrash className="svg-menu-icon text-danger" />
            </span>
          </Tooltip>
          : null
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
      title: 'نارون - مدیریت محدوده مهارت مسابقات',
      description: ' مدیریت محدوده مهارت مسابقات شنا',
    }),
  );
  getSkillRangeList();
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
              <div className="col-6 text-right"><h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 float-left">مدیریت محدوده مهارت مسابقات شنا</h3></div>
              <div className="col-6 text-left">
                {
                  permissions.find((p) => p.operationId === 'tenantCreateSkillRange') ?
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
                      ثبت محدوده جدید
                    </Button>
                    : null
                }
              </div>
              <CreateSkillRangeModal
                list={getSkillRangeList}
                token={token}
                id={selectedSkillRangeId}
                openModal={modal}
                setOpenModal={closeModal}
              />
              <DeleteSkillRangeModal
                list={getSkillRangeList}
                token={token}
                id={selectedSkillRangeId}
                openModal={deleteModal}
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
export default SkillRangeList;