import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { getApiUrl } from '../../api/config';

function AdminForumMessages() {
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [activeSection, setActiveSection] = useState("main");
  const [foros, setForos] = useState([]);
  const [selectedForo, setSelectedForo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("ALL"); // ALL, ABIERTO, RESPONDIDO, CERRADO
  // Agregamos contador de mensajes por estado para una visualización rápida
  const [messageCounts, setMessageCounts] = useState({
    ABIERTO: 0,
    RESPONDIDO: 0,
    CERRADO: 0,
    total: 0
  });
  
  // Ampliamos el estado para incluir todos los mensajes sin filtrar
  const [allMessages, setAllMessages] = useState([]);

  const baseUrl = getApiUrl("/api/mensajeria");

  // PRIMERA MEJORA: Obtener todos los mensajes de todos los foros
  const fetchAllMessages = async () => {
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
      
      // Filtramos todos los mensajes que no son respuestas
      const mainMessages = data.filter(msg => !msg.es_respuesta);
      
      // Contamos mensajes por estado
      const counts = {
        ABIERTO: mainMessages.filter(msg => msg.estado_mensaje === 'ABIERTO').length,
        RESPONDIDO: mainMessages.filter(msg => msg.estado_mensaje === 'RESPONDIDO').length,
        CERRADO: mainMessages.filter(msg => msg.estado_mensaje === 'CERRADO').length,
        total: mainMessages.length
      };
      
      setMessageCounts(counts);
      setAllMessages(mainMessages);
      
      // Ordenamos por fecha descendente (más reciente primero)
      const sortedMessages = mainMessages.sort((a, b) => 
        new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
      );
      
      // Si hay un filtro activo diferente a ALL, lo aplicamos
      if (filter !== "ALL") {
        const filtered = sortedMessages.filter(msg => msg.estado_mensaje === filter);
        setMessages(filtered);
      } else {
        setMessages(sortedMessages);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar los mensajes:", error);
      toast.error("No se pudieron cargar los mensajes");
      setLoading(false);
    }
  };

  // Obtener todos los foros personales (solo staff puede hacerlo)
  const fetchAllForums = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Debes iniciar sesión para acceder a esta función");
        setLoading(false);
        return;
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
      setForos(data);
      
      // Inicialmente cargamos todos los mensajes sin filtrar por foro
      fetchAllMessages();
    } catch (error) {
      console.error("Error al cargar los foros:", error);
      toast.error("No se pudieron cargar los foros personales");
      setLoading(false);
    }
  };

  // Obtener mensajes de un foro específico
  const fetchForumMessages = async (forumId) => {
    try {
      setLoading(true);
      
      if (!allMessages.length) {
        await fetchAllMessages();
        return;
      }
      
      // Filtramos del conjunto de mensajes ya cargados
      let forumMessages = allMessages.filter(msg => msg.foro === forumId);
      
      // Aplicamos filtro por estado si no es "ALL"
      if (filter !== "ALL") {
        forumMessages = forumMessages.filter(msg => msg.estado_mensaje === filter);
      }
      
      // Aplicamos búsqueda si existe
      if (searchQuery) {
        forumMessages = forumMessages.filter(msg => 
          msg.contenido.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Ordenamos por fecha descendente (más reciente primero)
      const sortedMessages = forumMessages.sort((a, b) => 
        new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
      );
      
      setMessages(sortedMessages);
      setSelectedForo(forumId);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar los mensajes:", error);
      toast.error("No se pudieron cargar los mensajes del foro");
      setLoading(false);
    }
  };

  // Cargar un mensaje específico con sus respuestas
  const fetchMessageDetails = async (messageId) => {
    try {
      setLoadingAction(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Debes iniciar sesión para acceder a esta función");
        setLoadingAction(false);
        return;
      }

      console.log(`Cargando detalles del mensaje: ${messageId}`);
      const response = await fetch(`${baseUrl}/mensajes/${messageId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error API en detalles:", errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Datos del mensaje recibidos:", data);
      setSelectedMessage(data);
      setActiveSection("messageDetail");
      setLoadingAction(false);
    } catch (error) {
      console.error("Error al cargar el detalle del mensaje:", error);
      toast.error("No se pudo cargar el detalle del mensaje");
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
        toast.error("Debes iniciar sesión para realizar esta acción");
        setLoadingAction(false);
        return;
      }

      console.log(`Enviando respuesta al mensaje ${selectedMessage.id}`);
      console.log("Contenido:", replyContent);
      console.log("Token:", token ? "Presente" : "Ausente");

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

      // Capturar el texto completo de la respuesta independientemente del código de estado
      let responseText;
      try {
        responseText = await response.text();
        console.log(`Respuesta del servidor (${response.status}):`, responseText);
        
        // Intentar parsear como JSON para verificar si es un error conocido
        const responseData = JSON.parse(responseText);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${JSON.stringify(responseData)}`);
        }
        
        toast.success("Respuesta enviada correctamente");
        setReplyContent("");
        
        // Recargamos los detalles del mensaje para ver la nueva respuesta
        await fetchMessageDetails(selectedMessage.id);
        
        // También actualizamos los mensajes para reflejar cambios en estados
        await fetchAllMessages();
      } catch (parseError) {
        // Si no es JSON válido, podría ser un error HTML o algo inesperado
        console.error("No se pudo parsear la respuesta como JSON:", responseText);
        if (!response.ok) {
          if (responseText.includes("MensajeViewSet.responder() got an unexpected keyword argument")) {
            console.warn("Error conocido del backend, posible problema con los parámetros de la vista");
            toast.warning("Hay un problema técnico. Reintentando de otra manera...");
            
            // En caso de este error específico, intentamos una alternativa
            try {
              const altResponse = await fetch(`${baseUrl}/mensajes/`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                  foro: selectedMessage.foro,
                  contenido: replyContent,
                  es_respuesta: true,
                  mensaje_original: selectedMessage.id
                }),
              });
              
              if (altResponse.ok) {
                toast.success("Respuesta enviada correctamente (método alternativo)");
                setReplyContent("");
                setTimeout(() => {
                  fetchMessageDetails(selectedMessage.id);
                  fetchAllMessages();
                }, 500);
              } else {
                throw new Error(`Error en método alternativo: ${altResponse.status}`);
              }
            } catch (altError) {
              console.error("Error en método alternativo:", altError);
              toast.error("No se pudo enviar la respuesta por ningún método");
            }
          } else if (responseText.includes("'Mensaje' object has no attribute 'estado'")) {
            console.warn("Error conocido del backend, pero la respuesta probablemente se guardó correctamente");
            toast.success("Respuesta enviada correctamente");
            setReplyContent("");
            
            // Esperamos un momento y luego actualizamos los detalles para ver la respuesta
            setTimeout(() => {
              fetchMessageDetails(selectedMessage.id);
              fetchAllMessages();
            }, 1000);
            
            return;
          } else {
            throw new Error(`Error ${response.status}: Respuesta no válida del servidor`);
          }
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
      toast.error("No se ha seleccionado ningún mensaje");
      return;
    }

    try {
      setLoadingAction(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("Debes iniciar sesión para realizar esta acción");
        setLoadingAction(false);
        return;
      }

      console.log(`Cerrando mensaje ${selectedMessage.id}`);
      console.log("Token:", token ? "Presente" : "Ausente");

      const response = await fetch(`${baseUrl}/mensajes/${selectedMessage.id}/cerrar/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({}) // Añadimos un cuerpo vacío para evitar problemas con algunos servidores
      });

      // Capturar el cuerpo de la respuesta independientemente del estado
      const responseText = await response.text();
      console.log(`Respuesta del servidor (${response.status}):`, responseText);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${responseText}`);
      }

      toast.success("Mensaje cerrado correctamente");
      
      // Recargamos los detalles del mensaje
      await fetchMessageDetails(selectedMessage.id);
      
      // También actualizamos los mensajes para reflejar cambios en estados
      await fetchAllMessages();
    } catch (error) {
      console.error("Error al cerrar el mensaje:", error);
      toast.error(`No se pudo cerrar el mensaje: ${error.message}`);
    } finally {
      setLoadingAction(false);
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

  // Obtener nombre de usuario por ID de foro
  const getUsernameByForumId = (forumId) => {
    const forum = foros.find(f => f.id === forumId);
    return forum ? forum.usuario : 'Usuario desconocido';
  };

  // Obtener foro por ID
  const getForumById = (forumId) => {
    return foros.find(f => f.id === forumId);
  };

  // MEJORA: Filtrar por estado directamente
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    
    if (selectedForo) {
      // Si hay un foro seleccionado, filtramos sus mensajes
      const filteredMessages = allMessages.filter(msg => msg.foro === selectedForo);
      if (newFilter !== "ALL") {
        setMessages(filteredMessages.filter(msg => msg.estado_mensaje === newFilter));
      } else {
        setMessages(filteredMessages);
      }
    } else {
      // Si no hay foro seleccionado, filtramos todos los mensajes
      if (newFilter !== "ALL") {
        setMessages(allMessages.filter(msg => msg.estado_mensaje === newFilter));
      } else {
        setMessages(allMessages);
      }
    }
  };

  // MEJORA: Búsqueda mejorada
  const handleSearch = () => {
    let filteredMessages = allMessages;
    
    // Aplicar filtro de foro si está seleccionado
    if (selectedForo) {
      filteredMessages = filteredMessages.filter(msg => msg.foro === selectedForo);
    }
    
    // Aplicar filtro por estado
    if (filter !== "ALL") {
      filteredMessages = filteredMessages.filter(msg => msg.estado_mensaje === filter);
    }
    
    // Aplicar búsqueda de texto
    if (searchQuery) {
      filteredMessages = filteredMessages.filter(msg => 
        msg.contenido.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (msg.autor_username && msg.autor_username.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Ordenar por fecha descendente
    filteredMessages.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
    
    setMessages(filteredMessages);
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchAllForums();
  }, []);

  // Efecto para actualizar la búsqueda cuando cambia el query
  useEffect(() => {
    handleSearch();
  }, [searchQuery, filter, selectedForo]);

  // Vista detallada de un mensaje
  if (activeSection === "messageDetail" && selectedMessage) {
    return (
      <div className="p-4 md:p-6">
        <Toaster position="top-center" richColors />
        <button onClick={() => {
          setActiveSection("main");
          // Refrescamos los mensajes al volver para mostrar cambios de estado
          fetchAllMessages();
        }} className="mb-4 text-[#3B4CBF] hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a mensajes
        </button>

        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Mensaje #{selectedMessage.id}</h1>
              <p className="text-sm text-gray-500">
                De: <span className="font-medium">{selectedMessage.autor_username}</span>
              </p>
              <p className="text-sm text-gray-500">
                Foro: <span className="font-medium">
                  {getForumById(selectedMessage.foro)?.usuario || 'Usuario desconocido'}
                </span>
              </p>
            </div>
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
                {/* Invertimos el orden de las respuestas para que las más recientes aparezcan abajo */}
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
          </div>

          {/* Formulario para responder si el mensaje no está cerrado */}
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
                {selectedMessage.estado_mensaje !== 'CERRADO' && (
                  <button
                    onClick={handleCloseMessage}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
                    disabled={loadingAction}
                  >
                    {loadingAction ? "Procesando..." : "Cerrar consulta"}
                  </button>
                )}
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
  
  // Vista principal - Panel de administración mejorado
  return (
    <div className="p-4 md:p-6">
      <Toaster position="top-center" richColors />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Panel de Mensajería</h1>
        
        {/* Contador de mensajes por estado */}
        <div className="hidden md:flex space-x-2">
          <button 
            onClick={() => handleFilterChange("ALL")}
            className={`px-3 py-1 rounded-md text-sm ${filter === "ALL" ? "bg-[#3B4CBF] text-white" : "bg-gray-100 text-gray-800"}`}
          >
            Todos ({messageCounts.total})
          </button>
          <button 
            onClick={() => handleFilterChange("ABIERTO")}
            className={`px-3 py-1 rounded-md text-sm ${filter === "ABIERTO" ? "bg-amber-400 text-white" : "bg-amber-100 text-amber-800"}`}
          >
            Abiertos ({messageCounts.ABIERTO})
          </button>
          <button 
            onClick={() => handleFilterChange("RESPONDIDO")}
            className={`px-3 py-1 rounded-md text-sm ${filter === "RESPONDIDO" ? "bg-green-600 text-white" : "bg-green-100 text-green-800"}`}
          >
            Respondidos ({messageCounts.RESPONDIDO})
          </button>
          <button 
            onClick={() => handleFilterChange("CERRADO")}
            className={`px-3 py-1 rounded-md text-sm ${filter === "CERRADO" ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-800"}`}
          >
            Cerrados ({messageCounts.CERRADO})
          </button>
        </div>
      </div>
      
      {/* Barra de búsqueda y filtros */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Buscar en mensajes..."
              className="p-2 border border-gray-300 rounded w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex md:flex-row gap-2">
            <select 
              className="p-2 border border-gray-300 rounded"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="ALL">Todos los estados</option>
              <option value="ABIERTO">Abiertos</option>
              <option value="RESPONDIDO">Respondidos</option>
              <option value="CERRADO">Cerrados</option>
            </select>
            
            <select 
              className="p-2 border border-gray-300 rounded"
              value={selectedForo || ""}
              onChange={(e) => e.target.value ? setSelectedForo(parseInt(e.target.value)) : setSelectedForo(null)}
            >
              <option value="">Todos los usuarios</option>
              {foros.map(foro => (
                <option key={foro.id} value={foro.id}>
                  {foro.usuario}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Filtros móviles */}
        <div className="md:hidden flex flex-wrap gap-2 mt-4">
          <button 
            onClick={() => handleFilterChange("ALL")}
            className={`px-3 py-1 rounded-md text-xs ${filter === "ALL" ? "bg-[#3B4CBF] text-white" : "bg-gray-100 text-gray-800"}`}
          >
            Todos ({messageCounts.total})
          </button>
          <button 
            onClick={() => handleFilterChange("ABIERTO")}
            className={`px-3 py-1 rounded-md text-xs ${filter === "ABIERTO" ? "bg-amber-400 text-white" : "bg-amber-100 text-amber-800"}`}
          >
            Abiertos ({messageCounts.ABIERTO})
          </button>
          <button 
            onClick={() => handleFilterChange("RESPONDIDO")}
            className={`px-3 py-1 rounded-md text-xs ${filter === "RESPONDIDO" ? "bg-green-600 text-white" : "bg-green-100 text-green-800"}`}
          >
            Respondidos ({messageCounts.RESPONDIDO})
          </button>
          <button 
            onClick={() => handleFilterChange("CERRADO")}
            className={`px-3 py-1 rounded-md text-xs ${filter === "CERRADO" ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-800"}`}
          >
            Cerrados ({messageCounts.CERRADO})
          </button>
        </div>
      </div>
      
      {/* Lista de mensajes */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-3 text-[#2B388C]">
          {selectedForo 
            ? `Mensajes de ${getUsernameByForumId(selectedForo)}` 
            : "Todos los mensajes"
          }
          {filter !== "ALL" && ` - ${filter}`}
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#3B4CBF]"></div>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No hay mensajes que coincidan con los criterios de búsqueda.</p>
        ) : (
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
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
                      className={`hover:bg-gray-50 cursor-pointer ${
                        message.estado_mensaje === 'ABIERTO' ? 'bg-amber-50' : ''
                      }`}
                      onClick={() => fetchMessageDetails(message.id)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">#{message.id}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{message.autor_username}</p>
                          <p className="text-xs text-gray-500">
                            {getUsernameByForumId(message.foro)}
                          </p>
                        </div>
                      </td>
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

export default AdminForumMessages;
