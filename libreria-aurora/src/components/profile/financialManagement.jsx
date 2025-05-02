import React, { useEffect, useState } from "react";
import AddPaymentMethod from "./addPaymentMethod";
import { Toaster, toast } from "sonner";

function FinancialManagement() {
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("main");
    const [saldo, setSaldo] = useState(0); // Inicializamos en 0 por defecto
    const [modificacionSaldo, setModificacionSaldo] = useState("");
    const [usuarioId, setUsuarioId] = useState(null);
    const [intentosSaldo, setIntentosSaldo] = useState(0); // Contador para evitar loops infinitos

    const baseUrl = "https://proyecto-libreria-k9xr.onrender.com/api";

    const fetchCard = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Debe iniciar sesión para ver sus métodos de pago");
                setLoading(false);
                return;
            }

            // Usar el endpoint estándar REST en lugar del endpoint personalizado
            const response = await fetch(`${baseUrl}/finanzas/tarjetas/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // El backend debería filtrar las tarjetas por el usuario autenticado gracias al token
                if (data && data.length > 0) {
                    setCard(data[0]); // Tomamos la primera tarjeta del usuario
                } else {
                    setCard(null); // No tiene tarjetas
                }
            } else if (response.status === 404) {
                setCard(null);
            } else {
                console.warn("No se pudo obtener información de tarjeta");
                setCard(null);
            }
            
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar tarjeta:", error);
            // Es normal no tener tarjeta, así que no mostramos error
            setCard(null);
            setLoading(false);
        }
    };

    const fetchSaldo = async () => {
        try {
            // Si ya hemos intentado demasiadas veces, detener
            if (intentosSaldo > 2) {
                setSaldo(0);
                setLoading(false);
                return;
            }

            const token = localStorage.getItem("token");
            if (!token) return;
        
            // Usar el endpoint estándar REST para saldos
            const response = await fetch(`${baseUrl}/finanzas/saldos/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
        
            if (response.ok) {
                const data = await response.json();
                // El backend debería filtrar los saldos por el usuario autenticado
                if (data && data.length > 0) {
                    setSaldo(data[0].saldo); // Asumiendo que 'saldo' es el campo que contiene el valor
                    setLoading(false);
                } else {
                    // Si no tiene saldo, simplemente establecemos 0
                    setSaldo(0);
                    setLoading(false);
                }
            } else {
                // En caso de error, simplemente mostrar saldo 0
                setSaldo(0);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error al obtener el saldo:", error);
            // En caso de error, simplemente mostrar saldo 0
            setSaldo(0);
            setLoading(false);
        }
    };

    const fetchUsuarioId = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
      
            const response = await fetch(`${baseUrl}/usuarios/perfil/`, {
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
            toast.error("Error al cargar información de usuario");
        }
    };
  
    const handleModificarSaldo = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            
            const cantidad = parseFloat(modificacionSaldo);
            if (isNaN(cantidad)) {
                toast.error("Ingrese un número válido para modificar el saldo");
                return;
            }
            
            // Primero intentamos usar el endpoint específico para cambiar el saldo
            try {
                const response = await fetch(`${baseUrl}/finanzas/saldos/cambiar_saldo/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        saldo: cantidad
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setSaldo(data.saldo);
                    toast.success("Saldo actualizado correctamente");
                    setModificacionSaldo("");
                    return;
                }
                
                // Si el endpoint específico falla, intentamos crear un saldo inicial
                if (response.status === 404) {
                    await crearSaldoConValor(cantidad);
                    return;
                }
                
                // Otros errores
                const errorData = await response.json();
                throw new Error(errorData.error || "Error desconocido");
                
            } catch (endpointError) {
                console.error("Error usando endpoint específico:", endpointError);
                // Intentar enfoque alternativo
                await crearSaldoConValor(cantidad);
            }
        } catch (error) {
            console.error("Error actualizando saldo:", error);
            toast.error("No se pudo actualizar el saldo");
        }
    };

    // Función para crear un saldo con un valor inicial específico
    const crearSaldoConValor = async (valorInicial) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            // Incrementar contador de intentos
            setIntentosSaldo(prev => prev + 1);
            
            if (intentosSaldo > 2) {
                toast.error("No se pudo crear el saldo. Por favor, intente más tarde.");
                return;
            }

            // Intentar crear un saldo con el valor especificado
            const response = await fetch(`${baseUrl}/finanzas/saldos/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    saldo: valorInicial || 0
                })
            });

            if (response.ok) {
                const data = await response.json();
                setSaldo(data.saldo);
                toast.success("Se ha creado su saldo con el valor especificado");
                setModificacionSaldo("");
            } else if (response.status === 400) {
                // Ya existe un saldo, intentamos actualizarlo
                const saldosResponse = await fetch(`${baseUrl}/finanzas/saldos/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                if (saldosResponse.ok) {
                    const saldosData = await saldosResponse.json();
                    if (saldosData && saldosData.length > 0) {
                        const saldoId = saldosData[0].id;
                        const updateResponse = await fetch(`${baseUrl}/finanzas/saldos/${saldoId}/`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                saldo: valorInicial || 0
                            })
                        });
                        
                        if (updateResponse.ok) {
                            const updateData = await updateResponse.json();
                            setSaldo(updateData.saldo);
                            toast.success("Saldo actualizado correctamente");
                            setModificacionSaldo("");
                        } else {
                            throw new Error("No se pudo actualizar el saldo existente");
                        }
                    }
                } else {
                    throw new Error("No se pudo obtener información del saldo");
                }
            } else {
                throw new Error("No se pudo crear el saldo");
            }
        } catch (error) {
            console.error("Error al crear/actualizar saldo:", error);
            toast.error("No se pudo procesar la operación de saldo");
            // No reintentar más, simplemente establecer un valor por defecto
            setSaldo(0);
        }
    };
      
    useEffect(() => {
        fetchUsuarioId();
        fetchCard();
        fetchSaldo();
    }, []);

    const handleDeleteCard = async () => {
        if (!card || !card.id) {
            toast.error("No hay tarjeta para eliminar");
            return;
        }
        
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await fetch(`${baseUrl}/finanzas/tarjetas/${card.id}/`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 204) {
                setCard(null);
                toast.success("Tarjeta eliminada exitosamente");
            } else {
                throw new Error("No se pudo eliminar");
            }
        } catch (error) {
            console.error("Error eliminando tarjeta:", error);
            toast.error("Error al eliminar la tarjeta");
        }
    };

    if (activeSection === "addCard") {
        return (
            <div className="p-6 md:p-10">
                <AddPaymentMethod
                    onBack={() => {
                        setActiveSection("main");
                        fetchCard();
                    }}
                />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <Toaster position="top-center" richColors />
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Gestión Financiera</h1>
            <h2 className="text-lg md:text-xl mb-2">Métodos de pago</h2>

            {loading ? (
                <div className="flex items-center justify-center my-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3B4CBF]"></div>
                </div>
            ) : (
                <>
                    {!card ? (
                        <p className="text-gray-300">No hay tarjeta registrada.</p>
                    ) : (
                        <div className="relative bg-gray-100 p-4 rounded mb-4 text-black">
                            {activeSection === "edit" && (
                                <button
                                    onClick={handleDeleteCard}
                                    className="absolute top-2 right-2 text-red-600 font-bold"
                                >
                                    Eliminar ✖
                                </button>
                            )}
                            <p><strong>Titular:</strong> {card.titular}</p>
                            <p><strong>Número:</strong> **** **** **** {card.numero?.slice(-4)}</p>
                            <p><strong>Vencimiento:</strong> {card.fecha_expiracion}</p>
                        </div>
                    )}

                    <p className="text-base md:text-lg mb-4">
                        <strong>Saldo actual:</strong> ${Number(saldo || 0).toLocaleString()}
                    </p>

                    {activeSection === "edit" && (
                        <div className="mt-4">
                            <p className="font-semibold mb-2">Modificar saldo:</p>
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                                <input
                                    type="number"
                                    value={modificacionSaldo}
                                    onChange={(e) => setModificacionSaldo(e.target.value)}
                                    placeholder="Ej: -100 o 500"
                                    className="p-2 border rounded text-black w-full md:w-40 mr-0 md:mr-2"
                                />
                                <button 
                                    onClick={handleModificarSaldo} 
                                    className="bg-[#3B4CBF] text-white px-4 py-1 rounded w-full md:w-auto"
                                >
                                    Actualizar saldo
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-4 mt-6">
                        {!card && (
                            <button 
                                onClick={() => setActiveSection("addCard")} 
                                className="bg-[#3B4CBF] text-white px-4 py-2 rounded w-full md:w-auto"
                            >
                                Agregar método de pago
                            </button>
                        )}
                        <button 
                            onClick={() => setActiveSection((prev) => (prev === "edit" ? "main" : "edit"))} 
                            className="bg-[#FFD700] text-black px-4 py-2 rounded w-full md:w-auto"
                        >
                            {activeSection === "edit" ? "Cerrar edición" : "Modificar métodos"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default FinancialManagement;
