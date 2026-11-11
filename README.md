# NEOMA · Web del Médico (frontend)

Inicio del portal médico: el médico escribe el documento del paciente, el paciente recibe un código en su app NEOMA y, al ingresarlo, el médico entra al historial.

## Cómo correrlo

Requisito: Node.js 18 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:5173

Para generar la versión final: `npm run build` (queda en la carpeta `dist/`).

## Flujo

1. **Acceso Médico**: documento del paciente (cédula de 6 a 10 dígitos). Si no es válido, el campo se pone en rojo.
2. **Código de Verificación**: 4 casillas, vence en 5 minutos, reenviar cada 30 s, máximo 5 intentos.
3. **Panel del paciente**: encabezado con datos del paciente y pestañas.
   - **NEOMA AI** (listo, sin datos): Health Score, 4 métricas (FC, SpO₂, Sueño, Estrés), tendencia de 30 días,
     Alertas Inteligentes, Resumen IA y valores extremos.
   - **Información General** (listo, sin datos): foto, datos personales, contacto de emergencia, EPS y antecedentes.
   - **Historia Clínica** (listo, sin datos): aviso de alergias, indicadores, enfermedades y condiciones (CIE-10),
     exámenes con pestañas Órdenes Médicas / Laboratorios, y línea de tiempo de citas médicas.
   - **Medicamentos** (listo, sin datos): avisos de alergias e interacciones, indicadores (activos, suplementos,
     adherencia 30 días, tomas/día), tarjetas de cada medicamento con horario y adherencia de 7 días,
     horario del día (mañana/tarde/noche), suplementos y complementos, e historial de suspendidos.
   - Los resultados de laboratorio en PDF están dentro de Historia Clínica → Exámenes.

> Código de prueba mientras no hay backend: **1234** (en `src/services/authService.js`).

## Datos (base de datos)

El panel **no tiene datos inventados**: cada recuadro muestra su estado vacío ("—", "Sin lecturas", "Sin alertas activas").
Cuando exista el backend, solo se cambia la función `obtenerPanel` de `src/services/panelService.js`
para que haga `fetch` al API. Arriba de ese archivo está documentada la forma exacta del JSON que debe devolver;
si llega con esa forma, todos los recuadros se llenan solos.

## Estructura

```
src/
  App.jsx                         → pasos: documento → código → panel
  main.jsx
  components/
    Header.jsx, Footer.jsx        → encabezado y pie del acceso
    AuthCard.jsx, OtpInput.jsx    → tarjeta de acceso y casillas del código
    Icons.jsx                     → todos los iconos
    panel/
      PanelHeader.jsx             → encabezado del panel + pestañas
      Comunes.jsx                 → piezas pequeñas (esqueleto, estado vacío, % de cambio)
      HealthScoreCard.jsx         → anillo 0-100 y desglose
      MetricCard.jsx              → tarjeta de FC / SpO₂ / Sueño / Estrés
      Sparkline.jsx               → mini gráfica de cada tarjeta
      TendenciaChart.jsx          → gráfica grande de 30 días
      AlertasCard.jsx             → Alertas Inteligentes
      ResumenIACard.jsx           → Resumen IA
      ExtremosGrid.jsx            → FC máx, sueño mín, SpO₂ mín, pico de estrés
    historia/
      ResumenClinico.jsx          → aviso de alergias + 4 indicadores
      Condiciones.jsx             → enfermedades y condiciones (CIE-10, estado, severidad, tratamiento)
      Examenes.jsx                → Órdenes Médicas / Laboratorios (PDF con estado)
      CitasMedicas.jsx            → línea de tiempo de citas, filtros y búsqueda
    medicamentos/
      iconos.jsx                  → iconos de la pestaña
      ResumenMedicamentos.jsx     → alergias, interacciones y 4 indicadores
      ListaMedicamentos.jsx       → medicamentos activos (filtros) y suplementos
      TarjetaMedicamento.jsx      → tarjeta con dosis, horario, indicación y adherencia 7 días
      HorarioDia.jsx              → tomas del día agrupadas en mañana/tarde/noche
      Suspendidos.jsx             → historial de medicamentos suspendidos
  pages/
    AccesoDocumento.jsx
    CodigoVerificacion.jsx
    PanelPaciente.jsx             → arma el panel y cambia de pestaña
    panel/
      NeomaAI.jsx                 → pestaña NEOMA AI (acomoda los recuadros)
      InformacionGeneral.jsx      → pestaña Información General
      HistoriaClinica.jsx         → pestaña Historia Clínica
      Medicamentos.jsx            → pestaña Medicamentos
      Proximamente.jsx            → pestañas aún no construidas
  services/
    authService.js                → API de acceso (mock)
    panelService.js               → API del panel (devuelve vacío)
  hooks/
    usePanelPaciente.js           → carga los datos del panel
    useAncho.js                   → mide el ancho para las gráficas
  utils/
    validators.js, formato.js, fechas.js, metricas.js, graficas.js
  styles/
    global.css                    → colores de marca y acceso
    panel.css                     → estilos del panel
    informacion.css               → estilos de Información General
    historia.css                  → estilos de Historia Clínica
    medicamentos.css              → estilos de Medicamentos
public/logo/                      → logos PNG sin fondo
```

## Paleta (manual de marca)

| Token | Color | Uso |
|---|---|---|
| `--verde-900` | `#1A3626` | Botones, barra superior, textos de marca |
| `--menta` | `#D2E6D8` | Acentos suaves, casillas llenas |
| `--petroleo` | `#4A6B70` | Foco, iconos secundarios |
| `--crema` | `#F4F3ED` | Fondo general |
| `--blanco` | `#FFFFFF` | Tarjetas |
| `--error` | `#B42330` | Estados de error |

Tipografía: **Sora** (títulos, como en el manual) e **Inter** (texto).

## Stack recomendado

- **React + Vite + CSS** (este proyecto). Sin librerías de UI para mantenerlo liviano y fiel al diseño.
- **React Router** si más adelante quieren URLs propias por pestaña (`/paciente/:id/general`).
- **Python con FastAPI** para el backend de este módulo (coincide con la documentación técnica): endpoints `POST /acceso/solicitar` y `POST /acceso/validar`, que devuelven un token JWT.

Para conectar el backend, solo cambien las funciones de `src/services/authService.js` por `fetch` reales y definan `VITE_API_URL` en un archivo `.env`.
