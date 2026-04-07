import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { authAPI } from '../services/api.jsx';

// Avatares por defecto para cada rol
const DEFAULT_AVATARS = {
  admin: { id: 1, bg: '#0f2a3a', variant: 1, name: 'Vikingo', role: 'admin' },
  propietario: { id: 1, bg: '#1d3e52', variant: 1, name: 'Casa', role: 'propietario' },
  residente: { id: 1, bg: '#2c5f6e', variant: 1, name: 'Gato', role: 'residente' },
};

const Login = () => {
  const navigate = useNavigate();
  const manualUrl = `${import.meta.env.BASE_URL}MANUAL_DE_USUARIO.html`;
  const primaryColor = '#0f2a3a';
  const secondaryColor = '#1d3e52';
  const accentColor = '#2c5f6e';
  const [showPassword, setShowPassword] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usuarioFocused, setUsuarioFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState('');

  // Función para obtener el avatar guardado
  const getSavedAvatar = (role: string) => {
    const savedAvatar = localStorage.getItem(`pixelAvatar_${role}`);
    if (savedAvatar) {
      return JSON.parse(savedAvatar);
    }
    return DEFAULT_AVATARS[role as keyof typeof DEFAULT_AVATARS] || DEFAULT_AVATARS.residente;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login({ identifier: usuario, password });
      const data = response?.data || {};
      const token = data?.token;
      let user = data?.user;

      if (!token || !user?.username) {
        throw new Error('Respuesta de login invalida');
      }

      // Obtener datos completos del usuario
      try {
        const meResponse = await authAPI.me();
        const fullData = meResponse?.data || {};
        user = { ...user, ...fullData };
        
        const residente = fullData?.residente;
        if (residente) {
          user.nombre = residente.nombre || '';
          user.apellido = residente.apellido || '';
          user.tipoResidente = residente.tipoResidente || '';
          user.idResidente = residente.idResidente;
        }
      } catch (meError) {
        console.warn('No se pudo obtener datos adicionales del usuario:', meError);
      }

      // Determinar el rol del usuario
      const userRole = user.role === 'admin' ? 'admin' : 
                       user.role === 'propietario' ? 'propietario' : 
                       user.tipoResidente === 'Propietario' ? 'propietario' : 'residente';

      // Obtener el avatar guardado para este rol
      const savedAvatar = getSavedAvatar(userRole);

      // Crear objeto userData
      const userData = {
        ...user,
        token,
        role: userRole,
        name: user?.nombre && user?.apellido 
          ? `${user.nombre} ${user.apellido}` 
          : user?.name || user?.username || '',
        avatar: savedAvatar,
        avatarRole: userRole,
      };

      // Guardar en storage (solo una vez)
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('user', JSON.stringify(userData));
      }

      // Redirigir según el rol
      if (userRole === 'admin') {
        navigate('/dashboard');
      } else if (userRole === 'propietario') {
        navigate('/mis-propiedades');
      } else {
        navigate('/inicio');
      }
      
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Error al iniciar sesion. Intente nuevamente.';
      setError(msg);
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
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${accentColor} 100%)`,
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
             <Card.Body className="p-5 position-relative">
               <div
                 className="position-absolute"
                 style={{ top: '18px', right: '18px' }}
               >
                 <OverlayTrigger
                   placement="left"
                   overlay={<Tooltip id="tooltip-manual">Manual de usuario</Tooltip>}
                 >
                   <a
                     href={manualUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     aria-label="Manual de usuario"
                     style={{
                       display: 'inline-flex',
                       width: '34px',
                       height: '34px',
                       alignItems: 'center',
                       justifyContent: 'center',
                       borderRadius: '999px',
                       background: 'rgba(15, 42, 58, 0.08)',
                       color: primaryColor,
                       textDecoration: 'none',
                       fontWeight: 800,
                       lineHeight: 1,
                       border: '1px solid rgba(15, 42, 58, 0.15)',
                     }}
                   >
                     📘
                   </a>
                 </OverlayTrigger>
               </div>
               {/* Logo o Icono */}
               <div className="text-center mb-4">
                <div 
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '90px',
                    height: '90px',
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                    color: 'white',
                    fontSize: '2.5rem',
                    boxShadow: '0 10px 20px rgba(15, 42, 58, 0.3)',
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
                        boxShadow: usuarioFocused ? `0 0 0 3px rgba(15, 42, 58, 0.1)` : 'none'
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
                        boxShadow: passwordFocused ? `0 0 0 3px rgba(15, 42, 58, 0.1)` : 'none'
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

                {/* Login Button */}
                <Button 
                  type="submit"
                  className="w-100 py-3 fw-semibold border-0 d-flex align-items-center justify-content-center gap-2"
                  style={{ 
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                    borderRadius: '15px',
                    boxShadow: '0 10px 20px rgba(15, 42, 58, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  disabled={isLoading}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(15, 42, 58, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(15, 42, 58, 0.3)';
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
          0% { box-shadow: 0 0 0 0 rgba(15, 42, 58, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(15, 42, 58, 0); }
          100% { box-shadow: 0 0 0 0 rgba(15, 42, 58, 0); }
        }
      `}</style>
    </Container>
  );
};

export default Login;
