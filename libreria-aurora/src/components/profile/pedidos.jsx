import { useEffect, useState } from "react";
import { getApiUrl } from "../../api/config";
import { useNavigate } from "react-router-dom";

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [historialCompras, setHistorialCompras] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistorialPedidos();
  }, []);

  const fetchHistorialPedidos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(getApiUrl("/api/compras/pedidos/historial_pedidos/"), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) setPedidos(data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    }
  };

  const fetchHistorialCompras = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(getApiUrl("/api/compras/historial-compras/"), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setHistorialCompras(data);
        setMostrarHistorial(true);
      }
    } catch (error) {
      console.error("Error al obtener historial de compras:", error);
    }
  };

  const cancelarPedido = async (pedidoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(getApiUrl("/api/compras/pedidos/cancelar_pedido/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pedido_id: pedidoId }),
      });

      if (!response.ok) {
        alert("No se pudo cancelar el pedido.");
        return;
      }

      alert("Pedido cancelado exitosamente.");
      fetchHistorialPedidos();
    } catch (error) {
      console.error("Error al cancelar el pedido:", error);
    }
  };

  const renderPedido = (pedido, permitirCancelar = false) => {
    const cantidadTotal = pedido.pedidolibro_set.reduce(
      (acc, item) => acc + item.cantidad,
      0
    );

    const precioTotal = pedido.pedidolibro_set.reduce(
      (acc, item) => acc + item.cantidad * parseFloat(item.libro.precio),
      0
    );

    return (
      <div key={pedido.id} className="mb-8 border-t pt-6">
        {pedido.pedidolibro_set.map((item, index) => (
          <div key={index} className="flex gap-4 mb-4">
            <div className="flex-shrink-0">
              <img src={item.libro.portada} alt={item.libro.titulo} className="w-24 h-32 object-cover rounded-md" />
            </div>
            <div className="flex-1 bg-gray-100 rounded-md p-4">
              <p className="text-sm text-gray-600"><strong>Descripción:</strong> {item.libro.descripcion}</p>
              <p className="text-sm text-gray-600 mt-1"><strong>Fecha de Compra:</strong> {new Date(pedido.fecha).toLocaleDateString()}</p>
              <p className="text-md text-gray-800 mt-2"><strong>Estado:</strong> {pedido.estado}</p>
              <p className="text-sm text-gray-600 mt-1"><strong>Cantidad:</strong> {item.cantidad}</p>
              <p className="text-sm text-gray-600"><strong>Precio Unitario:</strong> ${parseFloat(item.libro.precio).toFixed(2)}</p>
            </div>
          </div>
        ))}

        <div className="text-right mt-4 pr-4">
          <p className="text-lg font-semibold text-black">📚 Total de libros: {cantidadTotal}</p>
          <p className="text-lg font-semibold text-green-600">💲 Total del pedido: ${precioTotal.toFixed(2)}</p>

          {permitirCancelar && pedido.estado === "Pendiente" && (
            <button
              onClick={() => cancelarPedido(pedido.id)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all"
            >
              Cancelar pedido
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 border border-blue-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-6">
            <h2 className="text-xl font-bold text-black border-b-2 border-yellow-400 pb-1">Tus Pedidos</h2>
            <h2 className="text-xl font-semibold text-gray-500 cursor-pointer hover:text-yellow-600" onClick={fetchHistorialCompras} >
              Historial de Compras
            </h2>
          </div>
          <button onClick={() => navigate(-1)} className="bg-[#c9a875] text-white px-4 py-1 rounded hover:bg-[#a9895e]">Volver</button>
        </div>

        {!mostrarHistorial ? (
          pedidos.length === 0 ? (
            <p className="text-gray-500">No hay pedidos registrados.</p>
          ) : (
            pedidos.map((pedido) => renderPedido(pedido, true))
          )
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Compras registradas</h3>
            {historialCompras.length === 0 ? (
              <p className="text-gray-500">No hay compras registradas.</p>
            ) : (
              historialCompras.map((compra) => renderPedido(compra.pedido, false))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Pedidos;
