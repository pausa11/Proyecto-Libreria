import React, { useEffect, useState } from "react";
import AddPaymentMethod from "./addPaymentMethod";

function FinancialManagement() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState("");
    const [activeSection, setActiveSection] = useState("main");
    const [saldo, setSaldo] = useState(null);
    const [saldoId, setSaldoId] = useState(null);
    const [modificacionSaldo, setModificacionSaldo] = useState("");
    const [usuarioId, setUsuarioId] = useState(null);

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

    const fetchSaldo = async () => {
        try {
        const token = localStorage.getItem("token");
        if (!token) return;
    
        const response = await fetch("https://proyecto-libreria-k9xr.onrender.com/api/finanzas/saldos/", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            },
        });
    
        if (!response.ok) throw new Error("No se pudo obtener el saldo");
    
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            setSaldo(data[0].saldo);
            setSaldoId(data[0].id);
          }          
        } catch (error) {
        console.error("Error al obtener el saldo:", error);
        }
    };

    const fetchUsuarioId = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;
      
          const response = await fetch("https://proyecto-libreria-k9xr.onrender.com/api/usuarios/perfil/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            }
          });
      
          if (!response.ok) throw new Error("No se pudo obtener el usuario");
      
          const data = await response.json();
          setUsuarioId(data.id); 
        } catch (error) {
          console.error("Error al obtener usuarioId:", error);
        }
    };
  
    const handleModificarSaldo = async () => {
        const token = localStorage.getItem("token");
        if (!token || saldoId === null) return;
        
        const cantidad = parseFloat(modificacionSaldo);
        if (isNaN(cantidad)) {
            setMensaje("⚠️ Ingrese un número válido para modificar el saldo.");
            return;
        }
        
        const nuevoSaldo = parseFloat(saldo) + cantidad;
        
        try {
            const response = await fetch(`https://proyecto-libreria-k9xr.onrender.com/api/finanzas/saldos/${saldoId}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                usuario_id: usuarioId,
                usuario: usuarioId,
                saldo: nuevoSaldo
              })
              
            });
        
            if (!response.ok) {
                const errorData = await response.text();
                console.error("Detalles del error:", errorData);
                throw new Error("Error al actualizar el saldo");
              }
        
            setSaldo(nuevoSaldo);
            setMensaje("✅ Saldo actualizado correctamente");
            setModificacionSaldo("");
        } catch (error) {
            console.error("Error actualizando saldo:", error);
            setMensaje("❌ No se pudo actualizar el saldo");
        }
    };
      

    useEffect(() => {
        fetchCards();
        fetchSaldo();
        fetchUsuarioId();
    }, []);

    const handleDeleteCard = async (id) => {
        try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`https://proyecto-libreria-k9xr.onrender.com/api/finanzas/tarjetas/${id}/`, {
            method: "DELETE",
            headers: {
            "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 204) {
            setCards(cards.filter((card) => card.id !== id));
            setMensaje("✅ Tarjeta eliminada");
        } else {
            throw new Error("No se pudo eliminar");
        }
        } catch (error) {
        console.error("Error eliminando tarjeta:", error);
        setMensaje("❌ Error al eliminar la tarjeta");
        }
    };

    if (activeSection === "addCard") {
        return (
        <div className="p-10">
            <AddPaymentMethod
            onBack={() => {
                setActiveSection("main");
                fetchCards();
            }}
            />
        </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Gestión Financiera</h1>
            <h2 className="text-xl mb-2">Métodos de pago</h2>

            {mensaje && <p className="text-green-500 mb-4">{mensaje}</p>}

            {cards.length === 0 ? (
                <p className="text-gray-300">No hay tarjetas registradas.</p>
            ) : (
                cards.map((card) => (
                <div key={card.id} className="relative bg-gray-100 p-4 rounded mb-4 text-black">
                    {activeSection === "edit" && (
                    <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="absolute top-2 right-2 text-red-600 font-bold"
                    >
                        Eliminar ✖
                    </button>
                    )}
                    <p><strong>Titular:</strong> {card.titular}</p>
                    <p><strong>Número:</strong> **** **** **** {card.numero.slice(-4)}</p>
                    <p><strong>Vencimiento:</strong> {card.fecha_expiracion}</p>
                </div>
                ))
            )}

            {saldo !== null && (
                <p className="text-lg mb-4">
                    <strong>Saldo actual:</strong> ${Number(saldo).toLocaleString()}
                </p>
            )}

            {activeSection === "edit" && (
            <div className="mt-4">
                <p className="font-semibold mb-2">Modificar saldo:</p>
                <input
                type="number"
                value={modificacionSaldo}
                onChange={(e) => setModificacionSaldo(e.target.value)}
                placeholder="Ej: -100 o 500"
                className="p-2 border rounded text-black w-40 mr-2"
                />
                <button onClick={handleModificarSaldo} className="bg-[#3B4CBF] text-white px-4 py-1 rounded" >
                    Actualizar saldo
                </button>
            </div>
            )}


            <div className="flex gap-4 mt-4">
                <button onClick={() => setActiveSection("addCard")} className="bg-[#3B4CBF] text-white px-4 py-2 rounded" >
                    Agregar método de pago
                </button>
                <button onClick={() => setActiveSection((prev) => (prev === "edit" ? "main" : "edit")) } className="bg-[#FFD700] text-black px-4 py-2 rounded" >
                    {activeSection === "edit" ? "Cerrar edición" : "Modificar métodos"}
                </button>
            </div>
        </div>
    );
}

export default FinancialManagement;
