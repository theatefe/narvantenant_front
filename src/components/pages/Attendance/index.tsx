import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// REDUX SETTER *****************************************
import { RootState } from '../../redux/reducers';
import { setIsLoading, setMetaData } from '../../redux/reducers/page';
// API **************************************************
import GetAllAttendanceApi from '../../api/Attendance/GetAll';
import UpdateStatusAttendanceApi from '../../api/Attendance/ChangeStatus';
// TOAST ************************************************
import * as toast from '../../ui/Toast';
// MUI **************************************************
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
// MUi Icon ***************************************************
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconStar from '../../ui/icon/IconStar';
// component ***************************************************
import NewDataGrid from '../../ui/grid/NewDataGrid';
// MODELS ******************************************************
import CreateAttendanceModal from '../../ui/modals/attendance/CreateAttendanceModal';
import CommentAttendanceModal from '../../ui/modals/attendance/CommentAttendanceModal';
// OTHER *******************************************************
import {
  jalaliDate,
  jalaliDateWithTime,
} from '../../helpers/convertDate.helper';
// COLUMNS FOR GRID **************************************************
// GENERATE TABLE ***********************************************
const header = ['ردیف', 'نام و نام خانوادگی', 'مربی', 'وضعیت حضور', 'تاریخ ثبت'];
// Generate fake data (e.g., 100 people)
let columns = [
  {
    accessorKey: 'id',
    header: 'ردیف',
    size: 20,
  },
  {
    accessorKey: 'student',
    header: 'نام و نام خانوادگی',
    size: 200,
  },
  {
    accessorKey: 'coach',
    header: 'مربی',
    size: 160,
  },
  {
    accessorKey: 'status',
    header: 'وضعیت حضور',
    size: 50,
  },
  {
    accessorKey: 'date',
    header: 'تاریخ ثبت',
    size: 60,
  },
  {
    accessorKey: 'option',
    header: 'عملیات',
    size: 60,
  },
];


const AttendanceList = () => {
  // PARAMS *******************************************************
  const { classId } = useParams();
  // REDUX *********************************************************
  const dispatch = useDispatch();
  const { auth } = useSelector((state: RootState) => state.userAuth);
  const isPoolTenant = auth?.userInfo?.tenant?.type === "POOL";
  const permissions = auth.userInfo.Role.Permissions;
  if (!permissions.find((p) => p.operationId === 'tenantUpdateStatusAttendance')) {
    columns = columns.filter(i => i.accessorKey !== 'status')
  }
  const token = auth.token;
  // STATE *********************************************************
  const [data, setData] = React.useState([]);
  const [selectedAttendanceId, setSelectedAttendanceId] = React.useState(null);
  const [isLoaded, setIsloaded] = React.useState(false);
  // modal *********************************************************
  const [modal, setModal] = React.useState(false);
  const [commentModal, setCommentModal] = React.useState(false);
  // QUERY *********************************************************
  // ***************************************************************
  // open comment Modal ********************************************
  const openCommentModal = (id) => {
    setSelectedAttendanceId(id);
    setCommentModal(true);
  }
  // close modal ***************************************************
  const closeModal = () => {
    setCommentModal(false);
    setModal(false);
  };
  // HANDLE STATUS CHANGE *************************************************
  const handleStatusChange = async (id: number, status: string) => {
    const body = {
      id,
      status
    }
    const response = await UpdateStatusAttendanceApi(token, body);
    if (response.status === 403) {
      setTimeout(() => {
        window.location.href = '/';
      }, 3400);
      toast.ErrorNotify('خطای دسترسی ! شما مجوز ورود به این بخش را ندارید');

      return;
    }
    if (response.status === 200) {
      toast.SuccessNotify(`وضعیت حضور ${isPoolTenant? 'شناگر':'دانش آموز'} بروزرسانی شد`)
      getAttendanceList();
    } else {
      toast.ErrorNotify(response.data.error);
    }
  }
  // Get ATTENDANCE List **************************************************
  const getAttendanceList = async () => {
    const list = await GetAllAttendanceApi(token, Number(classId));
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
        student: item?.classEnrollment?.student?.user?.name + ' ' + item?.classEnrollment?.student?.user?.lastName,
        class: item?.classs?.name,
        coach: item.coach ? item?.coach?.user?.name + ' ' + item?.coach?.user?.lastName : 'حضور توسط مدیر انجام شده است',
        status: (
         <select
  defaultValue={item.status === 'حاضر' ? 'PRESENT' : item.status === 'غایب' ? 'ABSENT' : 'WITHDELAY'}
  className={item.status === 'حاضر' ? 'bg-success text-white rounded mx-3' : item.status === 'غایب' ? 'bg-danger text-white rounded mx-3' : 'bg-secondary text-white rounded mx-3'}
  onChange={(e) => {
    handleStatusChange(item.id, e.target.value);

    // Remove all classes and then add the correct one
    e.target.classList.remove('bg-success', 'bg-danger', 'bg-secondary');

    if (e.target.value === 'PRESENT') {
      e.target.classList.add('bg-success');
    } else if (e.target.value === 'ABSENT') {
      e.target.classList.add('bg-danger');
    } else if (e.target.value === 'WITHDELAY') {
      e.target.classList.add('bg-secondary');
    }
  }}
>
  <option value="PRESENT" className='bg-white text-dark'>
    حاضر
  </option>
  <option value="ABSENT" className='bg-white text-dark'>
    غایب
  </option>
  <option value="WITHDELAY" className='bg-white text-dark'>
    با تاخیر
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
            <Tooltip title="ثبت امتیاز و عملکرد" arrow>
              <span
                className="svg-container cursor-pointer"
                onClick={() => openCommentModal(item.id)}
              >
                <IconStar className="svg-menu-icon text-warning" />
              </span>
            </Tooltip>
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
        title: `نارون - حضور و غیاب ${isPoolTenant? 'شناگران':'اندانش آموز'}`,
        description: ` مدیریت حضور و غیاب ${isPoolTenant ? 'شناگران' : 'اندانش آموز'}`,
      }),
    );
    getAttendanceList();
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
                <div className="col-6 text-right"><h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 float-left">مدیریت حضور و غیاب کلاسی {data && data[0]?.class}</h3></div>
                <div className="col-6 text-left">
                  {
                    permissions.find((p) => p.operationId === 'tenantCreateAttendance') ?
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
                        ثبت حضور و غیاب جدید
                      </Button>
                      : null
                  }
                </div>
                <CreateAttendanceModal
                  list={getAttendanceList}
                  token={token}
                  isPoolTenant={isPoolTenant}
                  classId={classId}
                  openModal={modal}
                  setOpenModal={closeModal}
                />
                <CommentAttendanceModal
                  list={getAttendanceList}
                  token={token}
                  isPoolTenant={isPoolTenant}
                  id={selectedAttendanceId}
                  openModal={commentModal}
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
export default AttendanceList;