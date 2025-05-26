import React from 'react';

//import MUI
import LoadingButton from '@mui/lab/LoadingButton';
import EditIcon from '@mui/icons-material/Edit';

const style = { fontFamily: 'dana', fontSize: 16 };

const EditBtn = (props) => {
  return (
    <LoadingButton
      sx={style}
      size="medium"
      type="submit"
      startIcon={<EditIcon />}
      loading={props.loading}
      loadingPosition="start"
      variant="contained"
      onClick={props.click}
      disabled={props.disabled}
    >
      {props.name}
    </LoadingButton>
  );
};
export default EditBtn;
