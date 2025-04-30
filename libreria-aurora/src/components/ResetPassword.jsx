import React, { useState, useEffect } from "react";
import AuthFrame from "./ui/authFrame";
import InputAuora from "./ui/input";
import ButtonA from "./ui/buttonA";
import { useNavigate, useLocation } from "react-router-dom";
import { Toaster, toast } from "sonner";
import NavBar from "./NavBar";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const validateTokenUrl = "https://proyecto-libreria-k9xr.onrender.com/api/usuarios/validar_token/";
  const resetPasswordUrl = "https://proyecto-libreria-k9xr.onrender.com/api/usuarios/restablecer_contraseña/";

  useEffect(() => {
    // Extraer el token de la URL cuando el componente se monta
    const query = new URLSearchParams(location.search);
    const tokenFromUrl = query.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      validateToken(tokenFromUrl);
    } else {
      toast.error("No se proporcionó un token válido");
      setTimeout(() => navigate("/recuperarContraseña"), 3000);
    }
  }, [location, navigate]);

  const validateToken = async (tokenValue) => {
    setIsLoading(true);
    try {
      const response = await fetch(validateTokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: tokenValue })
      });

      if (response.ok) {
        setIsTokenValid(true);
        toast.success("Token válido. Por favor establece una nueva contraseña");
      } else {
        const errorData = await response.json();
        toast.error("Token inválido o expirado: " + (errorData.token || errorData.error || "Error desconocido"));
        setTimeout(() => navigate("/recuperarContraseña"), 3000);
      }
    } catch (error) {
      console.error("Error al validar el token:", error);
      toast.error("Error al validar el token. Intenta solicitar un nuevo enlace.");
      setTimeout(() => navigate("/recuperarContraseña"), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async () => {
    // Validar que las contraseñas coincidan y no estén vacías
    if (!newPassword || !confirmPassword) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(resetPasswordUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: token,
          new_password: newPassword,
          new_password2: confirmPassword
        })
      });

      if (response.ok) {
        toast.success("Contraseña restablecida con éxito");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const errorData = await response.json();
        toast.error("Error al restablecer la contraseña: " + 
          (errorData.new_password || errorData.token || errorData.error || "Error desconocido"));
      }
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
      toast.error("Error al enviar la petición. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-[#DBDBDB]">
      <NavBar />
      <Toaster />
      <AuthFrame>
        <p className="text-[3vw] font-[500] w-[60%]">Restablecer contraseña</p>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-[20vh]">
            <p>Cargando...</p>
          </div>
        ) : isTokenValid ? (
          <>
            <InputAuora
              type="password"
              placeholder="Contraseña"
              value={newPassword}
              onChange={handlePasswordChange}
            />
            <InputAuora
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <ButtonA
              text="Restablecer Contraseña"
              onClick={handleSubmit}
              width="60%"
              color="#2B388C"
              disabled={isLoading}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[20vh] w-[80%] text-center">
            <p>Validando tu token...</p>
            <p className="text-sm mt-4 text-gray-600">
              Si experimentas problemas, puedes solicitar un nuevo enlace en la página de recuperación de contraseña.
            </p>
          </div>
        )}
        
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
            Volver al inicio de sesión
          </p>
        </div>
      </AuthFrame>
    </div>
  );
}

export default ResetPassword;