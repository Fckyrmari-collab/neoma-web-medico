import { useEffect, useState } from 'react';
import { obtenerPanel, panelVacio } from '../services/panelService.js';

/**
 * Carga los datos del panel del paciente.
 * Devuelve { datos, cargando, error }. Mientras carga, `datos` es el panel vacío
 * para que los recuadros se dibujen igual.
 */
export default function usePanelPaciente(documento, token) {
  const [estado, setEstado] = useState({ datos: panelVacio(), cargando: true, error: null });

  useEffect(() => {
    let activo = true;
    setEstado((e) => ({ ...e, cargando: true, error: null }));
    obtenerPanel(documento, token)
      .then((datos) => activo && setEstado({ datos, cargando: false, error: null }))
      .catch((err) => activo && setEstado({ datos: panelVacio(), cargando: false, error: err.message }));
    return () => {
      activo = false;
    };
  }, [documento, token]);

  return estado;
}
