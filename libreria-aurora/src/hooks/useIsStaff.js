import { useState, useEffect } from 'react';
import { getApiUrlByKey } from '../api/config';

export function useIsStaff() {
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const perfilUrl = getApiUrlByKey('usuariosPerfil');
        const response = await fetch(perfilUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          if (
            userData.tipo_usuario === 'ADMIN' ||
            userData.tipo_usuario === 'BIBLIOTECARIO' ||
            userData.is_staff
          ) {
            setIsStaff(true);
          }
        }
      } catch (error) {
        console.error('Error al verificar el rol del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  return { isStaff, loading };
}