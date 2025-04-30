import React, { useEffect, useState } from "react";

function AddPaymentMethod({ onBack }) {
  const [newCard, setNewCard] = useState({
    numero: "",
    titular: "",
    fecha_expiracion: "",
    cvv: "",
  });
  const [usuarioId, setUsuarioId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // Obtener el ID del usuario autenticado
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("https://proyecto-libreria-k9xr.onrender.com/api/usuarios/perfil/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error("No se pudo obtener el perfil del usuario");

        const data = await response.json();
        setUsuarioId(data.id);
      } catch (error) {
        console.error("Error obteniendo el usuario:", error);
        setMensaje("Error al obtener la información del usuario ❌");
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setNewCard({
      ...newCard,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCard = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || usuarioId === null) return;
  
      const payload = {
        ...newCard,
        usuario_id: usuarioId,
        usuario: usuarioId, // ✅ incluir ambos campos según error del backend
      };
  
      console.log("Enviando:", payload);
  
      const response = await fetch("https://proyecto-libreria-k9xr.onrender.com/api/finanzas/tarjetas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Detalles del error:", errorData);
        throw new Error("Error al agregar tarjeta");
      }
  
      setMensaje("Tarjeta agregada exitosamente ✅");
      setNewCard({ numero: "", titular: "", fecha_expiracion: "", cvv: "" });
    } catch (error) {
      console.error(error);
      setMensaje("❌ No se pudo agregar la tarjeta");
    }
  };
  
  
  

  return (
    <div className="p-6 max-w-xl">
      <button onClick={onBack} className="mb-4 text-[#3B4CBF]">
        ← Volver al perfil
      </button>
      <h2 className="text-2xl font-semibold mb-4">Agregar método de pago</h2>

      {mensaje && <p className="mb-4 text-sm">{mensaje}</p>}

      <input
        name="numero"
        placeholder="Número de tarjeta"
        value={newCard.numero}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        name="titular"
        placeholder="Nombre del titular"
        value={newCard.titular}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="date"
        name="fecha_expiracion"
        value={newCard.fecha_expiracion}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        name="cvv"
        placeholder="CVV"
        value={newCard.cvv}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />
      <button
        onClick={handleAddCard}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Guardar tarjeta
      </button>
    </div>
  );
}

export default AddPaymentMethod;
