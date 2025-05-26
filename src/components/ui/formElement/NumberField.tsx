import React, { forwardRef } from "react";

//import MUI
import TextField from "@mui/material/TextField";

const style = { fontFamily: "dana", fontSize: 14 };

const TextFieldInput = forwardRef((props: any, ref) => {
  // const digitValidate = function (ele) {
  //   const val = ele.target.value.replace(/[^0-9]/g, "");
  //   ele.target.value = props.maxLength
  //     ? val.substring(0, props.maxLength)
  //     : val;
  // };
  // passing the ref to a DOM element,
  // so that the parent has a reference to the DOM node
  return (
    <TextField
      inputProps={{ style }}
      InputLabelProps={{ style }}
      margin="normal"
      fullWidth
      defaultValue={props.defaultValue || ""}
      id={props.name}
      required={props.required}
      label={props.label}
      name={props.name}
      type="number"
      size="small"
      disabled={props.disabled}
      onChange={props.onChange}
      inputRef={ref}
    />
  );
});
export default TextFieldInput;
