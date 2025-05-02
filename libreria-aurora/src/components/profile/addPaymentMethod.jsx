import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import InputAuora from "../ui/input";
import ButtonA from "../ui/buttonA";

function AddPaymentMethod({ onBack, cardToEdit = null }) {
  const [newCard, setNewCard] = useState({
    numero: "",
    titular: "",
    fecha_expiracion: "",
    cvv: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const baseUrl = "https://proyecto-libreria-k9xr.onrender.com/api";

  // Si se pasa una tarjeta para editar, inicializamos el formulario con sus datos
  useEffect(() => {
    if (cardToEdit) {
      setNewCard({
        numero: cardToEdit.numero || "",
        titular: cardToEdit.titular || "",
        fecha_expiracion: cardToEdit.fecha_expiracion || "",
        cvv: cardToEdit.cvv || "",
      });
      setIsEditing(true);
    }
  }, [cardToEdit]);

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
      toast.error("El número de tarjeta debe tener exactamente 16 dígitos");
      return false;
    }
    
    if (newCard.cvv.length !== 3 || !/^\d+$/.test(newCard.cvv)) {
      toast.error("El CVV debe tener exactamente 3 dígitos");
      return false;
    }
    
    // Validar que la fecha de expiración sea futura
    const fechaExpiracion = new Date(newCard.fecha_expiracion);
    const hoy = new Date();
    if (fechaExpiracion <= hoy) {
      toast.error("La fecha de expiración debe ser futura");
      return false;
    }
    
    return true;
  };

  const checkExistingCard = async (numero) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return { existe: false, es_propia: false };

      const response = await fetch(`${baseUrl}/finanzas/tarjetas/verificar_tarjeta/?numero=${numero}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        return await response.json();
      }
      return { existe: false, es_propia: false };
    } catch (error) {
      console.error("Error al verificar tarjeta:", error);
      return { existe: false, es_propia: false };
    }
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
      
      // Verificar si la tarjeta ya existe en el sistema
      const verificacion = await checkExistingCard(newCard.numero);
      
      if (verificacion.existe && !verificacion.es_propia && !isEditing) {
        // Si la tarjeta ya existe pero no es del usuario actual
        toast.warning(
          "Este número de tarjeta ya está registrado en el sistema. Por motivos de seguridad, cada tarjeta solo puede estar asociada a una cuenta."
        );
        setIsLoading(false);
        return;
      }

      // Si estamos editando o la tarjeta no está registrada, procedemos
      // Cuando estamos editando o ya tenemos una tarjeta, usamos la API de actualización
      if (isEditing || verificacion.es_propia) {
        const response = await fetch(`${baseUrl}/finanzas/tarjetas/actualizar_informacion/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newCard)
        });

        if (response.ok) {
          toast.success("Tarjeta actualizada correctamente");
          setTimeout(() => onBack(), 1500);
          return;
        } else {
          const errorData = await response.json();
          handleApiErrors(errorData);
          return;
        }
      } else {
        // Si no estamos editando y la tarjeta no existe, creamos una nueva
        const response = await fetch(`${baseUrl}/finanzas/tarjetas/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newCard)
        });

        if (response.ok) {
          toast.success("Tarjeta agregada correctamente");
          setTimeout(() => onBack(), 1500);
          return;
        } else {
          const errorData = await response.json();
          handleApiErrors(errorData);
          return;
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(`No se pudo procesar la operación: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApiErrors = (errorData) => {
    if (errorData.usuario) {
      toast.error(`Error de autenticación: ${errorData.usuario[0]}`);
    } else if (errorData.numero) {
      toast.error(`Error en la tarjeta: ${errorData.numero[0]}`);
    } else if (errorData.cvv) {
      toast.error(`Error en el CVV: ${errorData.cvv[0]}`);
    } else if (errorData.fecha_expiracion) {
      toast.error(`Error en la fecha: ${errorData.fecha_expiracion[0]}`);
    } else if (errorData.titular) {
      toast.error(`Error en el titular: ${errorData.titular[0]}`);
    } else if (errorData.error) {
      toast.error(`Error: ${errorData.error}`);
    } else if (errorData.detail) {
      toast.error(`Error: ${errorData.detail}`);
    } else {
      toast.error("Se produjo un error al procesar su solicitud");
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
      
      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        {isEditing ? "Actualizar método de pago" : "Agregar método de pago"}
      </h2>
      
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
        text={isLoading ? "Guardando..." : (isEditing ? "Actualizar tarjeta" : "Guardar tarjeta")}
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
