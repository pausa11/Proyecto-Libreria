import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import ButtonA from "../ui/buttonA";
import InputAuora from "../ui/input";
import { getApiUrl } from "../../api/config";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false
  });
  const [userId, setUserId] = useState(null);

  // URL base para la API
  const baseUrl = getApiUrl("/api");
  const profileUrl = `${baseUrl}/usuarios/perfil/`;

  // Obtener el perfil del usuario para conseguir su ID
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("No hay sesión activa. Por favor inicia sesión nuevamente.");
          return;
        }

        const response = await fetch(profileUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserId(userData.id);
        } else {
          toast.error("Error al obtener el perfil del usuario");
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        toast.error("Error al obtener información del usuario");
      }
    };

    fetchUserProfile();
  }, []);

  // Validación de contraseña mientras el usuario escribe
  useEffect(() => {
    if (newPassword) {
      setPasswordValidation({
        length: newPassword.length >= 8,
        lowercase: /[a-z]/.test(newPassword),
        uppercase: /[A-Z]/.test(newPassword),
        number: /[0-9]/.test(newPassword)
      });
    }
  }, [newPassword]);

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async () => {
    // Validar que las contraseñas cumplan los requisitos
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    
    // Verificar que la contraseña cumpla todos los requisitos
    const allRequirementsMet = Object.values(passwordValidation).every(value => value);
    if (!allRequirementsMet) {
      toast.error("La contraseña debe cumplir todos los requisitos de seguridad");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Las nuevas contraseñas no coinciden");
      return;
    }

    if (!userId) {
      toast.error("No se pudo obtener la información del usuario");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No hay sesión activa. Por favor inicia sesión nuevamente.");
        return;
      }

      // URL correcta con el ID del usuario
      const changePasswordUrl = `${baseUrl}/usuarios/${userId}/cambiar_contraseña/`;

      // Ajustando los parámetros para que coincidan con lo esperado por el backend
      const response = await fetch(changePasswordUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
          new_password2: confirmPassword  // Agregando este campo que el backend espera
        })
      });

      if (response.ok) {
        toast.success("¡Contraseña actualizada con éxito!");
        // Limpiar los campos después de cambiar la contraseña con éxito
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.json();
        console.log("Error response:", errorData); // Añadimos un log para depurar
        toast.error("Error al cambiar la contraseña: " + 
          (errorData.old_password || errorData.new_password || errorData.new_password2 || errorData.error || "Error desconocido"));
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      toast.error("Error al enviar la petición. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Componente para los requisitos de la contraseña
  const PasswordRequirements = () => (
    <div className="w-full my-3 p-3 bg-slate-50 rounded-md text-sm">
      <p className="mb-2 font-medium">La contraseña debe tener:</p>
      <ul className="space-y-1">
        <li className={`flex items-center ${passwordValidation.length ? 'text-green-600' : 'text-gray-600'}`}>
          <span className="mr-1">{passwordValidation.length ? '✓' : '○'}</span> Al menos 8 caracteres
        </li>
        <li className={`flex items-center ${passwordValidation.lowercase ? 'text-green-600' : 'text-gray-600'}`}>
          <span className="mr-1">{passwordValidation.lowercase ? '✓' : '○'}</span> Una letra minúscula
        </li>
        <li className={`flex items-center ${passwordValidation.uppercase ? 'text-green-600' : 'text-gray-600'}`}>
          <span className="mr-1">{passwordValidation.uppercase ? '✓' : '○'}</span> Una letra mayúscula
        </li>
        <li className={`flex items-center ${passwordValidation.number ? 'text-green-600' : 'text-gray-600'}`}>
          <span className="mr-1">{passwordValidation.number ? '✓' : '○'}</span> Un número
        </li>
      </ul>
    </div>
  );

  return (
    <div className="p-10 flex flex-col gap-4">
      <Toaster position="top-center" richColors />
      <h1 className="text-3xl font-[500]">Cambiar Contraseña</h1>
      <p className="text-sm text-gray-600 mb-6">
        Actualiza tu contraseña para mantener tu cuenta segura
      </p>
      
      <div className="w-full max-w-md">
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">Contraseña actual</p>
          <InputAuora
            type="password"
            placeholder="Contraseña actual"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
          />
        </div>
        
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">Nueva contraseña</p>
          <InputAuora
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          
          <PasswordRequirements />
        </div>
          
        <div className="mb-8">
          <p className="text-sm font-medium mb-2">Confirmar nueva contraseña</p>
          <InputAuora
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          
          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <p className="text-red-500 text-sm mt-2">Las contraseñas no coinciden</p>
          )}
        </div>
        
        <ButtonA
          text={isLoading ? "Actualizando..." : "Actualizar Contraseña"}
          onClick={handleSubmit}
          width="100%"
          color="#2B388C"
          disabled={isLoading}
          className="mt-6"
        />
      </div>
    </div>
  );
}

export default ChangePassword;