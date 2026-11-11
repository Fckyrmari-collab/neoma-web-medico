import { useState } from 'react';
import HealthScoreCard from '../../components/panel/HealthScoreCard.jsx';
import MetricCard from '../../components/panel/MetricCard.jsx';
import TendenciaChart from '../../components/panel/TendenciaChart.jsx';
import AlertasCard from '../../components/panel/AlertasCard.jsx';
import ResumenIACard from '../../components/panel/ResumenIACard.jsx';
import ExtremosGrid from '../../components/panel/ExtremosGrid.jsx';
import { ORDEN_METRICAS } from '../../utils/metricas.js';

/**
 * Pestaña "NEOMA AI": resumen inteligente del paciente.
 *
 *  ┌───────────┬──────────────┬──────────────┐
 *  │  Health   │  FC          │  SpO₂        │
 *  │  Score    ├──────────────┼──────────────┤
 *  │           │  Sueño       │  Estrés      │
 *  ├───────────┴──────────────┴──────────────┤
 *  │  Tendencia 30 días (FC / SpO₂ / ...)     │
 *  ├──────────────┬──────────────────────────┤
 *  │  Alertas     │  Resumen IA              │
 *  ├────┬────┬────┴┬─────────────────────────┤
 *  │ FC máx │ Sueño mín │ SpO₂ mín │ Estrés máx│
 *  └────────────────────────────────────────┘
 */
export default function NeomaAI({ datos, cargando }) {
  const [metrica, setMetrica] = useState('fc');

  return (
    <div className="neoma-ai">
      <div className="neoma-ai__superior">
        <HealthScoreCard healthScore={datos.healthScore} metricas={datos.metricas} cargando={cargando} />
        <div className="neoma-ai__metricas">
          {ORDEN_METRICAS.map((k) => (
            <MetricCard
              key={k}
              clave={k}
              datos={datos.metricas[k]}
              cargando={cargando}
              seleccionada={metrica === k}
              onSeleccionar={() => setMetrica(k)}
            />
          ))}
        </div>
      </div>

      <TendenciaChart
        tendencias={datos.tendencias}
        dispositivo={datos.dispositivo}
        metrica={metrica}
        onMetrica={setMetrica}
        cargando={cargando}
      />

      <div className="neoma-ai__inferior">
        <AlertasCard alertas={datos.alertas} cargando={cargando} />
        <ResumenIACard resumen={datos.resumenIA} cargando={cargando} />
      </div>

      <ExtremosGrid extremos={datos.extremos} cargando={cargando} />
    </div>
  );
}
