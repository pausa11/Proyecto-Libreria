import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { getApiUrl } from '../../api/config';
import LoadingSpinner from '../ui/LoadingSpinner';

function AdminUsuarios() {
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("ALL"); // ALL, ACTIVE, INACTIVE
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserData, setCurrentUserData] = useState(null);
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    superuser: 0,
    admin: 0,
    bibliotecario: 0,
    lector: 0
  });

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    is_active: true,
    is_staff: false,
    is_superuser: false,
    role: 'lector'
  });
  const [isEdit, setIsEdit] = useState(false);

  const baseUrl = getApiUrl("/api/usuarios");

  // Obtener información del usuario actual desde el backend
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error('No token found');
        return null;
      }

      console.log('🌐 Fetching current user from:', `${baseUrl}/perfil/`);

      const response = await fetch(`${baseUrl}/perfil/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const userData = await response.json();
      console.log('📊 Current user data from API:', userData);
      console.log('🔍 User fields analysis:', {
        has_is_staff: 'is_staff' in userData,
        has_is_superuser: 'is_superuser' in userData,
        has_tipo_usuario: 'tipo_usuario' in userData,
        is_staff_value: userData.is_staff,
        is_superuser_value: userData.is_superuser,
        tipo_usuario_value: userData.tipo_usuario
      });
      
      setCurrentUserData(userData);
      return userData;
    } catch (error) {
      console.error("❌ Error fetching current user:", error);
      return null;
    }
  };

  // Determinar rol del usuario basado en los datos del backend
  const determineUserRole = (user) => {
    if (!user) return 'lector';
    
    // Solo loggear una vez para evitar spam
    if (user.id === currentUserData?.id) {
      console.log('🔍 Analyzing current user for role determination:', {
        id: user.id,
        username: user.username,
        is_superuser: user.is_superuser,
        is_staff: user.is_staff,
        tipo_usuario: user.tipo_usuario,
        activo: user.activo,
        is_active: user.is_active
      });
    }
    
    // VERIFICACIÓN ESTRICTA: Los valores deben ser explícitamente true
    if (user.is_superuser === true) {
      console.log('✅ User is superuser');
      return 'superuser';
    }
    
    // VERIFICACIÓN ESTRICTA: is_staff debe ser true Y tener tipo_usuario
    if (user.is_staff === true) {
      console.log('✅ User is staff, checking tipo_usuario:', user.tipo_usuario);
      if (user.tipo_usuario === 'ADMIN') {
        console.log('✅ User role determined as: admin');
        return 'admin';
      } else if (user.tipo_usuario === 'BIBLIOTECARIO') {
        console.log('✅ User role determined as: bibliotecario');
        return 'bibliotecario';
      }
      // Si es staff pero no tiene tipo específico, default a admin
      console.log('⚠️ User is staff but no specific tipo_usuario, defaulting to admin');
      return 'admin';
    }
    
    // FALLBACK: Si tipo_usuario es ADMIN o BIBLIOTECARIO pero is_staff no está definido
    // Esto podría indicar un problema de serialización
    if (user.tipo_usuario === 'ADMIN' && user.is_staff !== true) {
      console.log('🚨 WARNING: User has ADMIN tipo_usuario but is_staff is not true!');
      console.log('🚨 This indicates a serialization or database sync issue');
      return 'admin'; // Tratamos como admin pero esto necesita investigación
    }
    if (user.tipo_usuario === 'BIBLIOTECARIO' && user.is_staff !== true) {
      console.log('🚨 WARNING: User has BIBLIOTECARIO tipo_usuario but is_staff is not true!');
      return 'bibliotecario';
    }
    
    // Si no cumple ninguna condición anterior, es lector
    console.log('✅ User role determined as: lector');
    return 'lector';
  };

  // Obtener rol del usuario actual (sin logs repetitivos)
  const getCurrentUserRole = () => {
    if (!currentUserData) return 'lector';
    return determineUserRole(currentUserData);
  };

  // Verificar permisos para gestionar roles
  const canManageRole = (targetRole) => {
    const currentRole = getCurrentUserRole();
    console.log(`🔐 Checking permissions: ${currentRole} managing ${targetRole}`);
    
    if (currentRole === 'superuser') return true;
    if (currentRole === 'admin' && ['bibliotecario', 'lector'].includes(targetRole)) return true;
    if (currentRole === 'bibliotecario' && targetRole === 'lector') return true;
    return false;
  };

  // Obtener roles disponibles para el usuario actual
  const getAvailableRoles = () => {
    const currentRole = getCurrentUserRole();
    console.log('🎯 Getting available roles for:', currentRole);
    
    if (currentRole === 'superuser') {
      return [
        { value: 'superuser', label: 'Superusuario' },
        { value: 'admin', label: 'Administrador' },
        { value: 'bibliotecario', label: 'Bibliotecario' },
        { value: 'lector', label: 'Lector' }
      ];
    }
    if (currentRole === 'admin') {
      return [
        { value: 'bibliotecario', label: 'Bibliotecario' },
        { value: 'lector', label: 'Lector' }
      ];
    }
    if (currentRole === 'bibliotecario') {
      return [
        { value: 'lector', label: 'Lector' }
      ];
    }
    return [{ value: 'lector', label: 'Lector' }];
  };

  // Función helper para obtener el estado activo del usuario
  const getUserActiveStatus = (user) => {
    // Priorizar is_active, luego activo, por defecto true
    if (user.is_active !== undefined) return user.is_active;
    if (user.activo !== undefined) return user.activo;
    return true;
  };

  // Determinar rol de usuario desde objeto user (para la tabla) - LÓGICA MEJORADA
  const determineUserRoleFromData = (user) => {
    // VERIFICACIÓN ESTRICTA para todos los usuarios en la tabla
    if (user.is_superuser === true) return 'superuser';
    
    if (user.is_staff === true) {
      if (user.tipo_usuario === 'ADMIN') return 'admin';
      if (user.tipo_usuario === 'BIBLIOTECARIO') return 'bibliotecario';
      return 'admin'; // Default para staff sin tipo específico
    }
    
    // CASOS ESPECIALES: usuarios con tipo_usuario pero sin is_staff
    if (user.tipo_usuario === 'ADMIN') {
      console.log(`⚠️ User ${user.username} has ADMIN type but is_staff=${user.is_staff}`);
      return 'admin';
    }
    if (user.tipo_usuario === 'BIBLIOTECARIO') {
      console.log(`⚠️ User ${user.username} has BIBLIOTECARIO type but is_staff=${user.is_staff}`);
      return 'bibliotecario';
    }
    
    return 'lector';
  };

  // Fetch users con filtrado basado en roles del backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }

      console.log('🌐 Fetching users from:', `${baseUrl}/`);

      const response = await fetch(`${baseUrl}/`, {
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
      console.log('📥 Raw user data received:', data);
      
      // DIAGNÓSTICO: Verificar qué campos están llegando
      data.forEach((user, index) => {
        if (index < 3) { // Solo los primeros 3 para no saturar
          console.log(`👤 User ${user.username}:`, {
            is_staff: user.is_staff,
            is_superuser: user.is_superuser,
            tipo_usuario: user.tipo_usuario,
            is_active: user.is_active,
            activo: user.activo
          });
        }
      });
      
      // Agregar determinación de rol a cada usuario
      const usersWithRoles = data.map(user => ({
        ...user,
        determinedRole: determineUserRoleFromData(user),
        // Normalizar el estado activo
        normalizedActive: getUserActiveStatus(user)
      }));

      console.log('👥 Users with determined roles:', usersWithRoles);

      // Filtrar usuarios basado en el rol del usuario actual
      const currentUserRole = getCurrentUserRole();
      let filteredUsers = usersWithRoles;
      
      console.log(`🔍 Current user role: ${currentUserRole}, filtering users...`);
      
      if (currentUserRole === 'admin') {
        // Admins pueden ver admins, bibliotecarios y lectores, pero NO superusers
        filteredUsers = usersWithRoles.filter(user => 
          user.determinedRole === 'admin' ||
          user.determinedRole === 'bibliotecario' ||
          user.determinedRole === 'lector'
        );
        console.log('📋 Admin can see: admins, bibliotecarios and lectores');
      } else if (currentUserRole === 'bibliotecario') {
        // Bibliotecarios solo pueden ver lectores
        filteredUsers = usersWithRoles.filter(user => 
          user.determinedRole === 'lector'
        );
        console.log('📋 Bibliotecario can see: lectores only');
      } else if (currentUserRole === 'superuser') {
        // Superusers pueden ver TODOS los usuarios
        filteredUsers = usersWithRoles;
        console.log('📋 Superuser can see: all users');
      } else if (currentUserRole === 'lector') {
        // Lectores no pueden ver a nadie en administración
        filteredUsers = [];
        console.log('📋 Lector can see: nobody');
      }

      console.log('🔍 Filtered users for current role:', filteredUsers);

      setUsers(filteredUsers);

      // Calcular estadísticas CORRECTAMENTE
      const stats = {
        total: filteredUsers.length,
        active: filteredUsers.filter(u => getUserActiveStatus(u)).length,
        inactive: filteredUsers.filter(u => !getUserActiveStatus(u)).length,
        superuser: filteredUsers.filter(u => u.determinedRole === 'superuser').length,
        admin: filteredUsers.filter(u => u.determinedRole === 'admin').length,
        bibliotecario: filteredUsers.filter(u => u.determinedRole === 'bibliotecario').length,
        lector: filteredUsers.filter(u => u.determinedRole === 'lector').length
      };
      
      console.log('📊 Calculated statistics:', stats);
      setUserStats(stats);

    } catch (error) {
      console.error("❌ Error loading users:", error);
      toast.error("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      console.log('🚀 Component mounted, loading initial data...');
      await fetchCurrentUser();
    };
    
    loadInitialData();
  }, []);

  // Fetch users cuando tenemos la información del usuario currente
  useEffect(() => {
    if (currentUserData) {
      fetchUsers();
    }
  }, [currentUserData]);

  // Open modal for create/edit
  const openModal = (user = null) => {
    if (user) {
      const targetRole = user.determinedRole;
      console.log('✏️ Opening edit modal for user:', user, 'Role:', targetRole);
      
      if (!canManageRole(targetRole)) {
        toast.error("No tienes permisos para editar este usuario");
        return;
      }

      setFormData({
        username: user.username,
        email: user.email,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        password: '',
        is_active: user.is_active,
        is_staff: user.is_staff,
        is_superuser: user.is_superuser,
        role: user.determinedRole
      });
      setIsEdit(true);
      setSelectedUser(user);
    } else {
      console.log('➕ Opening create modal');
      setFormData({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        is_active: true,
        is_staff: false,
        is_superuser: false,
        role: 'lector'
      });
      setIsEdit(false);
      setSelectedUser(null);
    }
    setModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('💾 Submitting form data:', formData);
    
    // Validation
    if (!formData.username || !formData.email) {
      toast.error('Usuario y email son obligatorios');
      return;
    }

    if (!isEdit && !formData.password) {
      toast.error('La contraseña es obligatoria para nuevos usuarios');
      return;
    }

    // Check role permissions
    if (!canManageRole(formData.role)) {
      toast.error('No tienes permisos para asignar este rol');
      return;
    }

    try {
      setLoadingAction(true);
      const token = localStorage.getItem('token');
      
      const method = isEdit ? 'PATCH' : 'POST';
      const url = isEdit ? `${baseUrl}/${selectedUser.id}/` : `${baseUrl}/`;
      
      // Preparar datos - mapear roles a campos del backend
      const submitData = { ...formData };
      
      // Mapear rol a campos del backend
      if (formData.role === 'superuser') {
        submitData.is_superuser = true;
        submitData.is_staff = true;
        submitData.tipo_usuario = 'ADMIN'; // Superuser también es admin
      } else if (formData.role === 'admin') {
        submitData.is_staff = true;
        submitData.is_superuser = false;
        submitData.tipo_usuario = 'ADMIN';
      } else if (formData.role === 'bibliotecario') {
        submitData.is_staff = true;
        submitData.is_superuser = false;
        submitData.tipo_usuario = 'BIBLIOTECARIO';
      } else { // lector
        submitData.is_staff = false;
        submitData.is_superuser = false;
        submitData.tipo_usuario = 'LECTOR';
      }

      // Mapear is_active a activo si es necesario
      if ('is_active' in submitData) {
        submitData.activo = submitData.is_active;
      }

      // Remover password si está vacío en edición
      if (isEdit && !submitData.password) {
        delete submitData.password;
      }

      // Remover campo 'role' ya que no existe en el backend
      delete submitData.role;

      console.log('🌐 Sending request:', method, url, submitData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Server error:', errorData);
        throw new Error(errorData.detail || 'Error al guardar usuario');
      }

      const responseData = await response.json();
      console.log('✅ User saved successfully:', responseData);

      toast.success(isEdit ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');
      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('❌ Error saving user:', error);
      toast.error(error.message || 'Error al guardar usuario');
    } finally {
      setLoadingAction(false);
    }
  };

  // Toggle user active status
  const toggleUserStatus = async (userId, currentStatus) => {
    console.log(`🔄 Toggling user ${userId} status from ${currentStatus} to ${!currentStatus}`);
    
    try {
      setLoadingAction(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${baseUrl}/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // Usar tanto is_active como activo para compatibilidad
        body: JSON.stringify({ 
          is_active: !currentStatus,
          activo: !currentStatus
        })
      });

      if (!response.ok) {
        throw new Error('Error al cambiar estado del usuario');
      }

      toast.success(`Usuario ${!currentStatus ? 'activado' : 'desactivado'} correctamente`);
      fetchUsers();
    } catch (error) {
      console.error('❌ Error toggling user status:', error);
      toast.error('Error al cambiar estado del usuario');
    } finally {
      setLoadingAction(false);
    }
  };

  // Change user role
  const changeUserRole = async (userId, newRole) => {
    console.log(`🎭 Changing user ${userId} role to ${newRole}`);
    
    if (!canManageRole(newRole)) {
      toast.error('No tienes permisos para asignar este rol');
      return;
    }

    try {
      setLoadingAction(true);
      const token = localStorage.getItem('token');
      
      // Preparar datos de rol
      const roleData = {};
      
      if (newRole === 'superuser') {
        roleData.is_superuser = true;
        roleData.is_staff = true;
        roleData.tipo_usuario = 'ADMIN';
      } else if (newRole === 'admin') {
        roleData.is_staff = true;
        roleData.is_superuser = false;
        roleData.tipo_usuario = 'ADMIN';
      } else if (newRole === 'bibliotecario') {
        roleData.is_staff = true;
        roleData.is_superuser = false;
        roleData.tipo_usuario = 'BIBLIOTECARIO';
      } else { // lector
        roleData.is_staff = false;
        roleData.is_superuser = false;
        roleData.tipo_usuario = 'LECTOR';
      }

      const response = await fetch(`${baseUrl}/${userId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(roleData)
      });

      if (!response.ok) {
        throw new Error('Error al cambiar rol del usuario');
      }

      toast.success(`Rol cambiado a ${newRole} correctamente`);
      fetchUsers();
    } catch (error) {
      console.error('❌ Error changing user role:', error);
      toast.error('Error al cambiar rol del usuario');
    } finally {
      setLoadingAction(false);
    }
  };

  // Filter users
  const getFilteredUsers = () => {
    let filtered = users;

    // Filter by status
    if (filter === "ACTIVE") {
      filtered = filtered.filter(user => getUserActiveStatus(user));
    } else if (filter === "INACTIVE") {
      filtered = filtered.filter(user => !getUserActiveStatus(user));
    }

    // Filter by role
    if (roleFilter !== "ALL") {
      filtered = filtered.filter(user => user.determinedRole === roleFilter.toLowerCase());
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  // Get user role display
  const getUserRoleDisplay = (user) => {
    const role = user.determinedRole;
    switch(role) {
      case 'superuser': 
        return { text: 'Superusuario', color: 'bg-purple-100 text-purple-800' };
      case 'admin': 
        return { text: 'Administrador', color: 'bg-red-100 text-red-800' };
      case 'bibliotecario': 
        return { text: 'Bibliotecario', color: 'bg-blue-100 text-blue-800' };
      default: 
        return { text: 'Lector', color: 'bg-green-100 text-green-800' };
    }
  };

  // Format date with error handling
  const formatDate = (dateString) => {
    try {
      if (!dateString || dateString === 'undefined' || dateString === null) {
        return 'Sin fecha';
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('❌ Error formatting date:', error);
      return 'Error en fecha';
    }
  };

  const filteredUsers = getFilteredUsers();
  const currentUserRole = getCurrentUserRole();
  const availableRoles = getAvailableRoles();

  // Show loading until we have current user data
  if (!currentUserData) {
    return (
      <div className="p-4 md:p-6">
        <LoadingSpinner message="Cargando información del usuario..." />
      </div>
    );
  }

  // Check if user has permission to access this section
  if (currentUserRole === 'lector') {
    return (
      <div className="p-4 md:p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h1 className="text-xl font-bold text-yellow-800 mb-2">Acceso Restringido</h1>
          <p className="text-yellow-700">
            No tienes permisos para acceder a la gestión de usuarios. 
            Esta sección está disponible solo para administradores y bibliotecarios.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <Toaster position="top-center" richColors />
      
      {/* Header with user info - SIN DEBUG */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Gestión de Usuarios</h1>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Rol actual: <span className="font-medium text-blue-600">{currentUserRole}</span></p>
            <p className="text-xs">
              Usuario: {currentUserData.username} | 
              Staff: {currentUserData.is_staff ? 'Sí' : 'No'} | 
              Superuser: {currentUserData.is_superuser ? 'Sí' : 'No'}
              {currentUserData.tipo_usuario && ` | Tipo: ${currentUserData.tipo_usuario}`}
            </p>
          </div>
        </div>
        <button 
          onClick={() => openModal()} 
          className="bg-[#3B4CBF] text-white px-4 py-2 rounded-lg hover:bg-[#2D3A99] transition"
        >
          Nuevo Usuario
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total</h3>
          <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Activos</h3>
          <p className="text-2xl font-bold text-green-600">{userStats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Inactivos</h3>
          <p className="text-2xl font-bold text-red-600">{userStats.inactive}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Personal</h3>
          <p className="text-2xl font-bold text-blue-600">
            {userStats.superuser + userStats.admin + userStats.bibliotecario}
          </p>
          <p className="text-xs text-gray-500">
            Super: {userStats.superuser} | Admin: {userStats.admin} | Biblio: {userStats.bibliotecario}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="p-2 border border-gray-300 rounded w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select 
              className="p-2 border border-gray-300 rounded"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">Todos los estados</option>
              <option value="ACTIVE">Activos</option>
              <option value="INACTIVE">Inactivos</option>
            </select>
            
            <select 
              className="p-2 border border-gray-300 rounded"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">Todos los roles</option>
              {currentUserRole === 'superuser' && <option value="SUPERUSER">Superusuarios</option>}
              {(currentUserRole === 'superuser') && <option value="ADMIN">Administradores</option>}
              {(currentUserRole === 'superuser' || currentUserRole === 'admin') && <option value="BIBLIOTECARIO">Bibliotecarios</option>}
              <option value="LECTOR">Lectores</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md">
        {loading ? (
          <LoadingSpinner message="Cargando usuarios..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registro</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const roleDisplay = getUserRoleDisplay(user);
                  const canEdit = canManageRole(user.determinedRole);
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              {user.username[0].toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-xs text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.first_name || user.last_name ? `${user.first_name} ${user.last_name}` : '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${roleDisplay.color}`}>
                          {roleDisplay.text}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          getUserActiveStatus(user) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {getUserActiveStatus(user) ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.fecha_registro)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-col gap-1">
                          {canEdit && (
                            <>
                              <button
                                onClick={() => openModal(user)}
                                className="text-indigo-600 hover:text-indigo-900 text-xs"
                                disabled={loadingAction}
                              >
                                ✏️ Editar
                              </button>
                              <button
                                onClick={() => toggleUserStatus(user.id, getUserActiveStatus(user))}
                                className={`text-xs ${getUserActiveStatus(user) ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                disabled={loadingAction}
                              >
                                {getUserActiveStatus(user) ? '🚫 Desactivar' : '✅ Activar'}
                              </button>
                              {/* Role change options */}
                              {availableRoles.length > 1 && (
                                <select
                                  value={user.determinedRole}
                                  onChange={(e) => changeUserRole(user.id, e.target.value)}
                                  className="text-xs border rounded px-1 py-0.5"
                                  disabled={loadingAction}
                                >
                                  {availableRoles.map(role => (
                                    <option key={role.value} value={role.value}>
                                      {role.label}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </>
                          )}
                          {!canEdit && (
                            <span className="text-xs text-gray-400">Sin permisos</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No se encontraron usuarios que coincidan con los criterios de búsqueda.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for create/edit user */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                  disabled={isEdit}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isEdit ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2 border rounded"
                  required={!isEdit}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  {availableRoles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  <span className="font-medium">Usuario activo</span>
                  <span className="block text-xs text-gray-500">
                    Los usuarios inactivos no pueden iniciar sesión
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                  disabled={loadingAction}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3B4CBF] text-white rounded hover:bg-[#2D3A99] transition"
                  disabled={loadingAction}
                >
                  {loadingAction ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsuarios;
