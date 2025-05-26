import React from "react";

//import MUI
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const style = { fontFamily: "dana", fontSize: 14 };

const TextFieldInput = (props) => {
  return (
    <Autocomplete
      disablePortal
      fullWidth
      defaultValue={props.defaultValue || null}
      options={props.options}
      size="small"
      onChange={(event, item) => {
        item ? props.setValue(item.value) : props.setValue(null);
        if (props.action) {
          props.action();
        }
      }}
      renderInput={(params) => (
        <TextField
          margin="normal"
          fullWidth
          id={props.name}
          name={props.name}
          type="text"
          {...params}
          size="small"
          label={props.label}
          InputLabelProps={{ style }}
        />
      )}
    />
  );
};
export default TextFieldInput;
