import { useRef, useState } from 'react';
import AuthCard from '../components/AuthCard.jsx';
import { IconAlerta, IconDocumento, IconFlecha, IconShield, Spinner } from '../components/Icons.jsx';
import { documentoValido, soloDigitos } from '../utils/validators.js';
import { solicitarCodigo } from '../services/authService.js';

export default function AccesoDocumento({ onSolicitado }) {
  const [documento, setDocumento] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const inputRef = useRef(null);

  const onChange = (e) => {
    // Solo números, puntos y espacios; máximo 13 caracteres (ej. 1.234.567.890)
    const v = e.target.value.replace(/[^\d.\s]/g, '').slice(0, 13);
    setDocumento(v);
    if (error) setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!documentoValido(documento)) {
      setError('Ingresa un número de documento válido.');
      inputRef.current?.focus();
      return;
    }
    setEnviando(true);
    try {
      const respuesta = await solicitarCodigo(soloDigitos(documento));
      onSolicitado(respuesta);
    } catch {
      setError('No pudimos contactar al paciente. Intenta de nuevo.');
      setEnviando(false);
    }
  };

  return (
    <AuthCard titulo="Acceso Médico" subtitulo="Autorización de Paciente">
      <div className="aviso" role="note">
        <IconShield />
        <p>El acceso requiere consentimiento activo del paciente a través de su aplicación NEOMA.</p>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="documento" className="campo__label">
          Número de documento del paciente
        </label>
        <div className={`campo ${error ? 'campo--error' : ''}`}>
          <IconDocumento className="campo__icono" />
          <input
            ref={inputRef}
            id="documento"
            name="documento"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ej: CC 12.345.678"
            value={documento}
            onChange={onChange}
            disabled={enviando}
            aria-invalid={!!error}
            aria-describedby={error ? 'documento-error' : undefined}
            autoFocus
          />
        </div>
        {error && (
          <p id="documento-error" className="mensaje-error" role="alert">
            <IconAlerta /> {error}
          </p>
        )}

        <button type="submit" className="boton" disabled={enviando}>
          {enviando ? (
            <>
              <Spinner /> Enviando solicitud…
            </>
          ) : (
            <>
              Solicitar Código de Acceso <IconFlecha />
            </>
          )}
        </button>
      </form>

      <p className="card__nota">Se enviará una notificación push a la app NEOMA del paciente.</p>
    </AuthCard>
  );
}
