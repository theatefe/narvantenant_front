import React from "react";

//import MUI
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";

const style = { fontFamily: "dana", fontSize: 14 };

const CancelBtn = (props) => {
  return (
    <Button
      sx={style}
      size="small"
      className={props.className}
      variant="contained"
      endIcon={<CancelIcon />}
      color="error"
      onClick={props.onClick}
    >
      {props.name}
    </Button>
  );
};
export default CancelBtn;
