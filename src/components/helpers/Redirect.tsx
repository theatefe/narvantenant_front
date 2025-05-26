import { useNavigate } from "react-router-dom";
import React from "react";


const Redirect = (props) => {
  const navigate = useNavigate();
  const target = props.route ? props.route : -1;
  React.useEffect(() => {
    navigate(target);
  });
  return <></>
};
export default Redirect;