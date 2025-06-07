import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { getApiUrl } from '../../api/config';
import LoadingSpinner from '../ui/LoadingSpinner';

function AdminLibros() {
  const [loading, setLoading] = useState(true);
  const [libros, setLibros] = useState([]);
  const [selectedLibro, setSelectedLibro] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    isbn: '',
    categoria: '',
    precio: '',
    stock: '',
    año_publicacion: '',
  });
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCover, setSelectedCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [mensajeCover, setMensajeCover] = useState('');

  const librosUrl = getApiUrl('/api/libros/');

  // Cargar libros
  const fetchLibros = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(librosUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error al cargar libros');
      const data = await response.json();
      setLibros(data);
    } catch (e) {
      toast.error('No se pudieron cargar los libros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLibros(); }, []);

  // Abrir modal para crear/editar
  const openModal = (libro = null) => {
    if (libro) {
      setFormData({ ...libro });
      setIsEdit(true);
      setSelectedLibro(libro);
    } else {
      setFormData({
        titulo: '', autor: '', isbn: '', categoria: '', precio: '', stock: '', año_publicacion: '',
      });
      setIsEdit(false);
      setSelectedLibro(null);
    }
    setModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedLibro(null);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const method = isEdit ? 'PATCH' : 'POST';
      const url = isEdit ? `${librosUrl}${selectedLibro.id}/` : librosUrl;
      
      // Usar FormData si hay una imagen seleccionada
      let requestBody;
      let headers = {
        'Authorization': `Bearer ${token}`
      };

      if (selectedCover) {
        // Si hay imagen nueva, usar FormData
        const formDataToSend = new FormData();
        
        // Agregar todos los campos del formulario
        Object.keys(formData).forEach(key => {
          if (formData[key] !== '') {
            formDataToSend.append(key, formData[key]);
          }
        });
        
        // Agregar la imagen
        formDataToSend.append('portada', selectedCover);
        requestBody = formDataToSend;
        
        // No establecer Content-Type para FormData (el navegador lo hace automáticamente)
      } else {
        // Si no hay imagen, usar JSON como antes
        headers['Content-Type'] = 'application/json';
        requestBody = JSON.stringify(formData);
      }

      const response = await fetch(url, {
        method,
        headers,
        body: requestBody
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al guardar libro');
      }

      const responseData = await response.json();
      
      toast.success(isEdit ? 'Libro actualizado correctamente' : 'Libro creado correctamente');
      
      // Limpiar el estado de la imagen seleccionada
      setSelectedCover(null);
      setCoverPreview(null);
      setMensajeCover('');
      
      closeModal();
      fetchLibros();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Error al guardar libro');
    }
  };

  // Eliminar libro
  const handleDelete = async (libroId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este libro?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${librosUrl}${libroId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Error al eliminar libro');
      toast.success('Libro eliminado');
      fetchLibros();
    } catch (e) {
      toast.error('No se pudo eliminar el libro');
    }
  };

  // Manejar selección de carátula
  const handleCoverSelect = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedCover(null);
      setCoverPreview(null);
      return;
    }
    const file = e.target.files[0];
    setSelectedCover(file);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    const objectUrl = URL.createObjectURL(file);
    setCoverPreview(objectUrl);
  };

  // Subir carátula
  const uploadCover = async () => {
    if (!selectedCover) return;
    setIsUploadingCover(true);
    setMensajeCover("⏳ Subiendo carátula...");
    try {
      const token = localStorage.getItem('token');
      const formDataCover = new FormData();
      formDataCover.append('caratula', selectedCover);
      // PUT o PATCH según tu backend
      const response = await fetch(`${librosUrl}${isEdit ? selectedLibro.id + '/' : ''}subir_caratula/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataCover
      });
      if (!response.ok) throw new Error('Error al subir carátula');
      setMensajeCover('Carátula subida correctamente');
      fetchLibros();
    } catch (e) {
      setMensajeCover('Error al subir carátula');
    } finally {
      setIsUploadingCover(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <Toaster position="top-center" richColors />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Gestión de Libros</h1>
        <button onClick={() => openModal()} className="bg-[#3B4CBF] text-white px-4 py-2 rounded-lg">Nuevo Libro</button>
      </div>
      {loading ? (
        <LoadingSpinner message="Cargando libros..." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ISBN</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Año</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {libros.map((libro) => (
                <tr key={libro.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">#{libro.id}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{libro.titulo}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{libro.autor}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{libro.isbn}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{libro.categoria}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">${libro.precio}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{libro.stock}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{libro.año_publicacion}</td>
                  <td className="px-4 py-4 whitespace-nowrap flex gap-2">
                    <button onClick={() => openModal(libro)} className="text-blue-600 hover:underline">Editar</button>
                    <button onClick={() => handleDelete(libro.id)} className="text-red-600 hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal para crear/editar libro */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{isEdit ? 'Editar Libro' : 'Nuevo Libro'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Título" className="w-full p-2 border rounded" required />
              <input name="autor" value={formData.autor} onChange={handleChange} placeholder="Autor" className="w-full p-2 border rounded" required />
              <input name="isbn" value={formData.isbn} onChange={handleChange} placeholder="ISBN" className="w-full p-2 border rounded" required />
              <input name="categoria" value={formData.categoria} onChange={handleChange} placeholder="Categoría" className="w-full p-2 border rounded" required />
              <input name="precio" value={formData.precio} onChange={handleChange} placeholder="Precio" type="number" className="w-full p-2 border rounded" required />
              <input name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" type="number" className="w-full p-2 border rounded" required />
              <input name="año_publicacion" value={formData.año_publicacion} onChange={handleChange} placeholder="Año de publicación" type="number" className="w-full p-2 border rounded" required />
              {/* Sección de carátula actualizada */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4 shadow-sm">
                <h3 className="text-lg font-medium mb-3">Carátula del libro</h3>
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Imagen actual */}
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-medium mb-2 text-gray-600">Actual</p>
                    {selectedLibro?.portada_url ? (
                      <img
                        src={selectedLibro.portada_url}
                        alt="Carátula actual"
                        className="rounded h-32 w-24 object-cover border border-gray-300"
                      />
                    ) : (
                      <div className="rounded bg-gray-200 h-32 w-24 flex items-center justify-center text-gray-500 text-2xl border border-gray-300">
                        📚
                      </div>
                    )}
                  </div>
                  
                  {/* Vista previa de nueva imagen */}
                  {coverPreview && (
                    <div className="flex flex-col items-center">
                      <p className="text-xs font-medium mb-2 text-blue-600">Nueva carátula</p>
                      <img 
                        src={coverPreview} 
                        alt="Vista previa" 
                        className="rounded h-32 w-24 object-cover border-2 border-blue-300" 
                      />
                    </div>
                  )}
                  
                  {/* Controles de selección */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="mb-3">
                      <label htmlFor="caratula-libro" className="block text-sm font-medium text-gray-700 mb-2">
                        {selectedLibro?.portada_url ? 'Cambiar carátula' : 'Agregar carátula'}
                      </label>
                      <input
                        id="caratula-libro"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleCoverSelect}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                    
                    {selectedCover && (
                      <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                        ✓ Nueva imagen seleccionada: {selectedCover.name}
                        <br />
                        Se subirá automáticamente al guardar el libro.
                      </div>
                    )}
                    
                    {mensajeCover && (
                      <div className="text-sm text-blue-600 mt-2">
                        {mensajeCover}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-2">
                      Formatos soportados: JPG, PNG, WebP<br />
                      Tamaño recomendado: 300x450px<br />
                      La imagen se subirá automáticamente a Cloudinary.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#3B4CBF] text-white rounded">{isEdit ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLibros;
