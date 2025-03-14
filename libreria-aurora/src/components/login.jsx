import React from "react";
import NavBar from "./NavBar";

import InputAuora from "./ui/input";
import ButtonA from "./ui/buttonA";
import AuthFrame from "./ui/authFrame";

import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    return(
        <div className="w-[100vw] h-[100vh] bg-[#DBDBDB]">
            
            <NavBar />

            <AuthFrame>
                <p className="text-[3vw] font-[500]">Inicio de sesion</p>
                <InputAuora type="text" placeholder="Correo electronico" value="" onChange={() => {}} />
                <InputAuora type="password" placeholder="Contraseña" value="" onChange={() => {}} />
                <div className="flex justify-between items-center w-[50%]" onClick={() => navigate('/recuperarContraseña')}>
                    <p style={{textAlign:'left',textDecoration:'underline',fontSize:'1vw'}} >¿Olvidaste tu contraseña?</p>
                </div>
                <ButtonA text="Iniciar sesion" onClick={() => {}} width="50%" color="#2B388C"/>
                <ButtonA text="Registrarse" onClick={() => navigate('/registro')} width="50%" color="#E8BD83"/>
            </AuthFrame>

        </div>
    )
};

export default Login;