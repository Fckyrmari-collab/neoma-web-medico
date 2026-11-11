import { useState } from 'react';
import PanelHeader, { PESTANAS } from '../components/panel/PanelHeader.jsx';
import NeomaAI from './panel/NeomaAI.jsx';
import InformacionGeneral from './panel/InformacionGeneral.jsx';
import HistoriaClinica from './panel/HistoriaClinica.jsx';
import Medicamentos from './panel/Medicamentos.jsx';
import Proximamente from './panel/Proximamente.jsx';
import usePanelPaciente from '../hooks/usePanelPaciente.js';
import { tieneDatos } from '../services/panelService.js';
import { IconAlerta } from '../components/Icons.jsx';
import '../styles/panel.css';

/** Panel del paciente que ve el médico tras validar el código. */
export default function PanelPaciente({ paciente, onCerrarSesion }) {
  const [pestana, setPestana] = useState('ia');
  const { datos, cargando, error } = usePanelPaciente(paciente.documento);
  const nombrePestana = PESTANAS.find((p) => p.id === pestana)?.nombre;

  return (
    <div className="panel">
      <PanelHeader
        paciente={paciente}
        perfil={datos.perfil}
        dispositivo={datos.dispositivo}
        pestana={pestana}
        onPestana={setPestana}
        puedeExportar={!cargando && tieneDatos(datos)}
        onCerrarSesion={onCerrarSesion}
      />

      <main className="panel__contenido contenedor">
        {error && (
          <p className="panel__error" role="alert">
            <IconAlerta /> No pudimos cargar la información del paciente. {error}
          </p>
        )}
        {pestana === 'ia' && <NeomaAI datos={datos} cargando={cargando} />}
        {pestana === 'general' && <InformacionGeneral paciente={paciente} datos={datos} cargando={cargando} />}
        {pestana === 'historia' && <HistoriaClinica datos={datos} cargando={cargando} />}
        {pestana === 'medicamentos' && <Medicamentos datos={datos} cargando={cargando} />}
        {!['ia', 'general', 'historia', 'medicamentos'].includes(pestana) && <Proximamente titulo={nombrePestana} />}
      </main>

      <footer className="panel__pie contenedor">
        <span>
          <img src="./logo/neoma-simbolo.png" alt="" />
          <strong>NEOMA</strong> · Ecosistema de salud inteligente. Los datos son complementarios y no constituyen
          diagnóstico médico.
        </span>
        <a href="#privacidad">Política de privacidad →</a>
      </footer>
    </div>
  );
}
