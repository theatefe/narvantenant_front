import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// REDUX SETTER *****************************************
import { RootState } from '../../redux/reducers';
import { setIsLoading, setMetaData } from '../../redux/reducers/page';
// API **************************************************
import GetAllStudentApi from '../../api/Student/GetAll';
// MUI **************************************************
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
// MUi Icon **************************************************
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconEdit from '../../ui/icon/IconEdit';
import IconTrash from '../../ui/icon/IconTrash';
// component ***************************************************
import NewDataGrid from '../../ui/grid/NewDataGrid';
// MODELS ******************************************************
import CreateStudentModal from '../../ui/modals/student/CreateStudentModal';
import DeleteStudentModal from '../../ui/modals/student/DeleteStudentModal';
// OTHER *******************************************************
import {
  jalaliDate,
  jalaliDateWithTime,
} from '../../helpers/convertDate.helper';
// COLUMNS FOR GRID **************************************************
// GENERATE TABLE ***********************************************
const header = ['ردیف', 'نام و نام خانوادگی', 'جنسیت', 'کدملی', 'موبایل', 'تاریخ ثبت نام'];
// Generate fake data (e.g., 100 people)
const columns = [
  {
    accessorKey: 'id',
    header: 'ردیف',
    size: 20,
  },
  {
    accessorKey: 'fullName',
    header: 'نام و نام خانوادگی',
    size: 60,
  },
  {
    accessorKey: 'gender',
    header: 'جنسیت',
    size: 60,
  },
  {
    accessorKey: 'nationalCode',
    header: 'کد ملی',
    size: 60,
  },
  {
    accessorKey: 'mobile',
    header: 'موبایل',
    size: 60,
  },
  {
    accessorKey: 'date',
    header: 'تاریخ ثبت نام',
    size: 60,
  },
  {
    accessorKey: 'option',
    header: 'عملیات',
    size: 50,
  },
];


const StudentList = () => {
  // REDUX *********************************************************
  const dispatch = useDispatch();
  const { auth } = useSelector((state: RootState) => state.userAuth);
  const token = auth.token;
  // STATE *********************************************************
  const [selectedStudentId, setSelectedStudentId] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [isLoaded, setIsloaded] = React.useState(false);
  // modal *********************************************************
  const [modal, setModal] = React.useState(false);
  const [deleteModal, setDeleteModal] = React.useState(false);
  // QUERY *********************************************************
  // ***************************************************************
  // open info modal ***********************************************
  const openDeleteModal = (id: number) => {
    setSelectedStudentId(id);
    setDeleteModal(true);
  };
  // open edit modal ************************************************
  const openEditModal = (id: number) => {
    setSelectedStudentId(id);
    setModal(true);
  };
  // close modal ****************************************************
  const closeModal = () => {
    setSelectedStudentId(null);
    setDeleteModal(false);
    setModal(false);
  };
  // Get STUDENT List ********************************
  const getStudentList = async () => {
    const list = await GetAllStudentApi(token);
    if (list.status === 200) {
      const arr = list.data.map((item, index: number) => ({
        id: index + 1,
        fullName: item?.user?.name +' '+ item?.user?.lastName,
        gender: item?.user?.genderText,
        nationalCode: item?.user?.nationalCode,
        mobile: item?.user?.mobile,
        date: <Tooltip title={jalaliDateWithTime(item.createdAt)} arrow>
          <span>
            {jalaliDate(item.createdAt)}
          </span>
        </Tooltip>,
        option: (
          <>
            <Tooltip className="mx-2" title="ویرایش" arrow>
              <span
                className="svg-container cursor-pointer"
                onClick={() => openEditModal(item.id)}
              >
                <IconEdit className="svg-menu-icon" />
              </span>
            </Tooltip>
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
      setData(arr);
    }
    dispatch(setIsLoading(false));
    setIsloaded(true)
  };
  // USE EFFECT *****************************************************
  React.useEffect(() => {
    dispatch(
      setMetaData({
        title: 'نارون - دانش آموزان',
        description: ' مدیریت دانش آموزان',
      }),
    );
    getStudentList();
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
                <div className="col-6 text-right"><h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 float-left">مدیریت دانش آموزان</h3></div>
                <div className="col-6 text-left">
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
                    ثبت نام دانش آموز جدید
                  </Button>

                </div>
                <CreateStudentModal
                  list={getStudentList}
                  token={token}
                  id={selectedStudentId}
                  openModal={modal}
                  setOpenModal={closeModal}
                />
                <DeleteStudentModal
                  list={getStudentList}
                  token={token}
                  id={selectedStudentId}
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
export default StudentList;