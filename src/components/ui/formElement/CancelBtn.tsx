import React from 'react';

//import MUI
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';

const style = { fontFamily: 'dana', fontSize: 14 };

const CancelBtn = (props) => {
  return (
    <Button
      variant="contained"
      data-dismiss="modal"
      color="error"
      sx={style}
      size="medium"
      className="float-right"
      endIcon={<CancelIcon sx={{ mr: 1 }} />}
      fullWidth={props.fullWidth}
      onClick={props.onClick}
    >
      {props.name}
    </Button>
  );
};
export default CancelBtn;
