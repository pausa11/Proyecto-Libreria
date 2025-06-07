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

  // Crear o editar libro
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `${librosUrl}${selectedLibro.id}/` : librosUrl;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Error al guardar libro');
      toast.success(isEdit ? 'Libro actualizado' : 'Libro creado');
      closeModal();
      fetchLibros();
    } catch (e) {
      toast.error('Error al guardar libro');
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
