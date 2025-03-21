import React, { useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

import InputText from "./ui/input";
import ButtonA from "./ui/buttonA";
import AuthFrame from "./ui/authFrame";

function Registro() {
  const backendURL = "https://proyecto-libreria-k9xr.onrender.com/api/usuarios/";
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    tipo_usuario: "LECTOR",
    numero_identificacion: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: ""
  });

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.password2) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      const response = await fetch(backendURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: userData.email,
          username: userData.username,
          password: userData.password,
          password2: userData.password2,
          first_name: userData.first_name,
          last_name: userData.last_name,
          tipo_usuario: userData.tipo_usuario,
          numero_identificacion: userData.numero_identificacion,
          telefono: userData.telefono,
          direccion: userData.direccion,
          fecha_nacimiento: userData.fecha_nacimiento
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Detalles del error:", errorData);
        throw new Error("Error en la petición");
      }
      const data = await response.json();
      console.log("Usuario registrado:", data);
      navigate("/login");
    } catch (error) {
      console.error("Error registrando usuario:", error);
    }
  };
  

  return (
    <div className="w-[100vw] h-[100vh] bg-[#DBDBDB]">
      <NavBar />
      <AuthFrame>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-[1vw] overflow-auto">
          <p className="text-[3vw] font-[500] w-[60%]">Crear una cuenta</p>
          <InputText
            type="text"
            placeholder="Correo electrónico"
            value={userData.email}
            onChange={handleChange}
            name="email"
          />
          <InputText
            type="text"
            placeholder="Crea tu usuario"
            value={userData.username}
            onChange={handleChange}
            name="username"
          />
          <InputText
            type="password"
            placeholder="Contraseña"
            value={userData.password}
            onChange={handleChange}
            name="password"
          />
          <InputText
            type="password"
            placeholder="Confirmar contraseña"
            value={userData.password2}
            onChange={handleChange}
            name="password2"
          />
          <InputText
            type="text"
            placeholder="Nombre"
            value={userData.first_name}
            onChange={handleChange}
            name="first_name" 
          />
          <InputText
            type="text"
            placeholder="Apellido"
            value={userData.last_name}
            onChange={handleChange}
            name="last_name"
          />
          <InputText
            type="text"
            placeholder="Número de identificación"
            value={userData.numero_identificacion}
            onChange={handleChange}
            name="numero_identificacion"
          />
          <InputText
            type="text"
            placeholder="Teléfono"
            value={userData.telefono}
            onChange={handleChange}
            name="telefono"
          />
          <InputText
            type="text"
            placeholder="Dirección"
            value={userData.direccion}
            onChange={handleChange}
            name="direccion"
          />
          <InputText
            type="text"
            placeholder="Fecha de nacimiento"
            value={userData.fecha_nacimiento}
            onChange={handleChange}
            name="fecha_nacimiento"
          />

          <ButtonA text="Registrarse" type="submit" width="60%" color="#2B388C" />
          <p className="text-[1vw] font-[500]">
            ¿Ya tienes una cuenta?{" "}
            <span style={{ color: "#2B388C", cursor: "pointer" }} onClick={() => navigate("/login")} >
              Inicia sesión
            </span>
          </p>
        </form>
      </AuthFrame>
    </div>
  );
}

export default Registro;
