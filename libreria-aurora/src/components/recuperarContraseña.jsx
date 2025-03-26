import React from "react";
import AuthFrame from "./ui/authFrame";
import InputAuora from "./ui/input";
import ButtonA from "./ui/buttonA";
import { useNavigate } from "react-router-dom";

import NavBar from "./NavBar";

function RecuperarContraseña() {

    const navigate = useNavigate();

    return(
        <div className="w-[100vw] h-[100vh] bg-[#DBDBDB]">
            
            <NavBar />

            <AuthFrame>
                <p className="text-[3vw] font-[500] w-[60%]"> Recuperar contraseña </p>
                <InputAuora type="text" placeholder="Correo electronico" value="" onChange={() => {}} />
                <ButtonA text="Recuperar Contraseña" onClick={() => {}} width="60%" color="#2B388C"/>
                <div className="flex justify-between items-center w-[60%]" onClick={() => navigate('/login')}>
                    <p style={{textAlign:'left',textDecoration:'underline',fontSize:'1vw',color:'#3B4CBF'}} >¿Ya tienes una cuenta? Inicia sesion</p>
                </div>
            </AuthFrame>
        </div>
    )
}

export default RecuperarContraseña;