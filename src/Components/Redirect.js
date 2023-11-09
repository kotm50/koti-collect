import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Redirect() {
  const navi = useNavigate();
  useEffect(() => {
    navi("/collect");
  });
  return <div>Redirect</div>;
}

export default Redirect;
