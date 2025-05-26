import React from 'react';

//import MUI
import LoadingButton from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
const style = { fontFamily: 'dana', fontSize: 14 };

const EditBtn = (props) => {
  return (
    <LoadingButton
      sx={style}
      size="medium"
      type="button"
      fullWidth={props.fullWidth}
      endIcon={<AddIcon />}
      loading={props.loading}
      loadingPosition="start"
      variant="contained"
      onClick={props.click}
      disabled={props.disabled}
      className={props.className}
    >
      {props.name}
    </LoadingButton>
  );
};
export default EditBtn;
