import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// REDUX SETTER *****************************************
import { RootState } from '../../redux/reducers';
import { setIsLoading, setMetaData } from '../../redux/reducers/page';
// API **************************************************
import GetAllClassEnrollmentApi from '../../api/ClassEnrollment/GetAll';
// MUI **************************************************
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
// MUi Icon ***************************************************
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconTrash from '../../ui/icon/IconTrash';
import IconDollarSign from '../../ui/icon/IconDollarSignCircle';
// TOAST ******************************************************
import * as toast from '../../ui/Toast';
// component ***************************************************
import NewDataGrid from '../../ui/grid/NewDataGrid';
// MODELS ******************************************************
import CreateClassEnrollmentModal from '../../ui/modals/classEnrollment/CreateClassEnrollmentModal';
import DeleteClassEnrollmentModal from '../../ui/modals/classEnrollment/DeleteClassEnrollmentModal';
// OTHER *******************************************************
import {
  jalaliDate,
  jalaliDateWithTime,
} from '../../helpers/convertDate.helper';
// COLUMNS FOR GRID **************************************************
// GENERATE TABLE ***********************************************
const header = ['ردیف', 'نام و نام خانوادگی دانش آموز', 'نام کلاس', 'وضعیت پرداخت شهریه', 'تعداد جلسات مانده', 'تاریخ ثبت'];
// Generate fake data (e.g., 100 people)
const columns = [
  {
    accessorKey: 'id',
    header: 'ردیف',
    size: 20,
  },
  {
    accessorKey: 'student',
    header: 'نام و نام خانوادگی دانش‌آموز',
    size: 200,
  },
  {
    accessorKey: 'class',
    header: 'عنوان کلاس',
    size: 120,
  },
  {
    accessorKey: 'paymentStatus',
    header: 'وضعیت پرداخت شهریه',
    size: 120,
  },
  {
    accessorKey: 'remainingSessions',
    header: 'تعداد جلسات مانده',
    size: 60,
  },
  {
    accessorKey: 'date',
    header: 'تاریخ ثبت',
    size: 60,
  },
  {
    accessorKey: 'option',
    header: 'عملیات',
    size: 50,
  },
];


const ClassEnrollmentList = () => {
  // PARAMS *******************************************************
  const { classId } = useParams();
  // REDUX *********************************************************
  const dispatch = useDispatch();
  const { auth } = useSelector((state: RootState) => state.userAuth);
  const permissions = auth.userInfo.Role.Permissions;
  const token = auth.token;
  // STATE *********************************************************
  const [selectedClassEnrollmentId, setSelectedClassEnrollmentId] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [isLoaded, setIsloaded] = React.useState(false);
  // modal *********************************************************
  const [modal, setModal] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  // QUERY *********************************************************
  // ***************************************************************
  // open info modal ***********************************************
  const openDeleteModal = (id: number) => {
    setSelectedClassEnrollmentId(id);
    setDeleteModal(true);
  };
  // close modal ****************************************************
  const closeModal = () => {
    setSelectedClassEnrollmentId(null);
    setDeleteModal(false);
    setModal(false);
  };
  // Get ClASS ENROLLMENT List **************************************************
  const getClassEnrollmentList = async () => {
    const list = await GetAllClassEnrollmentApi(token, Number(classId));
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
        student: item?.student?.user?.name + ' ' + item?.student?.user?.lastName,
        class: item?.class?.name,
        remainingSessions: item?.remainingSessions + ' جلسه ',
        paymentStatus: (
          <>
            <span
              className={item?.paymentStatus == 'پرداخت شده' ? "bg-success text-white px-2 py-1 rounded" : item?.paymentStatus == 'پرداخت نشده' ? "bg-danger text-white px-2 py-1 rounded" : "bg-warning text-dark px-2 py-1 rounded"}
            >
              {item?.paymentStatus}
            </span>
          </>
        ),
        date: <Tooltip title={jalaliDateWithTime(item.createdAt)} arrow>
          <span>
            {jalaliDate(item.createdAt)}
          </span>
        </Tooltip>,
        option: (
          <>
            {permissions.find((p) => p.operationId === 'tenantGetStudentPaymentList') ?
              <Tooltip className="mx-1" title="لیست پرداختی‌ها" arrow>
                <Link to={`/classEnrollmentPays/${item?.id}`}>
                <span
                  className="svg-container cursor-pointer"
                >
                    <IconDollarSign className="svg-menu-icon text-dark" />
                  </span>
                </Link>
              </Tooltip>
              : null
            }
            {permissions.find((p) => p.operationId === 'tenantDeleteClassEnrollment') ?
              <Tooltip title="حذف" arrow>
                <span
                  className="svg-container cursor-pointer"
                  onClick={() => openDeleteModal(item?.id)}
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
  // USE EFFECT ***********************************************************
  React.useEffect(() => {
    dispatch(
      setMetaData({
        title: 'نارون - مدیریت کلاس‌بندی دانش آموزان',
        description: ' مدیریت کلاس‌بندی دانش آموزان',
      }),
    );
    getClassEnrollmentList();
  }, []);
  // RETURN ****************************************************************
  return (
    <Box sx={{ flexGrow: 1 }}>
      <div className="flex flex-col h-full">
        <div className="flex-grow flex items-center justify-center mt-3">
          {isLoaded ? <div className="w-full  bg-white shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <div className="p-4">
              {/* Header Section */}
              <div className="row mb-4">
                <div className="col-6 text-right"><h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 float-left">مدیریت دانش آموزان کلاس {data && data[0]?.class}</h3></div>
                <div className="col-6 text-left">
                  {
                    permissions.find((p) => p.operationId === 'tenantCreateClassEnrollment') ?
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
                        افزودن دانش‌آموز جدید به کلاس
                      </Button>
                      : null
                  }
                </div>
                <CreateClassEnrollmentModal
                  list={getClassEnrollmentList}
                  token={token}
                  classId={classId}
                  id={selectedClassEnrollmentId}
                  openModal={modal}
                  setOpenModal={closeModal}
                />
                <DeleteClassEnrollmentModal
                  list={getClassEnrollmentList}
                  token={token}
                  classId={classId}
                  id={selectedClassEnrollmentId}
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
export default ClassEnrollmentList;