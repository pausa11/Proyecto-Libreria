import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import RecuperarContraseña from './components/recuperarContraseña';
import Registro from './components/registro';
import Home from './components/Home';
import SearchBook from './components/SearchBook';
import Catalogo from './components/catalogo';
import DetalleLibro from './components/DetalleLibro';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperarContraseña" element={<RecuperarContraseña />} />
        <Route path="/" element={<Home/>} />
        <Route path="/Search" element={<SearchBook/>} />
        <Route path="/catalogo" element={<Catalogo/>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path='/:libro' element={<DetalleLibro/>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
