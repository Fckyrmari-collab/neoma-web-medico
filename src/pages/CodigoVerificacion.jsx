import { useEffect, useRef, useState } from 'react';
import AuthCard from '../components/AuthCard.jsx';
import OtpInput from '../components/OtpInput.jsx';
import { IconAlerta, IconCandado, IconCelular, IconRecargar, Spinner } from '../components/Icons.jsx';
import { formatoTiempo, iniciales } from '../utils/validators.js';
import { MAX_INTENTOS, reenviarCodigo, validarCodigo } from '../services/authService.js';

const LONGITUD = 4;
const ESPERA_REENVIO_SEG = 30;

const segundosRestantes = (expiraEn) => Math.max(0, Math.round((expiraEn - Date.now()) / 1000));

export default function CodigoVerificacion({ paciente, solicitud, onVolver, onNuevaSolicitud, onValidado }) {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [validando, setValidando] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [restante, setRestante] = useState(() => segundosRestantes(solicitud.expiraEn));
  const [esperaReenvio, setEsperaReenvio] = useState(ESPERA_REENVIO_SEG);
  const [reenviando, setReenviando] = useState(false);
  const [avisoReenvio, setAvisoReenvio] = useState('');
  const otpRef = useRef(null);

  // Cuenta regresiva del código y del botón "Reenviar"
  useEffect(() => {
    const t = setInterval(() => {
      setRestante(segundosRestantes(solicitud.expiraEn));
      setEsperaReenvio((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [solicitud.expiraEn]);

  // Enfoca la primera casilla al entrar y después de cada intento fallido o reenvío
  // (se hace tras el render, cuando las casillas ya están habilitadas de nuevo).
  const [enfoque, setEnfoque] = useState(0);
  useEffect(() => {
    if (!validando) otpRef.current?.enfocar(0);
  }, [enfoque, validando]);

  const vencido = restante === 0;
  const bloqueado = intentos >= MAX_INTENTOS;
  const completo = codigo.length === LONGITUD;
  const puedeValidar = completo && !validando && !vencido && !bloqueado;

  const onCambioCodigo = (v) => {
    setCodigo(v);
    if (error) setError('');
    if (avisoReenvio) setAvisoReenvio('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!puedeValidar) return;
    setValidando(true);
    const { ok } = await validarCodigo(solicitud.id, codigo);
    setValidando(false);
    if (ok) return onValidado();

    const usados = intentos + 1;
    setIntentos(usados);
    setCodigo('');
    setError(
      usados >= MAX_INTENTOS
        ? 'Demasiados intentos. Reenvía un código nuevo.'
        : 'Código incorrecto. Intenta de nuevo.'
    );
    if (usados < MAX_INTENTOS) setEnfoque((n) => n + 1);
  };

  const onReenviar = async () => {
    if (esperaReenvio > 0 || reenviando) return;
    setReenviando(true);
    const nueva = await reenviarCodigo(paciente.documento);
    onNuevaSolicitud(nueva);
    setRestante(segundosRestantes(nueva.expiraEn));
    setIntentos(0);
    setCodigo('');
    setError('');
    setEsperaReenvio(ESPERA_REENVIO_SEG);
    setReenviando(false);
    setAvisoReenvio('Enviamos un código nuevo a la app del paciente.');
    setEnfoque((n) => n + 1);
  };

  const mensaje = error
    ? { tipo: 'error', texto: error }
    : vencido
      ? { tipo: 'error', texto: 'El código venció. Reenvía uno nuevo.' }
      : avisoReenvio
        ? { tipo: 'ok', texto: avisoReenvio }
        : { tipo: 'info', texto: `El código vence en ${formatoTiempo(restante)}. Aprueba desde tu app.` };

  return (
    <AuthCard
      titulo="Código de Verificación"
      subtitulo={<>Código de verificación enviado a la<br />app móvil del paciente.</>}
      onVolver={onVolver}
    >
      <div className="paciente">
        <span className="paciente__avatar" aria-hidden="true">{iniciales(paciente.nombre)}</span>
        <div className="paciente__datos">
          <strong>{paciente.nombre}</strong>
          <span>
            {paciente.tipoDocumento} {paciente.documento} · {paciente.dispositivo}
          </span>
        </div>
        <IconCelular className="paciente__icono" />
      </div>

      <form onSubmit={onSubmit} noValidate>
        <OtpInput
          ref={otpRef}
          longitud={LONGITUD}
          valor={codigo}
          onChange={onCambioCodigo}
          error={!!error || vencido}
          deshabilitado={validando || bloqueado || vencido}
        />

        <p
          className={`otp__mensaje otp__mensaje--${mensaje.tipo}`}
          role={mensaje.tipo === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          {mensaje.tipo === 'error' && <IconAlerta />}
          {mensaje.texto}
        </p>

        <button
          type="button"
          className="enlace"
          onClick={onReenviar}
          disabled={esperaReenvio > 0 || reenviando}
        >
          <IconRecargar className={reenviando ? 'girar' : ''} />
          {esperaReenvio > 0 ? `Reenviar código en ${esperaReenvio}s` : 'Reenviar código'}
        </button>

        <button type="submit" className="boton" disabled={!puedeValidar}>
          {validando ? (
            <>
              <Spinner /> Validando…
            </>
          ) : (
            <>
              <IconCandado /> Validar e Ingresar
            </>
          )}
        </button>
      </form>
    </AuthCard>
  );
}
