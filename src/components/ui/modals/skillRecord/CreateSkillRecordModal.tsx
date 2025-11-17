import React from 'react';

// API *************************************************
import SkillRedordUpdateApi from '../../../api/SkillRecord/Update';
import SkillRecordCreateApi from '../../../api/SkillRecord/Add';
import GetSkillRecordApi from '../../../api/SkillRecord/GetOne';
import GetAllStudentApi from '../../../api/Student/GetAll';
import GetAllClass from '../../../api/Class/GetAll';
import GetAllClassEnrollment from '../../../api/ClassEnrollment/GetAll';
import GetAllSkillApi from '../../../api/Skill/GetAll';
// TOAST ************************************************
import * as toast from '../../../ui/Toast';
// MUI **************************************************
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
// MUi Icon **************************************************
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
// UI ********************************************************
import { georgianDate, jalaliDate } from './../../../helpers/convertDate.helper';
import { ToInt } from './../../../helpers/NumberTools';
import DatePickersInputWithTime from '../../formElement/DatePickerInputWithTime';
// Formik & yup ************************************************
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
    xs: 'visible',
    sm: 'auto',
    md: 'visible',
  },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
};

const CreateCourseLevelCatModal = (props) => {
  const { token, id, openModal, setOpenModal, list } = props;
  // HOOKS FORM **************************************************
  const [sending, setSending] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [skills, setSkills] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [students, setStudents] = React.useState([]);
  const today = new Date();
  const [selectedDate, setSelectedDate] = React.useState(null);
  // FORMIK *******************************************************
  const formik = useFormik({
    initialValues: {
      studentId: "",
      skillId: "",
      record: "",
      classId: "",
      selectedDate: "",
      selectedDateChanged: false,
    },
    validationSchema: Yup.object({
      classId: Yup.string()
        .required("انتخاب کلاس الزامی است"),
      studentId: Yup.string()
        .required("انتخاب شناگر الزامی است"),
      skillId: Yup.string()
        .required("انتخاب ماده الزامی است"),
      record: Yup.string()
        .required("وارد کردن رکورد الزامی است")
        .matches(
          /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-9]{2}$/,
          "رکورد باید با فرمت 00:00:00 باشد (تا 99 ثانیه مجاز است)"
        ),
      selectedDate: Yup.string()
        .required("انتخاب تاریخ الزامی است"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      setSending(true);
      submitForm(values);
      resetForm();
    },
  });
  // SUBMIT *******************************************************
  const submitForm = async (values) => {
    const bodyRequest = {
      "classId": values.classId,
      "studentId": values.studentId,
      "skillId": values.skillId,
      "record": values.record,
      "createdAt": values.selectedDateChanged ? georgianDate(ToInt(values.selectedDate)) : today,
    }
    if (id) {
      //updated
      const body = { ...bodyRequest, id }
      const updated = await SkillRedordUpdateApi(token, body);
      if (updated.status === 200) {
        toast.SuccessNotify('رکورد با موفقیت بروزرسانی شد');
        handleCancel();
        setSending(false);
        list()
      } else {
        toast.ErrorNotify(updated.data.error);
        setSending(false);
      }
    } else {
      // created
      const body = { ...bodyRequest }
      const created = await SkillRecordCreateApi(token, body);
      if (created.status === 200) {
        toast.SuccessNotify("رکورد جدید با موفقیت ثبت شد");
        handleCancel();
        setSending(false);
        list();
      } else {
        toast.ErrorNotify(created.data.error);
        setSending(false);
      }
    }
  };
  // GET SkillRecord *********************************************
  const getSkillRecord = async () => {
    if (id) {
      try {
        const skillRecord = await GetSkillRecordApi(token, id);
        if (skillRecord.status === 200) {
          formik.setValues({
            studentId: skillRecord.data.studentId || "",
            skillId: skillRecord.data.skillId || "",
            record: skillRecord.data.record || "",
            classId: skillRecord.data.classId || "",
            selectedDate: jalaliDate(skillRecord.data.createdAt) || null,
            selectedDateChanged: false,
          });
          setData(skillRecord.data);
        } else {
          toast.ErrorNotify(skillRecord.data.error);
          setOpenModal(false);
        }
      } catch (error) {
        console.error("Error loading skillRecord:", error);
        setOpenModal(false);
      }
    } else {
      formik.resetForm();
    }
  }
  // GET Students ************************************************
  const getStudents = async (classId) => {
    try {
      const students = await GetAllClassEnrollment(token, classId);
      if (students.status === 200) {
        setStudents(students.data);
      } else {
        toast.ErrorNotify(students.data.error);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error loading students:", error);
      setOpenModal(false);
    }
  }
  // GET Classes ************************************************
  const getClasses = async () => {
    try {
      const classes = await GetAllClass(token);
      if (classes.status === 200) {
        setClasses(classes.data);
      } else {
        toast.ErrorNotify(classes.data.error);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error loading classes:", error);
      setOpenModal(false);
    }
  }
  // GET Skills **************************************************
  const getSkills = async () => {
    try {
      const skills = await GetAllSkillApi(token);
      if (skills.status === 200) {
        setSkills(skills.data);
      } else {
        toast.ErrorNotify(skills.data.error);
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error loading skills:", error);
      setOpenModal(false);
    }
  }
  // HANDLE CLOSE ************************************************
  const handleCancel = () => {
    formik.resetForm();
    setOpenModal(false);
  };
  // USE EFFECT **************************************************
  React.useEffect(() => {
    getClasses();
    getSkills();
    getSkillRecord();
  }, [id]);
  // RETURN ******************************************************
  return (
    <Modal
      open={openModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={12} alignItems="center">
          <Typography variant="h5" gutterBottom>
            {id ? `ویرایش رکورد ${data?.student?.user?.name + ' ' + data?.student?.user?.lastName}` : ` ثبت رکورد جدید`}
          </Typography>
        </Grid>
        <hr />
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12 }}>
            <Grid item xs={6} md={6} sx={{ mx: 'auto', my: 'auto' }}>
              <TextField
                fullWidth
                select
                label="انتخاب کلاس آموزشی *"
                variant="outlined"
                name="classId"
                value={formik.values.classId}
                onChange={(e) => { formik.handleChange(e), getStudents(e.target.value) }}
                onBlur={formik.handleBlur}
                error={formik.touched.classId && Boolean(formik.errors.classId)}
                helperText={formik.touched.classId && formik.errors.classId}
                size="small"
              >
                {classes && classes.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}> {item?.name}</MenuItem>
                  )
                })}
              </TextField>
            </Grid>
            <Grid item xs={6} md={6} sx={{ mx: 'auto', my: 'auto' }}>
              <TextField
                fullWidth
                select
                label="انتخاب شناگر *"
                variant="outlined"
                name="studentId"
                value={formik.values.studentId}
                onChange={(e) => { formik.handleChange(e) }}
                onBlur={formik.handleBlur}
                error={formik.touched.studentId && Boolean(formik.errors.studentId)}
                helperText={formik.touched.studentId && formik.errors.studentId}
                size="small"
              >
                {students && students.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.studentId}>
                      {item?.student?.user?.name + ' ' + item?.student?.user?.lastName}</MenuItem>
                  )
                })}
              </TextField>
            </Grid>
            <Grid item xs={4} md={4} sx={{ mx: 'auto', my: 'auto' }}>
              <TextField
                fullWidth
                select
                label="انتخاب ماده *"
                variant="outlined"
                name="skillId"
                value={formik.values.skillId}
                onChange={(e) => { formik.handleChange(e) }}
                onBlur={formik.handleBlur}
                error={formik.touched.skillId && Boolean(formik.errors.skillId)}
                helperText={formik.touched.skillId && formik.errors.skillId}
                size="small"
              >
                {skills && skills.map((item) => {
                  return (
                    <MenuItem key={item.id} value={item.id}> {item?.title + ' - ' + item?.area + 'متر'}</MenuItem>
                  )
                })}
              </TextField>
            </Grid>
            <Grid item xs={4} md={4} sx={{ mx: 'auto' }}>
              <TextField
                fullWidth
                label={`رکورد *`}
                variant="outlined"
                name="record"
                placeholder='00:00:00'
                value={formik.values.record}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.record && Boolean(formik.errors.record)}
                helperText={formik.touched.record && formik.errors.record}
                size="small"
              />
            </Grid>
            <Grid item xs={4} md={4} sx={{ mx: 'auto' }}>
              <DatePickersInputWithTime
                setSelectedDate={(date: Date) => {
                  formik.setFieldValue('selectedDate', date);
                  formik.setFieldValue('selectedDateChanged', true);
                }}
                selectedDate={formik.values.selectedDate}
                fullWidth
                label={`تاریخ ثبت رکورد`}
              />
              {formik.touched.selectedDate && typeof formik.errors.selectedDate === 'string' && (
                <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.selectedDate}</div>
              )}
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} sx={{ mx: 'auto', p: 1 }}>
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
                تایید
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
                color="error"
                onClick={() => {
                  handleCancel();
                  setSending(false);
                }}
              >
                انصراف
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};
export default CreateCourseLevelCatModal;
