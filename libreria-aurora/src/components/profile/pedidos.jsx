import { useEffect, useState } from "react";
import { getApiUrl } from "../../api/config";
import { useNavigate } from "react-router-dom";

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistorialPedidos();
  }, []);

const fetchHistorialPedidos = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token no encontrado. Redirigiendo o abortando.");
      return;
    }

    const response = await fetch(getApiUrl("/api/compras/carritos/historial_pedidos/"), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseBody = await response.json();

    if (!response.ok) {
      console.error("Error al obtener historial de pedidos:", responseBody);
      return;
    }

    setPedidos(responseBody);
  } catch (error) {
    console.error("Error de red o excepción:", error);
  }
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 border border-blue-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-6">
            <h2 className="text-xl font-bold text-black border-b-2 border-yellow-400 pb-1">Tus Pedidos</h2>
            <h2 className="text-xl font-semibold text-gray-500">Historial de Compras</h2>
          </div>
          <button onClick={() => navigate(-1)} className="bg-[#c9a875] text-white px-4 py-1 rounded hover:bg-[#a9895e]">Volver</button>
        </div>

        {pedidos.map((pedido) => (
          <div key={pedido.id} className="mb-6 border-t pt-6">
            {pedido.pedidolibro_set.map((item, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <div className="flex-shrink-0">
                  <img src={item.libro.portada} alt={item.libro.titulo} className="w-24 h-32 object-cover rounded-md" />
                </div>
                <div className="flex-1 bg-gray-100 rounded-md p-4">
                  <p className="text-sm text-gray-600"><strong>Descripción:</strong> {item.libro.descripcion}</p>
                  <p className="text-sm text-gray-600 mt-1"><strong>Fecha de Compra:</strong> {new Date(pedido.fecha).toLocaleDateString()}</p>
                  <p className="text-md text-gray-800 mt-2"><strong>Estado:</strong> {pedido.estado}</p>
                </div>
              </div>
            ))}

          </div>
        ))}
      </div>
    </div>
  );
}

export default Pedidos;
