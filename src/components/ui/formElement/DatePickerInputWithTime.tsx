import React from 'react';
import DatePicker, { DatePickerRef } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

//import MUI
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import ClearIcon from '@mui/icons-material/Clear';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';

const style = { fontFamily: 'dana', fontSize: 14 };

const DatePickerInputWithTime = (props: any) => {
  const datepickerRef = React.useRef<DatePickerRef>();
  // passing the ref to a DOM element,
  // so that the parent has a reference to the DOM node
  const handleSelectDate = (date) => {
    date
      ? props.setSelectedDate(date.format?.('YYYY-MM-DD HH:mm:ss').toString())
      : props.setSelectedDate(null);
  };

  const initialValue = new Date();
  initialValue.setHours(0, 0, 0, 0);
  return (
    <FormControl className="mt-0 w-100">
      <InputLabel sx={{ style }} size="small">
        {props.label}
      </InputLabel>
      <OutlinedInput
        value={props.selectedDate || ''}
        dir="rtl"
        onClick={() => datepickerRef.current.openCalendar()}
        size="small"
        margin="dense"
        sx={{ width: '100%', pr: '3px !important' }}
        endAdornment={
          <>
            <InputAdornment position="end" sx={{ p: 0, m: 0 }}>
              <IconButton
                sx={{ p: 0, m: 0 }}
                onClick={() => datepickerRef.current.openCalendar()}
                edge="end"
              >
                <CalendarMonthIcon />
              </IconButton>
            </InputAdornment>
            <InputAdornment position="end" sx={{ p: 0, m: 0 }}>
              <IconButton
                sx={{ p: 0, m: 0 }}
                onClick={() => handleSelectDate(null)}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          </>
        }
        label={props.label}
      />
      {props.selectedDate ? (
        <DatePicker
          onChange={(date) => {
            handleSelectDate(date);
          }}
          ref={datepickerRef}
          calendar={persian}
          locale={persian_fa}
          format="MM/DD/YYYY"
          plugins={[<TimePicker position="bottom" />]}
        />
      ) : (
        <DatePicker
          value={initialValue}
          onChange={(date) => {
            handleSelectDate(date);
          }}
          ref={datepickerRef}
          calendar={persian}
          locale={persian_fa}
          format="MM/DD/YYYY"
          plugins={[<TimePicker position="bottom" />]}
        />
      )}
    </FormControl>
  );
};
export default DatePickerInputWithTime;
