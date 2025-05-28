import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// REDUX SETTER *****************************************
import { RootState } from '../../redux/reducers';
import { setIsLoading, setMetaData } from '../../redux/reducers/page';
// API **************************************************
import GetAllPaymentsApi from '../../api/Payment/GetAll';
// MUI **************************************************
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
// MUi Icon ***************************************************
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// MUI Icon ****************************************************
import IconEdit from '../../ui/icon/IconEdit';
// component ***************************************************
import NewDataGrid from '../../ui/grid/NewDataGrid';
// MODELS ******************************************************
import CreatePaymentModal from '../../ui/modals/payment/CreatePaymentModal';
// HELPERS *****************************************************
import { numberSpace } from '../../helpers/NumberTools'
// OTHER *******************************************************
import {
  jalaliDate,
  jalaliDateWithTime,
} from '../../helpers/convertDate.helper';
// COLUMNS FOR GRID *********************************************
// GENERATE TABLE ***********************************************
const header = ['ردیف', 'نام و نام خانوادگی دانش آموز', ' کلاس', 'مبلغ پرداختی', 'تاریخ پرداخت', 'نحوه پرداخت', 'تاریخ ثبت'];
// Generate fake data (e.g., 100 people)
const columns = [
  {
    accessorKey: 'id',
    header: 'ردیف',
    size: 20,
  },
  {
    accessorKey: 'student',
    header: ' دانش‌آموز',
    size: 160,
  },
  {
    accessorKey: 'class',
    header: 'کلاس',
    size: 160,
  },
  {
    accessorKey: 'amount',
    header: 'مبلغ پرداختی',
    size: 60,
  },
  {
    accessorKey: 'paymentDate',
    header: 'تاریخ پرداخت',
    size: 60,
  },
  {
    accessorKey: 'paymentMethod',
    header: 'نحوه پرداخت',
    size: 60,
  },
  {
    accessorKey: 'paymentStatus',
    header: 'وضعیت پرداخت شهریه',
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
    size: 60,
  },
];


const PaymentList = () => {
  // REDUX *********************************************************
  const dispatch = useDispatch();
  const { auth } = useSelector((state: RootState) => state.userAuth);
  const token = auth.token;
  // STATE *********************************************************
  const [selectedPaymentId, setSelectedPaymentId] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [isLoaded, setIsloaded] = React.useState(false);
  // modal **********************************************************
  const [modal, setModal] = React.useState(false);
  // QUERY **********************************************************
  // open edit modal ************************************************
  const openEditModal = (id: number) => {
    setSelectedPaymentId(id);
    setModal(true);
  };
  // close modal ****************************************************
  const closeModal = () => {
    setSelectedPaymentId(null);
    setModal(false);
  };
  // Get PAYMENT List *************************************************
  const getPaymentsList = async () => {
    const list = await GetAllPaymentsApi(token);
    if (list.status === 200) {
      const arr = list.data.map((item, index: number) => ({
        id: index + 1,
        student: item?.student?.user?.name + ' ' + item?.student?.user?.lastName,
        class: item?.class?.name,
        amount: (
          <Tooltip title='تراکنش موفق' arrow>
            <span>
              <span className='bg-success text-white rounded px-1'>{numberSpace(item?.amount)}</span>
            </span>
          </Tooltip>
        ),
        paymentStatus: <span className={item?.class?.tuitionFee - item?.amount == 0 ? 'text-success' : 'text-danger'}>
          {item?.class?.tuitionFee - item?.amount == 0 ? 'پرداخت تکمیل شده است' : 'پرداخت تکمیل نشده است'}
        </span>,
        paymentDate: <Tooltip title={jalaliDateWithTime(item.paymentDate)} arrow>
          <span>
            {jalaliDate(item.paymentDate)}
          </span>
        </Tooltip>,
        paymentMethod: item?.paymentMethod,
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
          </>
        ),
      }));
      setData(arr);
    }
    dispatch(setIsLoading(false));
    setIsloaded(true)
  };
  // USE EFFECT *******************************************************
  React.useEffect(() => {
    dispatch(
      setMetaData({
        title: 'نارون - پرداخت شهریه دانش آموزان',
        description: ' لیست پرداخت شهریه های کل دانش آموزان',
      }),
    );
    getPaymentsList();
  }, []);
  // RETURN ************************************************************
  return (
    <Box sx={{ flexGrow: 1 }}>
      <div className="flex flex-col h-full">
        <div className="flex-grow flex items-center justify-center mt-3">
          {isLoaded ? <div className="w-full  bg-white shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            <div className="p-4">
              {/* Header Section */}
              <div className="row mb-4">
                <div className="col-6 text-right"><h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 float-left">لیست پرداخت شهریه ها</h3></div>
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
                    ثبت پرداخت جدید
                  </Button>

                </div>
                <CreatePaymentModal
                  list={getPaymentsList}
                  token={token}
                  id={selectedPaymentId}
                  openModal={modal}
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
export default PaymentList;