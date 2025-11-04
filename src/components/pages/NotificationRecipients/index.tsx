import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// REDUX SETTER *****************************************
import { RootState } from '../../redux/reducers';
import { setIsLoading, setMetaData } from '../../redux/reducers/page';
// API **************************************************
import GetNotificationApi from '../../api/Notification/GetOne';
import GetAllRecipientsApi from '../../api/NotificationRecipient/GetAll';
import GetAllCoachApi from '../../api/Coach/GetAll';
import GetAllClassesApi from '../../api/Class/GetAll';
import GetAllClassEnrollmentApi from '../../api/ClassEnrollment/GetAll';
import CreateRecipientApi from '../../api/NotificationRecipient/Add';
import DeleteRecipientApi from '../../api/NotificationRecipient/Delete';
// MUI **************************************************
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
// MUi Icon **************************************************
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
// Formik & yup ************************************************
import { useFormik } from 'formik';
import * as Yup from 'yup';
// component ***************************************************
import NewDataGrid from '../../ui/grid/NewDataGrid';
// UI ********************************************************
import DatePickersInput from '../../ui/formElement/DatePickerInputWithTime';
// TOAST ******************************************************
import * as toast from '../../ui/Toast';
// OTHER *******************************************************
import {
  georgianDate,
  jalaliDate,
  jalaliDateWithTime,
} from '../../helpers/convertDate.helper';
import { ToInt } from './../../helpers/NumberTools';
import { Chip, Switch } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
// COLUMNS FOR GRID *********************************************
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
    accessorKey: 'user',
    header: 'گیرنده',
    size: 50,
  },
  {
    accessorKey: 'status',
    header: 'وضعیت ارسال',
    size: 50,
  },
  {
    accessorKey: 'date',
    header: 'تاریخ ارسال',
    size: 50,
  },
  {
    accessorKey: 'option',
    header: 'عملیات',
    size: 120,
  },
];


const NotificationRecipientsList = () => {
  // PARAMS *******************************************************
  const { notifId } = useParams();
  // REDUX *********************************************************
  const dispatch = useDispatch();
  const { auth } = useSelector((state: RootState) => state.userAuth);
  const permissions = auth.userInfo.Role.Permissions;
  const token = auth.token;
  // STATE *********************************************************
  const [isPublic, setIsPulic] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [isLoaded, setIsloaded] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [coaches, setCoaches] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [students, setStudents] = React.useState([]);
  const [recivers, setRecivers] = React.useState([]);
  // QUERY *********************************************************
  // ***************************************************************
  // Get Notification Api ******************************
  const getNotification = async () => {
    const notification = await GetNotificationApi(token, Number(notifId));
    if (notification.data.type === "همه افراد") {
      setIsPulic(true);
    } else {
      setIsPulic(false);
    }
  }
  // Delete Recipient Function **************************
  const deleteRecipientFun = async (id: number) => {
    setSending(true);
    const body = {
      "id": id,
      "notificationId": Number(notifId),
    }
    const response = await DeleteRecipientApi(token, body);
    if (response.status === 200) {
      toast.SuccessNotify('عملیات با موفقیت انجام شد');
      getRecipientList();
    } else {
      toast.ErrorNotify('خطا در حذف');
    }
    setSending(false);
  };
  // GET COLOR STATUS *************************************
  const getStatusColor = (status) => {
    switch (status) {
      case 'زمان‌بندی شده':
        return "info";
      case 'در حال ارسال':
        return "warning";
      case 'ارسال شده':
        return "success";
      case 'منقضی شده':
        return "default";
      case 'ارسال ناموفق':
        return "error";
      default:
        return "default";
    }
  };
  // Get Recepients List ********************************
  const getRecipientList = async () => {
    const list = await GetAllRecipientsApi(token, Number(notifId));
    if (list.status === 403) {
      setTimeout(() => {
        window.location.href = '/';
      }, 3400);
      toast.ErrorNotify('خطای دسترسی ! شما مجوز ورود به این بخش را ندارید');
      return;
    }
    if (list.status === 200) {
      const arr = list.data.map((item, index: number) => ({
        id: item.id,
        user: item.user.name + ' ' + item.user.lastName,
        status: (
          <Tooltip title={item.status} arrow>
            <Chip
              label={item.status}
              color={getStatusColor(item.status)}
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          </Tooltip>
        ),
        date: (
          <Tooltip title={jalaliDateWithTime(item.SentAt)} arrow>
            <span>{jalaliDateWithTime(item.SentAt)}</span>
          </Tooltip>
        ),

        option: (
          <>
            {permissions.find((p) => p.operationId === "tenantDeleteNotification") ? (
              <Tooltip title="حذف" arrow>
                <span
                  className="svg-container cursor-pointer"
                  onClick={() => deleteRecipientFun(item.id)}
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
  //Get Coach List ********************************
  const getCoachList = async () => {
    const list = await GetAllCoachApi(token);
    if (list.status === 200) {
      setCoaches(list.data);
    }
  };
  // Get Class List ********************************
  const getClassList = async () => {
    const list = await GetAllClassesApi(token);
    if (list.status === 200) {
      setClasses(list.data);
    }
    dispatch(setIsLoading(false));
    setIsloaded(true)
  };
  // Get Student List ********************************
  const getStudentList = async (classId: number) => {
    const list = await GetAllClassEnrollmentApi(token, classId);
    if (list.status === 200) {
      setStudents(list.data);
    }
  };
  // Handle Select Student ***************************
  const handleSelect = async (userId: any) => {
    const student = students.find((s) => s.student.user.id === userId);
    if (student && !recivers.find((r) => r.id === userId)) {
      setRecivers((prev) => [...prev, student.student.user]);
    }
  }
  // Handle Select Coach ***************************
  const handleSelectCoach = async (userId: any) => {
    const choach = coaches.find((s) => s.user.id === userId);
    if (choach && !recivers.find((r) => r.id === userId)) {
      setRecivers((prev) => [...prev, choach.user]);
    }
  }
  // Handle Delete Receiver ***************************
  const handleDelete = async (userId: any) => {
    setRecivers((prev) => prev.filter((r) => r.id !== userId));
  }
  // SUBMIT **************************************************
  const submitForm = async (values) => {
    if (!isPublic&& recivers.length === 0) {
      toast.ErrorNotify(" حداقل یک گیرنده را انتخاب کنید.");
      setSending(false);
      return;
    }
    const body = {
      "notificationId": Number(notifId),
      "userType": values.userType || null,
      "classId": values.classId || null,
      "startDate": georgianDate(ToInt(values.startDate)),
      "endDate": values.endDate ? georgianDate(ToInt(values.endDate)) : null,
      "recivers": recivers,
    }
    // created
    const created = await CreateRecipientApi(token, body);
    if (created.status === 200) {
      toast.SuccessNotify("با موفقیت به لیست اضافه شد");
      formik.resetForm();
      setSending(false);
      setRecivers([]);
      getRecipientList();
    } else {
      toast.ErrorNotify(created.data.error);
      setSending(false);
    }
  }
  // FORMIK *******************************************************
  const formik = useFormik({
    initialValues: {
      classId: "",
      userType: "",
      startDate: null,
      endDate: null,
    },
    validationSchema: Yup.object({
      startDate: Yup.string()
        .required("تاریخ و ساعت ارسال الزامی است")
        .nullable(),
    }),
    onSubmit: (values) => {
      setSending(true);
      submitForm(values);
    },
  });
  // USE EFFECT *****************************************************
  React.useEffect(() => {
    dispatch(
      setMetaData({
        title: 'نارون - گیرندگان ارسال',
        description: ' مدیریت گیرندگان و زمانبندی ارسال اعلان',
      }),
    );
    getNotification();
    getRecipientList();
    getCoachList();
    getClassList();
  }, []);
  // RETURN **********************************************************

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <div className="flex flex-col h-full">
          <div className="flex-grow flex items-center justify-center mt-3">
            <div className="w-full  bg-white shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <div className="p-4">
                {/* Header Section */}
                <div className="row mb-4">
                  <div className="col-6 text-right"><h4 className="text-2xl font-bold text-gray-700 dark:text-gray-200 float-left">
                    {'ثبت گیرندگان و زمان ارسال'}
                  </h4></div>
                  <div className="overflow-x-auto">
                    {
                      permissions.find((p) => p.operationId === 'tenantCreateNotification') ?
                        <>
                          <hr />
                          <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
                              {isPublic ? (<></>) : (
                                <>
                                  <Grid item xs={6} md={4} sx={{ mx: 'auto', my: 'auto' }}>
                                    <TextField
                                      fullWidth
                                      select
                                      label="انتخاب مخاطب  *"
                                      variant="outlined"
                                      name="userType"
                                      value={formik.values.userType}
                                      onChange={(e) => { formik.handleChange(e) }}
                                      onBlur={formik.handleBlur}
                                      error={formik.touched.userType && Boolean(formik.errors.userType)}
                                      helperText={formik.touched.userType && formik.errors.userType}
                                      size="small"
                                    >
                                      <MenuItem value={'COACH'}>مربیان </MenuItem>
                                      <MenuItem value={'STUDENT'}>شناگران </MenuItem>
                                    </TextField>
                                  </Grid>
                                  <Grid item xs={6} md={8} sx={{ mx: 'auto', my: 'auto', display: formik.values.userType === 'COACH' ? 'block' : 'none' }}>
                                    <TextField
                                      fullWidth
                                      select
                                      label="انتخاب مربی *"
                                      variant="outlined"
                                      name="recivers"
                                      size="small"
                                      onChange={(e) => handleSelectCoach(e.target.value)}
                                    >
                                      {coaches && coaches.map((item) => {
                                        return (
                                          <MenuItem key={item?.user?.id} value={item?.user?.id}>مربی : {item?.user?.name + ' ' + item?.user?.lastName}</MenuItem>
                                        )
                                      })}
                                    </TextField>
                                  </Grid>
                                  <Grid item xs={6} md={4} sx={{ mx: 'auto', my: 'auto', display: formik.values.userType !== 'COACH' ? 'block' : 'none' }}>
                                    <TextField
                                      fullWidth
                                      select
                                      label="انتخاب کلاس *"
                                      variant="outlined"
                                      name="classId"
                                      value={formik.values.classId}
                                      onChange={(e) => { formik.handleChange(e), getStudentList(Number(e.target.value)) }}
                                      onBlur={formik.handleBlur}
                                      error={formik.touched.classId && Boolean(formik.errors.classId)}
                                      helperText={formik.touched.classId && formik.errors.classId}
                                      size="small"
                                    >
                                      {classes && classes.map((item) => {
                                        return (
                                          <MenuItem key={item.id} value={item.id}>کلاس {item?.name}</MenuItem>
                                        )
                                      })}
                                    </TextField>
                                  </Grid>
                                  <Grid item xs={6} md={4} sx={{ mx: 'auto', my: 'auto', display: formik.values.userType !== 'COACH' ? 'block' : 'none' }}>
                                    <TextField
                                      fullWidth
                                      select
                                      label="انتخاب شناگران"
                                      variant="outlined"
                                      name="recivers"
                                      size="small"
                                      onChange={(e) => handleSelect(e.target.value)}
                                    >
                                      {students.map((item) => (
                                        <MenuItem key={item?.student?.user?.id} value={item?.student?.user?.id}>شناگر : {item?.student?.user?.name + ' ' + item?.student?.user?.lastName}</MenuItem>
                                      ))}
                                    </TextField>
                                  </Grid>
                                  <Grid item xs={12} md={12} sx={{ mx: 'auto', display: recivers.length > 0 ? 'block' : 'none' }}>
                                    <Divider>گیرندگان انتخاب شده</Divider>
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                      {recivers.map((item) => (
                                        <Chip
                                          key={item.id}
                                          label={item?.name + ' ' + item?.lastName}
                                          onDelete={() => handleDelete(item.id)}
                                        />
                                      ))}
                                    </Box>
                                    <Divider>زمانبندی ارسال </Divider>
                                  </Grid>
                                </>
                              )}
                              <Grid item xs={6} md={6} sx={{ mx: 'auto' }}>
                                <DatePickersInput
                                  setSelectedDate={(date: Date) => {
                                    formik.setFieldValue('startDate', date);
                                  }}
                                  selectedDate={formik.values.startDate}
                                  fullWidth
                                  label={`تاریخ شروع ارسال `}
                                />
                                {formik.touched.startDate && typeof formik.errors.startDate === 'string' && (
                                  <div className="text-danger mx-3 mt-1" style={{ fontSize: '11px' }}>{formik.errors.startDate}</div>
                                )}
                              </Grid>
                              <Grid item xs={6} md={6} sx={{ mx: 'auto' }}>
                                <DatePickersInput
                                  setSelectedDate={(date: Date) => {
                                    formik.setFieldValue('endDate', date);
                                  }}
                                  selectedDate={formik.values.endDate}
                                  fullWidth
                                  label={`تاریخ پایان ارسال `}
                                />
                                {formik.touched.endDate && typeof formik.errors.endDate === 'string' && (
                                  <div className="text-danger mx-3 mt-1" style={{ fontSize: '11px' }}>{formik.errors.endDate}</div>
                                )}
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Grid item xs={12} sx={{ mx: 'auto' }}>
                                <hr />
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                            >
                              <Grid item xs={6}>
                                <LoadingButton
                                  size="medium"
                                  color="success"
                                  type="submit"
                                  startIcon={<SendIcon />}
                                  loading={sending}
                                  loadingPosition="start"
                                  variant="contained"
                                  disabled={sending}
                                >
                                  افزودن به لیست
                                </LoadingButton>
                              </Grid>
                              <Grid
                                item
                                xs={6}
                                display="flex"
                                justifyContent="flex-end"
                                alignItems="flex-end"
                              >
                                <Button
                                  className="float-left"
                                  variant="contained"
                                  endIcon={<CancelIcon />}
                                  color='inherit'
                                  onClick={() => {
                                    setSending(false);
                                    formik.resetForm();
                                    setRecivers([]);
                                  }}
                                >
                                  پاک کردن دیتا
                                </Button>
                              </Grid>
                            </Grid>
                          </form>
                        </>
                        : <></>}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <div className="flex flex-col h-full">
          <div className="flex-grow flex items-center justify-center mt-3">
            {isLoaded ? <div className="w-full  bg-white shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <div className="p-4">
                <div className="row mb-1">
                  <div className="col-6 text-right"><h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 float-left">
                    {'لیست گیرندگان و زمانبندی ارسال اعلان'}
                  </h3></div>
                </div>
              </div>
              {/* Table Section */}
              <div className="overflow-x-auto">
                <NewDataGrid init={
                  { data, columns, header }
                } />
              </div>
            </div > :
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
              </div>
            }
          </div >
        </div >
      </Box >
    </>
  );
};
export default NotificationRecipientsList;