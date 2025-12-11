import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import './Reservas.css';

const API_BASE_URL = "http://localhost:8000/api";

function Reservas() {
  const { id } = useParams(); 
  const [isEditing, setIsEditing] = useState(false); 
  
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    fecha: '',
    hora: '',
    cantidad_personas: '',
    mesa: '',
    observacion: '',
    estado: 'RESERVADO'
  });

  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(false); 

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resMesas = await fetch(`${API_BASE_URL}/mesas/`);
        if (resMesas.ok) {
          setMesas(await resMesas.json());
        }

        if (id) {
          await cargarReservaParaEditar(id);
        }
      } catch (err) {
        setError('Error cargando datos iniciales');
      }
    };

    cargarDatos();
  }, [id]);

  const cargarReservaParaEditar = async (reservaId) => {
    setCargandoDatos(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reservas/${reservaId}/`);
      
      if (response.ok) {
        const reserva = await response.json();
        
        const fechaFormateada = reserva.fecha.split('T')[0];
        
        setFormData({
          nombre: reserva.nombre || '',
          telefono: reserva.telefono || '',
          fecha: fechaFormateada || '',
          hora: reserva.hora || '',
          cantidad_personas: reserva.cantidad_personas?.toString() || '',
          mesa: reserva.mesa?.id?.toString() || '',
          observacion: reserva.observacion || '',
          estado: reserva.estado || 'RESERVADO'
        });
        
        setIsEditing(true); 
        setError('');
      } else {
        setError('No se pudo cargar la reserva para editar');
      }
    } catch (err) {
      setError('Error de conexión al cargar la reserva');
    } finally {
      setCargandoDatos(false);
    }
  };

  const Cambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const EnviarFormulario = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.telefono || !formData.fecha || !formData.mesa) {
      setError('Complete todos los campos requeridos');
      return;
    }

    setLoading(true);

    try {
      const reservaData = {
        ...formData,
        cantidad_personas: parseInt(formData.cantidad_personas),
        mesa: parseInt(formData.mesa)
      };

      const url = isEditing 
        ? `${API_BASE_URL}/reservas/${id}/` 
        : `${API_BASE_URL}/reservas/`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaData)
      });

      if (response.ok) {
        if (!isEditing) {
          setFormData({
            nombre: '',
            telefono: '',
            fecha: '',
            hora: '',
            cantidad_personas: '',
            mesa: '',
            observacion: '',
            estado: 'RESERVADO'
          });
        }
        
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          window.location.href = '/listado-reservas';
        }, 2000);
      } else {
        setError(isEditing ? 'Error al actualizar la reserva' : 'Error al crear la reserva');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const horasDisponibles = Array.from({ length: 11 }, (_, i) => {
    const hora = 12 + Math.floor(i / 2);
    const minutos = i % 2 === 0 ? '00' : '30';
    return `${hora.toString().padStart(2, '0')}:${minutos}`;
  });

  if (cargandoDatos) {
    return (
      <div className="reservas-page">
        <div className="cargando-container">
          <div className="spinner"></div>
          <p>Cargando datos de la reserva...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reservas-page">
      <header className="reservas-header">
        <div className="container">
          <div className="header-content">
            <Link to="/listado-reservas" className="back-button">← Volver al Listado</Link>
            <div className="header-title">
              <h1>{isEditing ? 'EDITAR RESERVA' : 'NUEVA RESERVA'}</h1>
              <p className="subtitle">
                {isEditing ? `Editando reserva #${id}` : 'Complete el formulario para reservar'}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="reservas-main">
        <div className="container">
          <div className="registro-card">
            
            {success && (
              <div className="success-message">
                <strong>✓ {isEditing ? '¡Reserva actualizada exitosamente!' : '¡Reserva creada exitosamente!'}</strong>
                <p>Redirigiendo al listado...</p>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={EnviarFormulario} className="reserva-form">
              
              <div className="form-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={Cambio}
                  placeholder="Ingrese su nombre"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Teléfono *</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={Cambio}
                  placeholder="Ej: +56 9 1234 5678"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha *</label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={Cambio}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Hora</label>
                  <select
                    name="hora"
                    value={formData.hora}
                    onChange={Cambio}
                    disabled={loading}
                  >
                    {horasDisponibles.map(hora => (
                      <option key={hora} value={hora}>{hora} hrs</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Cantidad de Personas</label>
                  <select
                    name="cantidad_personas"
                    value={formData.cantidad_personas}
                    onChange={Cambio}
                    disabled={loading}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(num => (
                      <option key={num} value={num}>{num} persona{num !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Mesa *</label>
                  <select
                    name="mesa"
                    value={formData.mesa}
                    onChange={Cambio}
                    required
                    disabled={loading || mesas.length === 0}
                  >
                    <option value="">Seleccione una mesa</option>
                    {mesas.map(mesa => (
                      <option key={mesa.id} value={mesa.id}>
                        Mesa {mesa.numero} ({mesa.capacidad} personas)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Estado de la Reserva</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={Cambio}
                  disabled={loading}
                >
                  <option value="RESERVADO">Reservado</option>
                  <option value="ANULADA">Anulada</option>
                  <option value="COMPLETADA">Completada</option>
                  <option value="NO ASISTEN">No Asisten</option>
                </select>
              </div>

              <div className="form-group">
                <label>Observaciones (opcional)</label>
                <textarea
                  name="observacion"
                  value={formData.observacion}
                  onChange={Cambio}
                  placeholder="Ej: Alergias, celebración especial, etc."
                  rows="3"
                  disabled={loading}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-reservar"
                  disabled={loading}
                >
                  {loading ? 'PROCESANDO...' : (isEditing ? 'ACTUALIZAR RESERVA' : 'CONFIRMAR RESERVA')}
                </button>
                
                <Link to="/listado-reservas" className="btn-cancelar">
                  Cancelar
                </Link>
              </div>

              <p className="form-note">
                * Campos obligatorios. 
                {isEditing && ' Los cambios se guardarán inmediatamente.'}
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Reservas;