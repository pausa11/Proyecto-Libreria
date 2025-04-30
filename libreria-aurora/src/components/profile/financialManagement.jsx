import React, { useEffect, useState } from "react";

function FinancialManagement() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMensaje("Debe iniciar sesión para ver sus métodos de pago.");
          setLoading(false);
          return;
        }

        const response = await fetch("https://proyecto-libreria-k9xr.onrender.com/api/finanzas/tarjetas/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error("Error al obtener las tarjetas");

        const data = await response.json();
        setCards(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar tarjetas:", error);
        setMensaje("Error al cargar tarjetas.");
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) {
    return <div className="p-6">Cargando métodos de pago...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Gestión Financiera</h1>
      <h2 className="text-xl mb-2">Métodos de pago</h2>

      {mensaje && <p className="text-red-500">{mensaje}</p>}

      {cards.length === 0 ? (
        <p className="text-gray-300">No hay tarjetas registradas.</p>
      ) : (
        cards.map((card, index) => (
          <div key={card.id} className="bg-gray-100 p-4 rounded mb-4 text-black">
            <p><strong>Titular:</strong> {card.titular}</p>
            <p><strong>Número:</strong> **** **** **** {card.numero.slice(-4)}</p>
            <p><strong>Vencimiento:</strong> {card.fecha_expiracion}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default FinancialManagement;
