import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './ListadoReservas.css';

const API_BASE_URL = "http://localhost:8000/api";

function ListadoReservas() {
  const [reservas, setReservas] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        const resMesas = await fetch(`${API_BASE_URL}/mesas/`);
        const datosMesas = await resMesas.json();
        setMesas(datosMesas);
        
        const resReservas = await fetch(`${API_BASE_URL}/reservas/`);
        if (!resReservas.ok) {
          throw new Error('Error al cargar reservas');
        }
        
        const datosReservas = await resReservas.json();
        setReservas(datosReservas);
        setError('');
      } catch (err) {
        setError('No se pudieron cargar los datos. Intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  const obtenerNumeroMesa = (mesaId) => {
    if (!mesaId && mesaId !== 0) {
      return 'N/A';
    }
    

    const mesaEncontrada = mesas.find(m => m.id == mesaId);
    
    if (mesaEncontrada) {
      return mesaEncontrada.numero;
    }
    
    return mesaId;
  };

  const Eliminar = async (id, nombre) => {
    if (!window.confirm(`¿Realmente desea eliminar la reserva de ${nombre} del listado?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/reservas/${id}/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setReservas(reservas.filter(reserva => reserva.id !== id));
        alert('Reserva eliminada exitosamente');
      } else {
        alert('Error al eliminar la reserva');
      }
    } catch (err) {
      alert('Error de conexión al eliminar la reserva');
    }
  };

  const Actualizar = (id, nombre) => {
    if (!window.confirm(`Realmente desea actualizar la reserva de ${nombre}?`)) {
      return;
    }
    navigate(`/editar-reserva/${id}`);
  };


  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-CL', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEstadoColor = () => {
  };

  return (
    <div className="listado-reservas">
      <header className="reservas-header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="back-button">← Volver al Inicio</Link>
            <div className="header-title">
              <h1>LISTADO DE RESERVAS</h1>
              <p className="subtitle">Total: {reservas.length} reservas</p>
            </div>
            <Link to="/reservas" className="btn-nueva-reserva">
               Nueva Reserva
            </Link>
          </div>
        </div>
      </header>

      <main className="reservas-main">
        <div className="container">
          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => window.location.reload()} className="btn-reintentar">
                Reintentar
              </button>
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando reservas...</p>
            </div>
          ) : reservas.length === 0 ? (
            <div className="empty-state">
              <p>No hay reservas registradas</p>
              <Link to="/reservas" className="btn-primario">
                Crear primera reserva
              </Link>
            </div>
          ) : (
            <div className="reservas-table-container">
              <table className="reservas-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Personas</th>
                    <th>Mesa</th>
                    <th>Estado</th>
                    <th>Observación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map(reserva => (
                    <tr key={reserva.id}>
                      <td>{reserva.id}</td>
                      <td className="nombre-columna">
                        <strong>{reserva.nombre}</strong>
                      </td>
                      <td>{reserva.telefono}</td>
                      <td>{formatearFecha(reserva.fecha)}</td>
                      <td>{reserva.hora}</td>
                      <td>{reserva.cantidad_personas}</td>
                      <td>Mesa {obtenerNumeroMesa(reserva.mesa)}</td>
                      <td>
                        <span className={`estado-badge ${getEstadoColor(reserva.estado)}`}>
                          {reserva.estado}
                        </span>
                        </td>
                           <td>
                          {reserva.observacion}
                        </td>
                      <td className="acciones-columna">
                        <button
                          onClick={() => Actualizar(reserva.id)}
                          className="btn-actualizar"
                          title="Editar reserva"
                        >
                          Actualizar
                        </button>
                        <button
                          onClick={() => Eliminar(reserva.id, reserva.nombre)}
                          className="btn-eliminar"
                          title="Eliminar reserva"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
export default ListadoReservas;