import React from 'react';
// API *************************************************
import AddAttendanceApi from '../../../api/Attendance/Add';
import ClassEnrollmentListApi from '../../../api/ClassEnrollment/GetAll';
// TOAST ************************************************
import * as toast from '../../../ui/Toast';
// MUI **************************************************
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
// UI ********************************************************
import { georgianDate, jalaliDate } from './../../../helpers/convertDate.helper';
import { ToInt } from './../../../helpers/NumberTools';
// MUi Icon **************************************************
// Formik & yup ************************************************
// UI     ******************************************************
import DatePickersInputWithTime from '../../formElement/DatePickerInputWithTime';
// redux seters ************************************************

// STYLE MODAL
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '95%',
    sm: 600,
    md: 800,
  },
  height: 'auto',
  maxHeight: '90vh',
  overflowY: {
    xs: 'auto',
    sm: 'auto',
    md: 'visible',
  },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
};

const CreateAttendanceModal = (props) => {
  const {
    list,
    token,
    isPoolTenant,
    classId,
    openModal,
    setOpenModal,
  } = props;

  // HOOKS FORM **************************************************
  const [students, setStudents] = React.useState([]);
  const today = new Date();
  const [selectedDate, setSelectedDate] = React.useState<Date>();
  // SUBMIT ******************************************************
  const handleAddAttendance = async (id, status) => {
    const body = {
      "classEnrollmentId": Number(id),
      "classId": Number(classId),
      "status": status,
      "createdAt": selectedDate? georgianDate(ToInt(selectedDate)) : today,
    }
    // created
    const created = await AddAttendanceApi(token, body);
    if (created.status === 200) {
      toast.SuccessNotify(`وضعیت حضور ${isPoolTenant ? 'شناگر' : 'دانش آموز'} ثبت شد`);
      handleCancel();
      list();
    } else {
      toast.ErrorNotify(created.data.error);
    }
  }
  // GET STUDENT LIST ******************************************
  const getClassEnrollments = async () => {
    try {
      const classEnrollments = await ClassEnrollmentListApi(token, classId);
      if (classEnrollments.status === 200) {
        setStudents(classEnrollments.data);
      }
    } catch (error) {
      console.error("Error loading students:", error);
      setOpenModal(false);
    }
  }
  // HANDLE CLOSE ********************************************
  const handleCancel = () => {
    setSelectedDate(null);
    setOpenModal(false);
  };
  // USE EFFECT **********************************************
  React.useEffect(() => {
    getClassEnrollments();
  }, []);
  // RETURN **************************************************
  return (
    <Modal
      open={openModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Grid container spacing={2}>
          <Grid item xs={12} className='text-center'>
            <Typography variant="h5" gutterBottom align="center">
              {`ثبت حضور و غیاب ${isPoolTenant ? 'شناگر' : 'دانش آموز'}`}
            </Typography>
            <span> تاریخ: {jalaliDate(today)} </span>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12} md={6} sx={{ mx: 'auto' }}>
              <DatePickersInputWithTime
                setSelectedDate={(date: Date) => { setSelectedDate(date); }}
                selectedDate={selectedDate}
                fullWidth
                label={`تغییر تاریخ کلاس`}
              />
            </Grid>
            <hr />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography>
                          نام و نام خانوادگی {isPoolTenant ? 'شناگر' : 'دانش آموز'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>
                          حاضر
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>
                          غایب
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>
                          باتاخیر
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <>
                        <TableRow
                          key={student.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            <Typography>
                              {student?.student?.user?.name + ' ' + student?.student?.user?.lastName}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Checkbox
                              checked={student.status === 'PRESENT'}
                              onChange={() => handleAddAttendance(student.id, 'PRESENT')}
                              color="success"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Checkbox
                              checked={student.status === 'ABSENT'}
                              onChange={() => handleAddAttendance(student.id, 'ABSENT')}
                              color="error"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Checkbox
                              checked={student.status === 'WITHDELAY'}
                              onChange={() => handleAddAttendance(student.id, 'WITHDELAY')}
                              color="warning"
                            />
                          </TableCell>
                        </TableRow>
                      </>
                    )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
            >
              انصراف
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};
export default CreateAttendanceModal;
