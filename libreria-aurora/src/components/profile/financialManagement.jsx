import React, { useEffect, useState } from "react";
import AddPaymentMethod from "./addPaymentMethod";
import { Toaster, toast } from "sonner";

function FinancialManagement() {
    const [card, setCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [activeSection, setActiveSection] = useState("main");
    const [saldo, setSaldo] = useState(0);
    const [historialTransacciones, setHistorialTransacciones] = useState([]);
    const [historialLoading, setHistorialLoading] = useState(false);
    
    const baseUrl = "https://proyecto-libreria-k9xr.onrender.com/api";
    
    // Montos predefinidos para las recargas
    const montosPredefinidos = [10, 25, 50, 100, 200];

    const fetchCard = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Debe iniciar sesión para ver sus métodos de pago");
                setLoading(false);
                return;
            }

            const response = await fetch(`${baseUrl}/finanzas/tarjetas/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    setCard(data[0]);
                } else {
                    setCard(null);
                }
            } else {
                setCard(null);
            }
            
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar tarjeta:", error);
            setCard(null);
            setLoading(false);
        }
    };

    const fetchSaldo = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
        
            const response = await fetch(`${baseUrl}/finanzas/saldos/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
        
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    setSaldo(data[0].saldo);
                } else {
                    setSaldo(0);
                }
            } else {
                setSaldo(0);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error al obtener el saldo:", error);
            setSaldo(0);
            setLoading(false);
        }
    };
    
    const fetchHistorialTransacciones = async () => {
        try {
            setHistorialLoading(true);
            const token = localStorage.getItem("token");
            if (!token) return;
            
            const response = await fetch(`${baseUrl}/finanzas/historial/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setHistorialTransacciones(data);
            } else {
                console.error("Error al obtener historial:", response.status);
                setHistorialTransacciones([]);
            }
        } catch (error) {
            console.error("Error al obtener historial:", error);
            setHistorialTransacciones([]);
        } finally {
            setHistorialLoading(false);
        }
    };

    const handleRecargarSaldo = async (monto) => {
        if (!card) {
            toast.error("Debe registrar una tarjeta antes de poder recargar saldo");
            return;
        }
        
        try {
            setLoadingTransaction(true);
            const token = localStorage.getItem("token");
            if (!token) return;
            
            const response = await fetch(`${baseUrl}/finanzas/saldos/recargar_saldo/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    monto: monto
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                setSaldo(data.saldo);
                toast.success(data.mensaje);
                
                // Actualizar historial después de la recarga
                fetchHistorialTransacciones();
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Error al recargar el saldo");
            }
        } catch (error) {
            console.error("Error al recargar saldo:", error);
            toast.error("No se pudo procesar la recarga. Intente nuevamente.");
        } finally {
            setLoadingTransaction(false);
        }
    };
      
    useEffect(() => {
        fetchCard();
        fetchSaldo();
        fetchHistorialTransacciones();
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
    
    // Formatear fecha para el historial
    const formatearFecha = (fechaString) => {
        const fecha = new Date(fechaString);
        return fecha.toLocaleString('es-ES', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-4 md:p-6">
            <Toaster position="top-center" richColors />
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Gestión Financiera</h1>
            
            {loading ? (
                <div className="flex items-center justify-center my-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3B4CBF]"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sección de Método de Pago */}
                    <div className="bg-white shadow-md rounded-lg p-5 text-black">
                        <h2 className="text-lg md:text-xl font-semibold mb-4 text-[#2B388C]">Método de pago</h2>
                        
                        {!card ? (
                            <div className="mb-5">
                                <p className="text-gray-500 mb-4">No tiene una tarjeta registrada. Agregue una para poder recargar su saldo.</p>
                                <button 
                                    onClick={() => setActiveSection("addCard")} 
                                    className="bg-[#3B4CBF] text-white px-4 py-2 rounded w-full md:w-auto"
                                >
                                    Agregar método de pago
                                </button>
                            </div>
                        ) : (
                            <div className="relative bg-gray-100 p-4 rounded mb-4 text-black">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p><strong>Titular:</strong> {card.titular}</p>
                                        <p><strong>Número:</strong> **** **** **** {card.numero?.slice(-4)}</p>
                                        <p><strong>Vencimiento:</strong> {card.fecha_expiracion}</p>
                                    </div>
                                    <button
                                        onClick={handleDeleteCard}
                                        className="text-red-600 font-medium"
                                        title="Eliminar tarjeta"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {card && (
                            <button 
                                onClick={() => setActiveSection("addCard")} 
                                className="text-[#3B4CBF] border border-[#3B4CBF] px-4 py-2 rounded w-full md:w-auto"
                            >
                                Actualizar tarjeta
                            </button>
                        )}
                    </div>
                    
                    {/* Sección de Saldo */}
                    <div className="bg-white shadow-md rounded-lg p-5 text-black">
                        <h2 className="text-lg md:text-xl font-semibold mb-4 text-[#2B388C]">Saldo disponible</h2>
                        
                        <div className="bg-gray-50 p-4 rounded mb-6">
                            <p className="text-3xl font-bold text-[#2B388C]">
                                ${Number(saldo).toLocaleString()}
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-base font-semibold mb-3">Recargar saldo</h3>
                            
                            {!card ? (
                                <p className="text-amber-600 mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Debe registrar una tarjeta antes de poder recargar saldo
                                </p>
                            ) : (
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
                                    {montosPredefinidos.map((monto) => (
                                        <button
                                            key={monto}
                                            onClick={() => handleRecargarSaldo(monto)}
                                            disabled={loadingTransaction}
                                            className="bg-[#3B4CBF] hover:bg-[#2B388C] text-white py-2 px-4 rounded-md transition-colors"
                                        >
                                            ${monto}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {/* Sección de Historial de Transacciones */}
            <div className="mt-8 bg-white shadow-md rounded-lg p-5 text-black">
                <h2 className="text-lg md:text-xl font-semibold mb-4 text-[#2B388C]">Historial de transacciones</h2>
                
                {historialLoading ? (
                    <div className="flex justify-center my-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#3B4CBF]"></div>
                    </div>
                ) : historialTransacciones.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">No hay transacciones para mostrar</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-100 text-left text-gray-600">
                                    <th className="py-2 px-3">Fecha</th>
                                    <th className="py-2 px-3">Tipo</th>
                                    <th className="py-2 px-3">Monto</th>
                                    <th className="py-2 px-3">Saldo resultante</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historialTransacciones.map((transaccion) => (
                                    <tr key={transaccion.id} className="border-b border-gray-200">
                                        <td className="py-3 px-3">{formatearFecha(transaccion.fecha)}</td>
                                        <td className="py-3 px-3">
                                            <span 
                                                className={`px-2 py-1 rounded-full text-xs ${
                                                    transaccion.tipo_transaccion === 'RECARGA' ? 
                                                    'bg-green-100 text-green-800' : 
                                                    'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {transaccion.tipo_transaccion_display}
                                            </span>
                                        </td>
                                        <td className={`py-3 px-3 font-medium ${
                                            transaccion.tipo_transaccion === 'RECARGA' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {transaccion.tipo_transaccion === 'RECARGA' ? '+' : '-'}${Number(transaccion.monto).toLocaleString()}
                                        </td>
                                        <td className="py-3 px-3">${Number(transaccion.saldo_resultante).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FinancialManagement;
