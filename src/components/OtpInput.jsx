import { forwardRef, useImperativeHandle, useRef } from 'react';

/**
 * Casillas para el código numérico.
 * - Avanza solo al escribir, retrocede con Backspace, flechas para moverse.
 * - Permite pegar el código completo.
 */
const OtpInput = forwardRef(function OtpInput(
  { longitud = 4, valor, onChange, error = false, deshabilitado = false },
  ref
) {
  const cajas = useRef([]);

  useImperativeHandle(ref, () => ({
    enfocar: (i = 0) => cajas.current[i]?.focus(),
  }));

  const digitos = Array.from({ length: longitud }, (_, i) => valor[i] ?? '');

  const escribir = (i, d) => {
    const nuevo = [...digitos];
    nuevo[i] = d;
    onChange(nuevo.join(''));
  };

  const onInput = (i, e) => {
    const d = e.target.value.replace(/\D/g, '').slice(-1);
    if (!d) return;
    escribir(i, d);
    if (i < longitud - 1) cajas.current[i + 1]?.focus();
  };

  const onKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (digitos[i]) escribir(i, '');
      else if (i > 0) {
        escribir(i - 1, '');
        cajas.current[i - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && i > 0) cajas.current[i - 1]?.focus();
    else if (e.key === 'ArrowRight' && i < longitud - 1) cajas.current[i + 1]?.focus();
  };

  const onPaste = (e) => {
    const texto = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, longitud);
    if (!texto) return;
    e.preventDefault();
    onChange(texto);
    cajas.current[Math.min(texto.length, longitud - 1)]?.focus();
  };

  return (
    <div className={`otp ${error ? 'otp--error' : ''}`} role="group" aria-label="Código de verificación">
      {digitos.map((d, i) => (
        <input
          key={i}
          ref={(el) => (cajas.current[i] = el)}
          className={`otp__caja ${d ? 'otp__caja--llena' : ''}`}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={d}
          onChange={(e) => onInput(i, e)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={onPaste}
          onFocus={(e) => e.target.select()}
          disabled={deshabilitado}
          aria-label={`Dígito ${i + 1} de ${longitud}`}
          aria-invalid={error}
        />
      ))}
    </div>
  );
});

export default OtpInput;
