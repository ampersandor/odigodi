import * as React from "react";
import "./songpa.css"

function Songpa(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="3500" height="2000" viewBox="-150 -10 310 320">
        <g fill="#00394f">
            <path d={props.d} />
        </g>
        <circle fill="red" stroke="black" stroke-width="0.5" r="1" cx="10" cy="100"/>
        <circle fill="red" stroke="black" stroke-width="0.5" r="1" cx="20" cy="110"/>
        <circle fill="red" stroke="black" stroke-width="0.5" r="1" cx="30" cy="120"/>
        <circle fill="red" stroke="black" stroke-width="0.5" r="1" cx="40" cy="130"/>
        <circle fill="red" stroke="black" stroke-width="0.5" r="1" cx="50" cy="140"/>

    </svg>
  );
}

export default Songpa;