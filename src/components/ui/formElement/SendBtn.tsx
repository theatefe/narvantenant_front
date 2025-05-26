import React from "react";

//import MUI
import LoadingButton from "@mui/lab/LoadingButton";
import DoneIcon from "@mui/icons-material/Done";

const style = { fontFamily: "dana", fontSize: 14 };

const SendBtn = (props: any) => {
  return (
    <LoadingButton
      sx={style}
      size="medium"
      type="submit"
      fullWidth={props.fullWidth}
      endIcon={<DoneIcon />}
      loading={props.loading}
      loadingPosition="end"
      variant="contained"
      onClick={props.click}
      color={props.color || 'primary'}
    >
      {props.name}
    </LoadingButton>
  );
};
export default SendBtn;
