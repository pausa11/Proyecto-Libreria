import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import InputAuora from "../ui/input";
import ButtonA from "../ui/buttonA";

function AddPaymentMethod({ onBack }) {
  const [newCard, setNewCard] = useState({
    numero: "",
    titular: "",
    fecha_expiracion: "",
    cvv: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = "https://proyecto-libreria-k9xr.onrender.com/api";

  const handleChange = (e) => {
    setNewCard({
      ...newCard,
      [e.target.name]: e.target.value,
    });
  };

  const validateCardData = () => {
    if (!newCard.numero || !newCard.titular || !newCard.fecha_expiracion || !newCard.cvv) {
      toast.error("Todos los campos son obligatorios");
      return false;
    }
    
    if (newCard.numero.length !== 16 || !/^\d+$/.test(newCard.numero)) {
      toast.error("El número de tarjeta debe tener 16 dígitos");
      return false;
    }
    
    if (newCard.cvv.length !== 3 || !/^\d+$/.test(newCard.cvv)) {
      toast.error("El CVV debe tener 3 dígitos");
      return false;
    }
    
    return true;
  };

  const handleAddCard = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No hay sesión activa");
        return;
      }
      
      if (!validateCardData()) {
        return;
      }
      
      setIsLoading(true);

      // 1. Primero obtenemos el ID del usuario actual desde el perfil
      const profileResponse = await fetch(`${baseUrl}/usuarios/perfil/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!profileResponse.ok) {
        toast.error("No se pudo obtener el perfil del usuario");
        setIsLoading(false);
        return;
      }
      
      const profileData = await profileResponse.json();
      const userId = profileData.id;
      
      if (!userId) {
        toast.error("No se pudo identificar al usuario");
        setIsLoading(false);
        return;
      }
      
      // 2. Ahora enviamos la tarjeta con el ID de usuario explícito
      const cardPayload = {
        ...newCard,
        usuario: userId // Enviamos el ID de usuario explícitamente
      };
      
      console.log("Enviando datos de tarjeta:", cardPayload);
  
      const response = await fetch(`${baseUrl}/finanzas/tarjetas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(cardPayload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Detalles del error:", errorData);
        
        // Mostrar mensajes de error específicos del backend
        if (errorData.usuario) {
          toast.error(`Error de autenticación: ${errorData.usuario[0]}`);
        } else if (errorData.numero) {
          toast.error(`Error en la tarjeta: ${errorData.numero[0]}`);
        } else if (errorData.detail) {
          toast.error(`Error: ${errorData.detail}`);
        } else {
          toast.error("No se pudo agregar la tarjeta");
        }
        return;
      }
  
      toast.success("Tarjeta agregada exitosamente");
      setNewCard({ numero: "", titular: "", fecha_expiracion: "", cvv: "" });
      
      // Volver automáticamente después de un breve tiempo
      setTimeout(() => {
        onBack(); // Volver a la página anterior
      }, 1500);
      
    } catch (error) {
      console.error(error);
      toast.error(`No se pudo agregar la tarjeta: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-10 w-full max-w-xl mx-auto">
      <Toaster position="top-center" richColors />
      
      <button 
        onClick={onBack} 
        className="mb-6 text-[#3B4CBF] hover:underline flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Volver al perfil
      </button>
      
      <h2 className="text-xl md:text-2xl font-semibold mb-6">Agregar método de pago</h2>
      
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Número de tarjeta</p>
        <InputAuora
          name="numero"
          placeholder="Número de tarjeta (16 dígitos)"
          value={newCard.numero}
          onChange={handleChange}
          maxLength={16}
        />
      </div>
      
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Nombre del titular</p>
        <InputAuora
          name="titular"
          placeholder="Nombre del titular"
          value={newCard.titular}
          onChange={handleChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Fecha de expiración</p>
          <InputAuora
            type="date"
            name="fecha_expiracion"
            value={newCard.fecha_expiracion}
            onChange={handleChange}
          />
        </div>
        
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">CVV</p>
          <InputAuora
            name="cvv"
            placeholder="CVV (3 dígitos)"
            value={newCard.cvv}
            onChange={handleChange}
            maxLength={3}
            type="password"
          />
        </div>
      </div>
      
      <ButtonA
        text={isLoading ? "Guardando..." : "Guardar tarjeta"}
        onClick={handleAddCard}
        width="100%"
        color="#2B388C"
        disabled={isLoading}
        className="mt-4"
      />
    </div>
  );
}

export default AddPaymentMethod;
