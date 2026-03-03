import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Inicio = () => {
  const primaryColor = '#1e3a5f';
  
  const stats = [
    { number: '42', label: 'Unidades', icon: '🏢' },
    { number: '128', label: 'Residentes', icon: '👥' },
    { number: '3', label: 'Piscinas', icon: '🏊' },
    { number: '24/7', label: 'Seguridad', icon: '🛡️' }
  ];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: 'calc(100vh - 64px)',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      backgroundColor: '#000' // Fallback color mientras carga el video
    }}>
      {/* Video de fondo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          transform: 'translateX(-50%) translateY(-50%)',
          objectFit: 'cover',
          zIndex: 0,
          filter: 'brightness(0.7)' // Oscurece ligeramente el video
        }}
      >
        <source src="/202602171648.mp4" type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>

      {/* Overlay con gradiente */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, rgba(30, 58, 95, 0.85) 0%, rgba(0, 0, 0, 0.7) 100%)`,
        zIndex: 1
      }}></div>

      {/* Contenido principal */}
      <Container 
        fluid 
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}
      >
        <Row className="justify-content-center w-100">
          <Col lg={10} xl={8}>
            <div style={{
              textAlign: 'center',
              color: 'white',
              animation: 'fadeInUp 1s ease-out'
            }}>
              {/* Badge de bienvenida */}
              <div style={{
                display: 'inline-block',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50px',
                padding: '0.5rem 1.5rem',
                marginBottom: '2rem',
                fontSize: '0.9rem',
                letterSpacing: '2px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                ✦ BIENVENIDO A ✦
              </div>
              
              {/* Título principal */}
              <h1 style={{
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                marginBottom: '1.5rem',
                fontWeight: '800',
                lineHeight: '1.2',
                color: 'white',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                letterSpacing: '-0.5px'
              }}>
                CONDOMINIO
                <span style={{
                  display: 'block',
                  color: '#fff',
                  background: `linear-gradient(135deg, #fff 0%, ${primaryColor} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: 'clamp(2rem, 6vw, 4rem)'
                }}>
                  LAS MARGARITAS
                </span>
              </h1>

              {/* Descripción */}
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: '1.8',
                marginBottom: '3rem',
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                maxWidth: '800px',
                marginLeft: 'auto',
                marginRight: 'auto',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
              }}>
                Vive en el lugar más exclusivo de la ciudad. Disfruta de piscina, gimnasio, áreas verdes, 
                seguridad 24/7 y salón de eventos. Un espacio diseñado para tu bienestar y el de tu familia.
              </p>

              {/* Tarjetas de estadísticas */}
              <Row className="justify-content-center g-4">
                {stats.map((stat, index) => (
                  <Col key={index} xs={6} sm={4} md={3}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '20px',
                      padding: '1.5rem 1rem',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      animation: `fadeInUp 1s ease-out ${index * 0.1}s both`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(30, 58, 95, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                    }}>
                      {/* Icono */}
                      <div style={{
                        fontSize: '2.5rem',
                        marginBottom: '0.5rem',
                        opacity: 0.9
                      }}>
                        {stat.icon}
                      </div>
                      
                      {/* Número */}
                      <div style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: '800',
                        color: 'white',
                        lineHeight: '1.2',
                        marginBottom: '0.25rem',
                        textShadow: `2px 2px 4px ${primaryColor}`
                      }}>
                        {stat.number}
                      </div>
                      
                      {/* Label */}
                      <div style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                      }}>
                        {stat.label}
                      </div>

                      {/* Línea decorativa */}
                      <div style={{
                        width: '40px',
                        height: '2px',
                        background: primaryColor,
                        margin: '0.75rem auto 0',
                        borderRadius: '2px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </Col>
                ))}
              </Row>

              {/* Botón de acción (opcional) */}
              <div style={{ marginTop: '3rem' }}>
                <button style={{
                  background: 'transparent',
                  border: `2px solid ${primaryColor}`,
                  color: 'white',
                  padding: '0.75rem 2.5rem',
                  borderRadius: '50px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(5px)',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = primaryColor;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 10px 20px ${primaryColor}80`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  EXPLORAR MÁS
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Estilos CSS personalizados */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Estilo para el scrollbar (opcional) */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: ${primaryColor};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #2a4a7a;
        }
      `}</style>
    </div>
  );
};

export default Inicio;