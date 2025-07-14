import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// REDUX SETTER *****************************************
import { RootState } from '../../redux/reducers';
import { setIsLoading, setMetaData } from '../../redux/reducers/page';
// API **************************************************
import GetAllPlanApi from '../../api/Plan/GetAll';
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
// component ***************************************************
import NewDataGrid from '../../ui/grid/NewDataGrid';
// MODELS ******************************************************
import CreatePlanModal from '../../ui/modals/plan/CreatePlanModal';
import DeletePlanModal from '../../ui/modals/plan/DeletePlanModal';
// OTHER *******************************************************
import {
  jalaliDate,
  jalaliDateWithTime,
} from '../../helpers/convertDate.helper';
// COLUMNS FOR GRID *********************************************
// GENERATE TABLE ***********************************************
const header = ['ردیف', 'عنوان', 'نوع', 'دانش آموز', 'تاریخ ثبت'];
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
    accessorKey: 'status',
    header: 'نوع',
    size: 120,
  },
  {
    accessorKey: 'student',
    header: 'دانش آموز',
    size: 120,
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


const ProductCatList = () => {
  // REDUX *********************************************************
  const dispatch = useDispatch();
  const { auth } = useSelector((state: RootState) => state.userAuth);
  const permissions = auth.userInfo.Role.Permissions;
  const token = auth.token;
  // STATE *********************************************************
  const [selectedCatId, setSelectedCatId] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [isLoaded, setIsloaded] = React.useState(false);
  // modal *********************************************************
  const [modal, setModal] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  // QUERY *********************************************************
  // ***************************************************************
  // open info modal ***********************************************
  const openDeleteModal = (id: number) => {
    setSelectedCatId(id);
    setDeleteModal(true);
  };
  // open edit modal ************************************************
  const openEditModal = (id: number) => {
    setSelectedCatId(id);
    setModal(true);
  };
  // close modal ****************************************************
  const closeModal = () => {
    setSelectedCatId(null);
    setDeleteModal(false);
    setModal(false);
  };
  // Get product Categories List ********************************
  const getPlanList = async () => {
    const list = await GetAllPlanApi(token);
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
        status: item?.status === 'PUBLIC' ? 'عمومی' : 'خصوصی',
        student: item?.studentId !== null ? item?.student?.user?.name + ' ' + item?.student?.user?.lastName : "-",
        date: <Tooltip title={jalaliDateWithTime(item.createdAt)} arrow>
          <span>
            {jalaliDate(item.createdAt)}
          </span>
        </Tooltip>,
        option: (
          <>
            {/* {permissions.find((p) => p.operationId === 'tenantUpdatePlan') ? */}
            <Tooltip className="mx-2" title="ویرایش" arrow>
              <span
                className="svg-container cursor-pointer"
                onClick={() => openEditModal(item.id)}
              >
                <IconEdit className="svg-menu-icon" />
              </span>
            </Tooltip>
            {/*: null
             }
            {permissions.find((p) => p.operationId === 'tenantDeletePlan') ? */}
            <Tooltip title="حذف" arrow>
              <span
                className="svg-container cursor-pointer"
                onClick={() => openDeleteModal(item.id)}
              >
                <IconTrash className="svg-menu-icon text-danger" />
              </span>
            </Tooltip>
            {/* : null
            } */}
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
        title: 'نارون - مدیریت برنامه های غذایی ',
        description: ' مدیریت برنامه های غذایی',
      }),
    );
    getPlanList();
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
                <div className="col-6 text-right"><h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 float-left">مدیریت برنامه های غذایی </h3></div>
                <div className="col-6 text-left">
                  {
                    //permissions.find((p) => p.operationId === 'tenantCreatePlan') ?
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
                      ثبت برنامه جدید
                    </Button>
                    //: null
                  }
                </div>
                <CreatePlanModal
                  list={getPlanList}
                  token={token}
                  id={selectedCatId}
                  openModal={modal}
                  setOpenModal={closeModal}
                />
                <DeletePlanModal
                  list={getPlanList}
                  token={token}
                  id={selectedCatId}
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
export default ProductCatList;