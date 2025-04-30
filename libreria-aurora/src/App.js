import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Registro from './components/registro';
import RecuperarContraseña from './components/recuperarContraseña';
import ResetPassword from './components/ResetPassword';
import MiPerfil from './components/miPerfil';
import Home from './components/Home';
import SearchBook from './components/SearchBook';
import Catalogo from './components/catalogo';
import DetalleLibro from './components/DetalleLibro';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperarContraseña" element={<RecuperarContraseña />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Home/>} />
        <Route path="/miPerfil" element={<MiPerfil/>}/>
        <Route path="/Search" element={<SearchBook/>} />
        <Route path="/catalogo" element={<Catalogo/>} />
        <Route path='/:libro' element={<DetalleLibro/>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
