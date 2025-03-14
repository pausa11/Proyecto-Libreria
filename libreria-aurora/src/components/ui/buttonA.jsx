import React from "react";

function ButtonA({text, onClick, width, color}) {
    return (
        <button onClick={onClick} className="text-white text-[1.5vw] font-[200] p-[1vw] rounded-[.5vw] w-full h-[5vh] flex justify-center items-center" style={{width: width, backgroundColor: color}}>
            {text}
        </ button>
    );
}

export default ButtonA;