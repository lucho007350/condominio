import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para redirección
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate(); // Hook para navegación
  const primaryColor = '#1e3a5f';
  const [showPassword, setShowPassword] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usuarioFocused, setUsuarioFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState(''); // Estado para mensajes de error

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simular llamada a API de autenticación
      // En un caso real, aquí harías un fetch a tu backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // SIMULACIÓN DE VALIDACIÓN (esto deberías reemplazarlo con tu lógica real)
      // Aquí validamos según credenciales de ejemplo
      if (usuario === 'admin' && password === 'admin123') {
        // Guardar datos del usuario en localStorage/sessionStorage según rememberMe
        const userData = {
          username: usuario,
          role: 'admin',
          name: 'Administrador'
        };
        
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('user', JSON.stringify(userData));
        }
        
        // Redirigir al dashboard
        navigate('/dashboard');
      } 
      else if (usuario === 'usuario' && password === 'user123') {
        // Guardar datos del usuario
        const userData = {
          username: usuario,
          role: 'user',
          name: 'Usuario Regular'
        };
        
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('user', JSON.stringify(userData));
        }
        
        // Redirigir al inicio
        navigate('/inicio');
      }
      // NUEVA VALIDACIÓN PARA PROPIETARIO
      else if (usuario === 'propietario' && password === 'prop123') {
        // Guardar datos del propietario
        const userData = {
          username: usuario,
          role: 'propietario',
          name: 'Propietario',
          propiedades: ['Torre A - 502', 'Torre B - 305'], // Propiedades que posee
          idPropietario: 'PROP-001'
        };
        
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('user', JSON.stringify(userData));
        }
        
        // Redirigir a la vista de propiedades
        navigate('/mis-propiedades');
      }
      else {
        // Credenciales inválidas
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setError('Error al iniciar sesión. Intente nuevamente.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container 
      fluid 
      className="d-flex align-items-center justify-content-center position-relative"
      style={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${primaryColor} 0%, #2a4a7a 50%, #3a5a8a 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Elementos decorativos de fondo */}
      <div className="position-absolute w-100 h-100">
        <div 
          className="position-absolute rounded-circle"
          style={{
            width: '300px',
            height: '300px',
            background: 'rgba(255, 255, 255, 0.1)',
            top: '-100px',
            right: '-100px',
            borderRadius: '50%'
          }}
        />
        <div 
          className="position-absolute rounded-circle"
          style={{
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.1)',
            bottom: '-50px',
            left: '-50px',
            borderRadius: '50%'
          }}
        />
      </div>

      <Row className="w-100 justify-content-center" style={{ zIndex: 1 }}>
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card 
            className="border-0 shadow"
            style={{ 
              borderRadius: '30px',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              animation: 'float 6s ease-in-out infinite'
            }}
          >
            <Card.Body className="p-5">
              {/* Logo o Icono */}
              <div className="text-center mb-4">
                <div 
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '90px',
                    height: '90px',
                    background: `linear-gradient(135deg, ${primaryColor} 0%, #2a4a7a 100%)`,
                    color: 'white',
                    fontSize: '2.5rem',
                    boxShadow: '0 10px 20px rgba(30, 58, 95, 0.3)',
                    animation: 'pulse 2s infinite'
                  }}
                >
                  👤
                </div>
                <h2 
                  className="fw-bold mb-2"
                  style={{ 
                    color: primaryColor,
                    fontSize: '2rem'
                  }}
                >
                  Bienvenido
                </h2>
                <p className="text-muted">
                  Inicia sesión para acceder a tu cuenta
                </p>
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="alert alert-danger text-center mb-4" role="alert">
                  {error}
                </div>
              )}

              {/* Formulario */}
              <Form onSubmit={handleSubmit}>
                {/* Usuario Field */}
                <Form.Group className="mb-4" controlId="formUsuario">
                  <Form.Label className="text-secondary fw-semibold">
                    Usuario
                  </Form.Label>
                  <div className="position-relative">
                    <span 
                      className="position-absolute top-50 translate-middle-y"
                      style={{ 
                        left: '15px',
                        fontSize: '1.2rem',
                        color: usuarioFocused ? primaryColor : '#999',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      👤
                    </span>
                    <Form.Control 
                      type="text"
                      placeholder="Ingresa tu usuario"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      onFocus={() => setUsuarioFocused(true)}
                      onBlur={() => setUsuarioFocused(false)}
                      className="py-3"
                      style={{
                        borderRadius: '15px',
                        border: `2px solid ${usuarioFocused ? primaryColor : '#e0e0e0'}`,
                        paddingLeft: '45px',
                        transition: 'all 0.3s ease',
                        boxShadow: usuarioFocused ? `0 0 0 3px rgba(30, 58, 95, 0.1)` : 'none'
                      }}
                      required
                    />
                  </div>
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label className="text-secondary fw-semibold">
                    Contraseña
                  </Form.Label>
                  <div className="position-relative">
                    <span 
                      className="position-absolute top-50 translate-middle-y"
                      style={{ 
                        left: '15px',
                        fontSize: '1.2rem',
                        color: passwordFocused ? primaryColor : '#999',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      🔒
                    </span>
                    <Form.Control 
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      className="py-3"
                      style={{
                        borderRadius: '15px',
                        border: `2px solid ${passwordFocused ? primaryColor : '#e0e0e0'}`,
                        paddingLeft: '45px',
                        paddingRight: '45px',
                        transition: 'all 0.3s ease',
                        boxShadow: passwordFocused ? `0 0 0 3px rgba(30, 58, 95, 0.1)` : 'none'
                      }}
                      required
                    />
                    <Button
                      variant="link"
                      className="position-absolute top-50 translate-middle-y border-0 p-0 bg-transparent"
                      style={{ 
                        right: '15px',
                        color: passwordFocused ? primaryColor : '#999',
                        textDecoration: 'none',
                        fontSize: '1.1rem',
                        cursor: 'pointer'
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️‍🗨️' : '👁️'}
                    </Button>
                  </div>
                </Form.Group>

                {/* Remember Me & Forgot Password */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check 
                    type="checkbox"
                    id="rememberMe"
                    label="Recordarme"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="text-secondary"
                    style={{ cursor: 'pointer' }}
                  />
                  
                  <a 
                    href="#"
                    className="text-decoration-none"
                    style={{ 
                      color: primaryColor,
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#123d79'}
                    onMouseLeave={(e) => e.currentTarget.style.color = primaryColor}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                {/* Login Button */}
                <Button 
                  type="submit"
                  className="w-100 py-3 fw-semibold border-0 d-flex align-items-center justify-content-center gap-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${primaryColor} 0%, #2a4a7a 100%)`,
                    borderRadius: '15px',
                    boxShadow: '0 10px 20px rgba(30, 58, 95, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  disabled={isLoading}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(30, 58, 95, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(30, 58, 95, 0.3)';
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Cargando...
                    </>
                  ) : (
                    <>
                      Iniciar Sesión →
                    </>
                  )}
                </Button>
               
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Estilos CSS personalizados */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(30, 58, 95, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(30, 58, 95, 0); }
          100% { box-shadow: 0 0 0 0 rgba(30, 58, 95, 0); }
        }
      `}</style>
    </Container>
  );
};

export default Login;