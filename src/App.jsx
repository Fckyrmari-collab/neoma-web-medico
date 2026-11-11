import { useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AccesoDocumento from './pages/AccesoDocumento.jsx';
import CodigoVerificacion from './pages/CodigoVerificacion.jsx';
import PanelPaciente from './pages/PanelPaciente.jsx';

/**
 * Flujo del médico:
 *   1. documento → el médico escribe el documento del paciente
 *   2. codigo    → el paciente recibe un código en su app NEOMA y se lo dicta al médico
 *   3. panel     → panel del paciente (pestaña NEOMA AI y las demás)
 */
export default function App() {
  const [paso, setPaso] = useState('documento');
  const [paciente, setPaciente] = useState(null);
  const [solicitud, setSolicitud] = useState(null);

  const irACodigo = ({ paciente, solicitud }) => {
    setPaciente(paciente);
    setSolicitud(solicitud);
    setPaso('codigo');
  };

  const reiniciar = () => {
    setPaciente(null);
    setSolicitud(null);
    setPaso('documento');
  };

  // El panel tiene su propio encabezado, por eso va aparte
  if (paso === 'panel') {
    return <PanelPaciente paciente={paciente} onCerrarSesion={reiniciar} />;
  }

  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <div className="app__stage" key={paso}>
          {paso === 'documento' && <AccesoDocumento onSolicitado={irACodigo} />}
          {paso === 'codigo' && (
            <CodigoVerificacion
              paciente={paciente}
              solicitud={solicitud}
              onVolver={reiniciar}
              onNuevaSolicitud={setSolicitud}
              onValidado={() => setPaso('panel')}
            />
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
}
