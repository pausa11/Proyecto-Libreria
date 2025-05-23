import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import InputAuora from "../ui/input";
import ButtonA from "../ui/buttonA";
import { getApiUrl } from "../../api/config";
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

function AddPaymentMethod({ onBack }) {

  const [focus, setFocus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = getApiUrl("/api");
  const [newCard, setNewCard] = useState({
    numero: "",
    titular: "",
    fecha_expiracion: "",
    cvv: "",
  });

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
    if (newCard.numero.length !== 16 || !/^\d{16}$/.test(newCard.numero)) {
      toast.error("El número de tarjeta debe tener 16 dígitos");
      return false;
    }

    if (newCard.cvv.length !== 3 || !/^\d{3}$/.test(newCard.cvv)) {
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

      if (!validateCardData()) return;

      setIsLoading(true);
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

      const fechaFormateada = `${newCard.fecha_expiracion}-01`;

      const cardPayload = {
        ...newCard,
        fecha_expiracion: fechaFormateada,
        usuario: userId
      };

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
        if (errorData.usuario) toast.error(`Error: ${errorData.usuario[0]}`);
        else if (errorData.numero) toast.error(`Error: ${errorData.numero[0]}`);
        else toast.error("No se pudo agregar la tarjeta");
        return;
      }

      toast.success("Tarjeta agregada exitosamente");
      setNewCard({ numero: "", titular: "", fecha_expiracion: "", cvv: "" });
      setTimeout(() => onBack(), 1500);

    } catch (error) {
      console.error(error);
      toast.error(`No se pudo agregar la tarjeta: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-10 w-full h-full">
      <Toaster position="top-center" richColors />

      <button onClick={onBack} className="mb-6 text-[#3B4CBF] hover:underline flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Volver al perfil
      </button>

      <h2 className="text-xl md:text-2xl font-semibold mb-6">Agregar método de pago</h2>

      <div className="mb-4 flex flex-row gap-4 w-full h-full">

        <div className="w-1/2 flex flex-col justify-center items-center">
          <div className="mb-4 w-full ">
            <p className="text-sm font-medium mb-2">Número de tarjeta</p>
            <InputAuora
              name="numero"
              placeholder="1234 5678 9012 3456"
              value={newCard.numero}
              onChange={handleChange}
              onFocus={() => setFocus('number')}
              maxLength={16}
              width="100%"
              text={false}
            />
          </div>

          <div className="mb-4 w-full">
            <p className="text-sm font-medium mb-2">Nombre del titular</p>
            <InputAuora
              name="titular"
              placeholder="Nombre y apellido"
              value={newCard.titular}
              onChange={handleChange}
              onFocus={() => setFocus('name')}
              width="100%"
              number={false}
            />
          </div>

          <div className="flex flex-row gap-4 w-full">
            <div className="mb-4 w-[100%]">
              <p className="text-sm font-medium mb-2">Fecha de expiración</p>
              <InputAuora
                type="month"
                name="fecha_expiracion"
                value={newCard.fecha_expiracion}
                onChange={handleChange}
                onFocus={() => setFocus('expiry')}
                width="100%"
              />
            </div>

            <div className="mb-4 w-[30%]">
              <p className="text-sm font-medium mb-2">CVV</p>
              <InputAuora
                name="cvv"
                placeholder="CVV"
                value={newCard.cvv}
                onChange={handleChange}
                onFocus={() => setFocus('cvc')}
                maxLength={3}
                type="password"
                width="100%"
                text={false}
              />
            </div>
          </div>

          <div className="mb-4 w-full flex ">
            <ButtonA
              text={isLoading ? "Guardando..." : "Guardar tarjeta"}
              onClick={handleAddCard}
              width="600%"
              color="#2B388C"
              disabled={isLoading}
              className="mt-4"
            />
          </div>

        </div>

        <div className="w-1/2 flex justify-center items-center">
          <Cards
            number={newCard.numero}
            name={newCard.titular}
            expiry={newCard.fecha_expiracion?.replaceAll('-', '').slice(2)}
            cvc={newCard.cvv}
            focused={focus}
          />
        </div>
      </div>
    </div>
  );
}

export default AddPaymentMethod;
