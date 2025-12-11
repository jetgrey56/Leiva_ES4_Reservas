import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Portada from './pages/Portada';
import Reservas from './pages/Reservas';
import './App.css';
import ListadoReservas from './pages/ListadoReservas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portada/>} />
        <Route path="/reservas" element={<Reservas/>} />
        <Route path='listado-reservas' element={<ListadoReservas/>} />
        <Route path="/editar-reserva/:id" element={<Reservas/>} />
      </Routes>
    </Router>
  );
}

export default App;