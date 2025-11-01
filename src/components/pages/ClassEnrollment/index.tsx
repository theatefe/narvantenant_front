import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// REDUX SETTER *****************************************
import { RootState } from '../../redux/reducers';
import { setIsLoading, setMetaData } from '../../redux/reducers/page';
// API **************************************************
import GetAllClassEnrollmentApi from '../../api/ClassEnrollment/GetAll';
import ChangePaymentStatusApi from '../../api/ClassEnrollment/ChangeStatus';
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
const header = ['ردیف', 'نام و نام خانوادگی', 'نام کلاس', 'وضعیت پرداخت شهریه', 'تعداد جلسات مانده', 'تاریخ ثبت'];
// Generate fake data (e.g., 100 people)
let columns = [
  {
    accessorKey: 'id',
    header: 'ردیف',
    size: 20,
  },
  {
    accessorKey: 'student',
    header: 'نام و نام خانوادگی ',
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
    accessorKey: 'remainingFee',
    header: 'مانده شهریه',
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
  const isPoolTenant = auth?.userInfo?.tenant?.type === "POOL";
  const permissions = auth.userInfo.Role.Permissions;
  const token = auth.token;
  if (!permissions.find((p) => p.operationId === 'tenantChangeStatusPaymentClassEnrollment')) {
    columns = columns.filter(i => i.accessorKey !== 'active')
  }
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
  // HANDLE STATUS CHANGE *******************************************************
  const handleStatusChange = async (id: number, paymentStatus: string) => {
    const body = {
      id,
      paymentStatus
    }
    const response = await ChangePaymentStatusApi(token, body);
    if (response.status === 403) {
      setTimeout(() => {
        window.location.href = '/';
      }, 3400);
      toast.ErrorNotify('خطای دسترسی ! شما مجوز ورود به این بخش را ندارید');

      return;
    }
    if (response.status === 200) {
      toast.SuccessNotify(`وضعیت پرداخت ${isPoolTenant ? 'شناگر' : 'دانش آموز'} بروزرسانی شد`)
      getClassEnrollmentList();
    } else {
      toast.ErrorNotify(response.data.error);
    }
  }
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
        remainingFee: item?.remainingFee + ' ریال ',
        paymentStatus: (
          <select
            defaultValue={item.paymentStatus === 'پرداخت شده' ? 'PAID' : item.paymentStatus === 'پرداخت نشده' ? 'UNPAID' : 'HALFPAID'}
            className={item.paymentStatus === 'پرداخت شده' ? 'bg-success text-center text-white rounded mx-3 p-1' : item.paymentStatus === 'پرداخت نشده' ? 'bg-danger text-center text-white rounded mx-3 p-1' : 'bg-warning text-center text-white rounded mx-3 p-1'}
            onChange={(e) => {
              handleStatusChange(item.id, e.target.value);

              // Remove all classes and then add the correct one
              e.target.classList.remove('bg-success', 'bg-danger', 'bg-warning');

              if (e.target.value === 'PAID') {
                e.target.classList.add('bg-success');
              } else if (e.target.value === 'UNPAID') {
                e.target.classList.add('bg-danger');
              } else if (e.target.value === 'HALFPAID') {
                e.target.classList.add('bg-warning');
              }
            }}
          >
            <option value="PAID" className='bg-white text-dark'>
              پرداخت شده
            </option>
            <option value="UNPAID" className='bg-white text-dark'>
              پرداخت نشده
            </option>
            <option value="HALFPAID" className='bg-white text-dark'>
              پرداخت تکمیل نشده
            </option>
          </select>
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
        title: `نارون - مدیریت کلاس بندی ${isPoolTenant ? 'شناگران' : 'دانش آموزان'}`,
        description: `مدیریت کلاس بندی ${isPoolTenant ? 'شناگران' : 'دانش آموزان'}`,
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
                <div className="col-6 text-right"><h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 float-left">مدیریت {isPoolTenant ? 'شناگران' : 'دانش آموزان'} کلاس {data && data[0]?.class}</h3></div>
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
                        {`افزودن ${isPoolTenant ? 'شناگر' : 'دانش آموز'} جدید به کلاس`}
                      </Button>
                      : null
                  }
                </div>
                <CreateClassEnrollmentModal
                  list={getClassEnrollmentList}
                  token={token}
                  isPoolTenant={isPoolTenant}
                  classId={classId}
                  id={selectedClassEnrollmentId}
                  openModal={modal}
                  setOpenModal={closeModal}
                />
                <DeleteClassEnrollmentModal
                  list={getClassEnrollmentList}
                  token={token}
                  isPoolTenant={isPoolTenant}
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