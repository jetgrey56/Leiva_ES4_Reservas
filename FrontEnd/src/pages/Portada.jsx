import { useState } from 'react';
import { Link } from 'react-router-dom';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';
import './Inicio.css';

function Portada() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className='App'>
      <div className="background-pattern"></div>

      <header className="header">
        <div className="logo-container">
          <div className="logo-circle">
            <span className="logo-icon"></span>
          </div>
          <div className="logo-text">
            <h1>RESTAURANTE</h1>
            <p className="logo-subtitle">SABOR & TRADICIÓN</p>
          </div>
        </div>
        
        <div className="header-decoration">
          <div className="decoration-line"></div>
          <div className="decoration-dot"></div>
          <div className="decoration-line"></div>
        </div>
      </header>

      <main className="main-content">
        <div className="hero-section">
          <div className="hero-badge">
            <span className="badge-text"> 5 ESTRELLAS</span>
          </div>
          
          <div className="hero-title-container">
            <h2 className="hero-title">
              Bienvenido al
              <span className="title-highlight"> mágico mundo</span>
              del sabor
            </h2>
          </div>
          
          <div className="hero-description-container">
            <p className="hero-description">
              Donde cada plato es una obra de arte y cada bocado una experiencia única. 
              Descubre la fusión perfecta entre tradición e innovación culinaria.
            </p>
          </div>
        </div>

        <div className="button-grid">
          <button 
            className="action-button menu-button"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => alert('¡Próximamente nuestro menú!')}
          >
            <div className="button-content">
              <div className="button-icon"></div>
              <div className="button-text">
                <span className="button-title">Ver Menú</span>
                <span className="button-subtitle">Explora nuestros platos</span>
              </div>
              <div className="button-arrow">→</div>
            </div>
            <div className="button-glow"></div>
          </button>

            <Link to="/listado-reservas" className="action-button reservation-button">
            <div className="button-content">
              <div className="button-icon"></div>
              <div className="button-text">
                <span className="button-title">Ver el listado de las reservas</span>
              </div>
              <div className="button-arrow">→</div>
            </div>
            <div className="button-glow"></div>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Portada;