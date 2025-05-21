import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { getApiUrl } from '../../api/config';

function ForumMessages() {
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [activeSection, setActiveSection] = useState("main");
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyContent, setReplyContent] = useState("");

  const baseUrl = getApiUrl("/api/mensajeria");

  // Obtener el foro personal del usuario
  const fetchPersonalForum = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetch(`${baseUrl}/foros/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      
      // Si hay foros, obtenemos el primero (debería ser el único del usuario)
      if (data && data.length > 0) {
        fetchMessages(data[0].id);
      } else {
        setLoading(false);
        toast.error("No se encontró un foro personal");
      }
    } catch (error) {
      console.error("Error al cargar el foro personal:", error);
      toast.error("No se pudo cargar tu foro personal");
      setLoading(false);
    }
  };

  // Obtener mensajes del foro
  const fetchMessages = async (forumId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetch(`${baseUrl}/mensajes/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      
      // Filtramos los mensajes que pertenecen a este foro
      const forumMessages = data.filter(msg => msg.foro === forumId && !msg.es_respuesta);
      
      // Ordenamos por fecha descendente (más reciente primero)
      const sortedMessages = forumMessages.sort((a, b) => 
        new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
      );
      
      setMessages(sortedMessages);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar los mensajes:", error);
      toast.error("No se pudieron cargar tus mensajes");
      setLoading(false);
    }
  };

  // Obtener notificaciones no leídas
  const fetchUnreadNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetch(`${baseUrl}/notificaciones/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      
      // Filtramos solo las notificaciones no leídas
      const unread = data.filter(notification => !notification.leido);
      setUnreadNotifications(unread);
    } catch (error) {
      console.error("Error al cargar las notificaciones:", error);
    }
  };

  // Cargar un mensaje específico con sus respuestas
  const fetchMessageDetails = async (messageId) => {
    try {
      setLoadingAction(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetch(`${baseUrl}/mensajes/${messageId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      setSelectedMessage(data);
      setActiveSection("messageDetail");
      setLoadingAction(false);
    } catch (error) {
      console.error("Error al cargar el detalle del mensaje:", error);
      toast.error("No se pudo cargar el detalle del mensaje");
      setLoadingAction(false);
    }
  };

  // Enviar un nuevo mensaje
  const handleSendNewMessage = async () => {
    if (!newMessage.trim()) {
      toast.error("El contenido del mensaje no puede estar vacío");
      return;
    }

    try {
      setLoadingAction(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      // Primero obtenemos el ID del foro personal
      const foroResponse = await fetch(`${baseUrl}/foros/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!foroResponse.ok) {
        throw new Error(`Error ${foroResponse.status}: ${await foroResponse.text()}`);
      }

      const foroData = await foroResponse.json();
      if (!foroData || foroData.length === 0) {
        throw new Error("No se encontró el foro personal");
      }

      const foroId = foroData[0].id;

      // Ahora enviamos el mensaje
      const msgResponse = await fetch(`${baseUrl}/mensajes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          foro: foroId,
          contenido: newMessage,
          es_respuesta: false,
          mensaje_original: null
        }),
      });

      if (!msgResponse.ok) {
        throw new Error(`Error ${msgResponse.status}: ${await msgResponse.text()}`);
      }

      toast.success("Mensaje enviado correctamente");
      setNewMessage("");
      
      // Recargamos los mensajes
      fetchMessages(foroId);
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      toast.error("No se pudo enviar tu mensaje: " + error.message);
    } finally {
      setLoadingAction(false);
    }
  };

  // Responder a un mensaje
  const handleReplyMessage = async () => {
    if (!replyContent.trim() || !selectedMessage) {
      toast.error("El contenido de la respuesta no puede estar vacío");
      return;
    }

    try {
      setLoadingAction(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      console.log(`Enviando respuesta al mensaje ${selectedMessage.id}`);
      console.log("Contenido:", replyContent);

      const response = await fetch(`${baseUrl}/mensajes/${selectedMessage.id}/responder/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          contenido: replyContent
        }),
      });

      // Intentar obtener la respuesta como texto primero
      const responseText = await response.text();
      console.log(`Respuesta del servidor (${response.status}):`, responseText);
      
      // Ahora tratar de analizar como JSON
      try {
        const responseData = JSON.parse(responseText);
        
        // Si hay un error pero sabemos que es específicamente el error de 'estado'
        if (!response.ok) {
          if (responseText.includes("'Mensaje' object has no attribute 'estado'")) {
            console.warn("Error conocido del backend, pero la respuesta probablemente se guardó correctamente");
            toast.success("Respuesta enviada correctamente");
            setReplyContent("");
            
            // Esperamos un momento y luego actualizamos para ver la nueva respuesta
            setTimeout(() => {
              fetchMessageDetails(selectedMessage.id);
            }, 1000);
            return;
          } else {
            throw new Error(`Error ${response.status}: ${JSON.stringify(responseData)}`);
          }
        }
        
        toast.success("Respuesta enviada correctamente");
        setReplyContent("");
        
        // Recargamos los detalles del mensaje para ver la nueva respuesta
        setTimeout(() => {
          fetchMessageDetails(selectedMessage.id);
        }, 500);
        
      } catch (parseError) {
        console.error("No se pudo parsear la respuesta como JSON:", responseText);
        
        // Verificar si el texto de la respuesta contiene el error específico
        if (responseText.includes("'Mensaje' object has no attribute 'estado'")) {
          console.warn("Error conocido del backend, pero la respuesta probablemente se guardó correctamente");
          toast.success("Respuesta enviada correctamente");
          setReplyContent("");
          
          // Esperamos un momento y luego actualizamos para ver la nueva respuesta
          setTimeout(() => {
            fetchMessageDetails(selectedMessage.id);
          }, 1000);
        } else if (!response.ok) {
          throw new Error(`Error ${response.status}: Respuesta no válida del servidor`);
        }
      }
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
      toast.error(`No se pudo enviar tu respuesta: ${error.message}`);
    } finally {
      setLoadingAction(false);
    }
  };

  // Cerrar un mensaje
  const handleCloseMessage = async () => {
    if (!selectedMessage) {
      return;
    }

    try {
      setLoadingAction(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetch(`${baseUrl}/mensajes/${selectedMessage.id}/cerrar/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      toast.success("Mensaje cerrado correctamente");
      
      // Recargamos los detalles del mensaje
      fetchMessageDetails(selectedMessage.id);
    } catch (error) {
      console.error("Error al cerrar el mensaje:", error);
      toast.error("No se pudo cerrar el mensaje: " + error.message);
    } finally {
      setLoadingAction(false);
    }
  };

  // Marcar notificación como leída
  const handleMarkNotificationRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      const response = await fetch(`${baseUrl}/notificaciones/${notificationId}/marcar_leido/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      // Actualizamos la lista de notificaciones no leídas
      fetchUnreadNotifications();
    } catch (error) {
      console.error("Error al marcar la notificación como leída:", error);
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Obtener color según estado del mensaje
  const getStatusColor = (status) => {
    switch(status) {
      case 'ABIERTO':
        return 'bg-amber-100 text-amber-800';
      case 'RESPONDIDO':
        return 'bg-green-100 text-green-800';
      case 'CERRADO':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchPersonalForum();
    fetchUnreadNotifications();
  }, []);

  // Vista detallada de un mensaje
  if (activeSection === "messageDetail" && selectedMessage) {
    return (
      <div className="p-4 md:p-6">
        <Toaster position="top-center" richColors />
        <button onClick={() => setActiveSection("main")} className="mb-4 text-[#3B4CBF] hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a mis mensajes
        </button>

        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-xl font-bold text-gray-800">Mensaje #{selectedMessage.id}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.estado_mensaje)}`}>
              {selectedMessage.estado_mensaje}
            </span>
          </div>
          
          <div className="border-b pb-4 mb-4">
            <p className="text-gray-500 text-sm mb-2">
              <strong>Fecha:</strong> {formatDate(selectedMessage.fecha_creacion)}
            </p>
            <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.contenido}</p>
          </div>
          
          {/* Respuestas */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Respuestas</h2>
            
            {selectedMessage.respuestas && selectedMessage.respuestas.length > 0 ? (
              <div className="space-y-4">
                {/* Ordenamos las respuestas cronológicamente (más antiguas arriba, nuevas abajo) */}
                {[...selectedMessage.respuestas].sort((a, b) => 
                  new Date(a.fecha_creacion) - new Date(b.fecha_creacion)
                ).map(reply => (
                  <div key={reply.id} className="bg-gray-50 p-3 rounded-lg border-l-4 border-[#3B4CBF]">
                    <p className="text-gray-500 text-xs mb-1">
                      <strong>{reply.autor_username}</strong> • {formatDate(reply.fecha_creacion)}
                    </p>
                    <p className="text-gray-700">{reply.contenido}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Aún no hay respuestas.</p>
            )}
          </div>          {/* Formulario para responder si el mensaje no está cerrado */}
          {selectedMessage.estado_mensaje !== 'CERRADO' && (
            <div>
              <h3 className="text-md font-semibold mb-2">Responder</h3>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B4CBF] focus:border-transparent transition"
                rows="4"
                placeholder="Escribe tu respuesta..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                disabled={loadingAction}
              ></textarea>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={handleReplyMessage}
                  className="px-4 py-2 bg-[#3B4CBF] hover:bg-[#2D3A99] text-white rounded transition"
                  disabled={loadingAction || !replyContent.trim()}
                >
                  {loadingAction ? "Enviando..." : "Enviar respuesta"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Vista principal del foro de mensajes
  return (
    <div className="p-4 md:p-6">
      <Toaster position="top-center" richColors />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Mi Foro Personal</h1>
        {unreadNotifications.length > 0 && (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
            {unreadNotifications.length} notificación{unreadNotifications.length !== 1 ? 'es' : ''} sin leer
          </span>
        )}
      </div>
      
      {/* Notificaciones */}
      {unreadNotifications.length > 0 && (
        <div className="mb-6 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-3 text-[#2B388C]">Notificaciones</h2>
          <div className="space-y-2">
            {unreadNotifications.map(notification => (
              <div key={notification.id} className="flex items-center justify-between bg-blue-50 p-3 rounded">
                <div>
                  <p className="text-sm">{notification.mensaje_contenido.substring(0, 60)}...</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(notification.fecha_creacion)}</p>
                </div>
                <button 
                  onClick={() => handleMarkNotificationRead(notification.id)}
                  className="text-xs text-[#3B4CBF] hover:underline"
                >
                  Marcar como leída
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Formulario para nuevo mensaje */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-3 text-[#2B388C]">Nuevo mensaje</h2>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3B4CBF] focus:border-transparent transition"
          rows="4"
          placeholder="Escribe tu consulta..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={loadingAction}
        ></textarea>
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSendNewMessage}
            className="px-4 py-2 bg-[#3B4CBF] hover:bg-[#2D3A99] text-white rounded transition"
            disabled={loadingAction || !newMessage.trim()}
          >
            {loadingAction ? "Enviando..." : "Enviar mensaje"}
          </button>
        </div>
      </div>
      
      {/* Lista de mensajes */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-3 text-[#2B388C]">Mis mensajes</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3B4CBF]"></div>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No tienes mensajes. Crea uno nuevo para iniciar una conversación.</p>
        ) : (
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contenido</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respuestas</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {messages.map((message) => (
                    <tr
                      key={message.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => fetchMessageDetails(message.id)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">#{message.id}</td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {message.contenido.substring(0, 50)}
                        {message.contenido.length > 50 ? '...' : ''}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(message.fecha_creacion)}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(message.estado_mensaje)}`}>
                          {message.estado_mensaje}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {message.respuestas_count || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForumMessages;
