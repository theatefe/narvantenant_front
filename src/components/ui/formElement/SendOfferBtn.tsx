import React from "react";

//import MUI
import LoadingButton from "@mui/lab/LoadingButton";
import DoneIcon from "@mui/icons-material/Done";

const style = { fontFamily: "dana", fontSize: 14 };

const SendBtn = (props) => {
  return (
    <LoadingButton
      sx={style}
      size="small"
      type="submit"
      className={props.className}
      endIcon={<DoneIcon />}
      loading={props.loading}
      loadingPosition="end"
      variant="contained"
      onClick={props.click}
    >
      {props.name}
    </LoadingButton>
  );
};
export default SendBtn;
