import React from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

import InputAuora from "./ui/input";
import ButtonA from "./ui/buttonA";
import AuthFrame from "./ui/authFrame";

function Registro() {

    const navigate = useNavigate();

    return(
        <div className="w-[100vw] h-[100vh] bg-[#DBDBDB]">
            
            <NavBar />
            
            <AuthFrame>
                <p className="text-[3vw] font-[500]">Registro</p>
                <InputAuora type="text" placeholder="Nombre" value="" onChange={() => {}} />
                <InputAuora type="text" placeholder="Apellido" value="" onChange={() => {}} />
                <InputAuora type="text" placeholder="Correo electronico" value="" onChange={() => {}} />
                <InputAuora type="password" placeholder="Contraseña" value="" onChange={() => {}} />
                <InputAuora type="password" placeholder="Confirmar contraseña" value="" onChange={() => {}} />
                <ButtonA text="Registrarse" onClick={() => {}} width="50%" color="#2B388C"/>
                <p className="text-[1vw] font-[500]">¿Ya tienes una cuenta? <span style={{color:'#2B388C',cursor:'pointer'}} onClick={() => navigate('/login')}>Inicia sesion</span></p>
            </AuthFrame>

        </div>
    )
}

export default Registro;