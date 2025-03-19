import React from "react";

function AuthFrame({children}) {
    return (
        <div className="flex justify-center items-center w-[100%] h-[88vh]">
                <div className="flex justify-center items-center w-[40%] h-[80%] bg-[white] rounded-[.6vw] border-[.1vh] border-[black] flex-col gap-[1vw] ">
                {children}
            </div>
        </div>
    );
}

export default AuthFrame;