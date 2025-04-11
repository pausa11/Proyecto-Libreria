import React, { useState } from "react";
import AuthFrame from "./ui/authFrame";
import InputAuora from "./ui/input";
import ButtonA from "./ui/buttonA";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

import NavBar from "./NavBar";

function RecuperarContraseña() {
  const backendURL = "https://proyecto-libreria-k9xr.onrender.com/api/usuarios/recuperar_contraseña/";
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error("Por favor ingresa tu correo electrónico");
      return;
    }

    try {
      const response = await fetch(backendURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Error: " + (errorData.message || "Error en la petición"));
        return;
      }

      toast.success("Se ha enviado un correo para recuperar la contraseña");
      navigate("/login");
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
      toast.error("Error al enviar la petición");
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-[#DBDBDB]">
      <NavBar />
      <Toaster />
      <AuthFrame>
        <p className="text-[3vw] font-[500] w-[60%]"> Recuperar contraseña </p>
        <InputAuora
          type="text"
          placeholder="Correo electronico"
          value={email}
          onChange={handleChange}
        />
        <ButtonA
          text="Recuperar Contraseña"
          onClick={handleSubmit}
          width="60%"
          color="#2B388C"
        />
        <div
          className="flex justify-between items-center w-[60%]"
          onClick={() => navigate("/login")}
        >
          <p
            style={{
              textAlign: "left",
              textDecoration: "underline",
              fontSize: "1vw",
              color: "#3B4CBF"
            }}
          >
            ¿Ya tienes una cuenta? Inicia sesion
          </p>
        </div>
      </AuthFrame>
    </div>
  );
}

export default RecuperarContraseña;
