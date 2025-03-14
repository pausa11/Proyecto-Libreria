import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import RecuperarContraseña from './components/recuperarContraseña';
import Registro from './components/registro';
import Home from './components/Home';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperarContraseña" element={<RecuperarContraseña />} />
        <Route path="/" element={<Home/>} />
        <Route path="/catalogo" element={<Home/>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
