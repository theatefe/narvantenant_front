import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
// REDUX SETTER *****************************************
import { RootState } from '../../redux/reducers';
import { setIsLoading, setMetaData } from '../../redux/reducers/page';
// API **************************************************
import GetAllOrderApi from '../../api/order/GetAll';
import UpdateStatusOrderApi from '../../api/order/Update';
// MUI **************************************************
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
// TOAST ******************************************************
import * as toast from '../../ui/Toast';
// MUi Icon **************************************************
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// component ***************************************************
import NewDataGrid from '../../ui/grid/NewDataGrid';
// OTHER *******************************************************
import { numberSpace } from '../../helpers/NumberTools'
import {
  jalaliDate,
  jalaliDateWithTime,
} from '../../helpers/convertDate.helper';
// MODALS *******************************************************
import DetailOredrModal from '../../ui/modals/oredr/DetailOredrModal';
// GENERATE TABLE ***********************************************
const header = ['ردیف', 'نام و نام خانوادگی', 'شماره همراه', 'تاریخ ثبت'];
// Generate fake data (e.g., 100 people)
let columns = [
  {
    accessorKey: 'id',
    header: 'ردیف',
    size: 20,
  },
  {
    accessorKey: 'user',
    header: 'نام و نام خانوادگی',
    size: 120,
  },
  {
    accessorKey: 'phone',
    header: 'شماره تماس',
    size: 60,
  },
  {
    accessorKey: 'price',
    header: 'قیمت کل',
    size: 50,
  },
  {
    accessorKey: 'status',
    header: 'وضعیت سفارش',
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


const OrderList = () => {
  // REDUX *********************************************************
  const dispatch = useDispatch();
  const { auth } = useSelector((state: RootState) => state.userAuth);
  const isPoolTenant = auth?.userInfo?.tenant?.type === "POOL";
  const permissions = auth.userInfo.Role.Permissions;
  if (!permissions.find((p) => p.operationId === 'tenantUpdateStatusOrder')) {
    columns = columns.filter(i => i.accessorKey !== 'status')
  }
  const token = auth.token;
  // STATE *********************************************************
  const [data, setData] = React.useState([]);
  const [selectedOrderId, setSelectedOrderId] = React.useState(null);
  const [isLoaded, setIsloaded] = React.useState(false);
  // modal *********************************************************
  const [modal, setModal] = React.useState(false);
  // open modal ***************************************************
  const openModal = (id:number) => {
    setSelectedOrderId(id);
    setModal(true);
  };
  // close modal ***************************************************
  const closeModal = () => {
    setSelectedOrderId(null);
    setModal(false);
  };
  // QUERY *********************************************************
  // ***************************************************************
  // HANDLE STATUS CHANGE *************************************************
  const handleStatusChange = async (id: number, status: string) => {
    const body = {
      id,
      status
    }
    const response = await UpdateStatusOrderApi(token, body);
    if (response.status === 403) {
      setTimeout(() => {
        window.location.href = '/';
      }, 3400);
      toast.ErrorNotify('خطای دسترسی ! شما مجوز ورود به این بخش را ندارید');

      return;
    }
    if (response.status === 200) {
      toast.SuccessNotify(`وضعیت سفارش ${isPoolTenant ? 'شناگر' : 'دانش آموز'} بروزرسانی شد`)
      getOrderList();
    } else {
      toast.ErrorNotify(response.data.error);
    }
  }
  // Get order List ********************************
  const getOrderList = async () => {
    const list = await GetAllOrderApi(token);
    if (list.status === 403) {
      setTimeout(() => {
        window.location.href = '/';
      }, 3400);
      toast.ErrorNotify('خطای دسترسی ! شما مجوز ورود به این بخش را ندارید');

      return;
    }
    if (list.status === 200) {
      const arr = list.data.map((item, index: number) => {
        let orderPrice = 0;

        for (const i of item.OrderProducts) {
          orderPrice += i.unitPrice * i.total;
        }

        return {
          id: index + 1,
          user: `${item?.student?.user?.name || ''} ${item?.student?.user?.lastName || ''}`,
          phone: item?.student?.user?.mobile,
          price: <span>{numberSpace(orderPrice)} ریال</span>,
          status: (
            <select
              defaultValue={item.status === 'فعال' ? 'ACTIVE' : item.status === 'تحویل داده شده' ? 'DELIVERED': 'DEACTIVE'}
              className={item.status === 'فعال' ? 'bg-success text-white rounded mx-3' : item.status === 'تحویل داده شده' ? 'bg-warning text-white rounded mx-3' : 'bg-secondary text-white rounded mx-3'}
              onChange={(e) => {
                handleStatusChange(item.id, e.target.value);

                // Remove all classes and then add the correct one
                e.target.classList.remove('bg-success', 'bg-warning', 'bg-secondary');

                if (e.target.value === 'ACTIVE') {
                  e.target.classList.add('bg-success');
                } else if (e.target.value === 'DEACTIVE') {
                  e.target.classList.add('bg-secondary');
                } else if (e.target.value === 'DELIVERED') {
                  e.target.classList.add('bg-warning');
                }
              }}
            >
              <option value="ACTIVE" className='bg-white text-dark'>
                فعال
              </option>
              <option value="DEACTIVE" className='bg-white text-dark'>
                بسته شده
              </option>
              <option value="DELIVERED" className='bg-white text-dark'>
                تحویل داده شده
              </option>
            </select>
          ),
          date: (
            <Tooltip title={jalaliDateWithTime(item.createdAt)} arrow>
              <span>{jalaliDate(item.createdAt)}</span>
            </Tooltip>
          ),
          option: (
            <>
              {permissions.find((p) => p.operationId === 'tenantGetOrder') ?
                <Tooltip title="نمایش محصولات سفارش" arrow>
                  <span
                    className="svg-container cursor-pointer"
                    onClick={() => openModal(item.id)}
                  >
                    <ShoppingCartIcon className="svg-menu-icon" />
                  </span>
                </Tooltip>
                : null
              },
            </>
          ),
        };
      });

      setData(arr);
    }
    dispatch(setIsLoading(false));
    setIsloaded(true)
  };
  // USE EFFECT *****************************************************
  React.useEffect(() => {
    dispatch(
      setMetaData({
        title: 'نارون - مدیریت سفارشات ',
        description: ' مدیریت سفارشات فروشگاه',
      }),
    );
    getOrderList();
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
                <div className="col-6 text-right"><h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 float-left">مدیریت سفارشات </h3></div>
                <div className="col-6 text-left">
                </div>
              </div>
              <DetailOredrModal
                list={getOrderList}
                token={token}
                id={selectedOrderId}
                openModal={modal}
                setOpenModal={closeModal}
              />
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
export default OrderList;