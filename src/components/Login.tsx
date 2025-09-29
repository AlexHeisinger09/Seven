// src/components/Login.tsx - CON VALIDACIÓN DE RUT Y EMAIL
import { useState, FormEvent } from 'react';
import { useAuth, type Usuario } from '../hooks/useAuth';
import { COLORS } from '../utils/constants';

const { BUK_BLUE, BUK_DARK, ACCENT_YELLOW } = COLORS;

interface LoginProps {
  onSuccess: (user: Usuario) => void;
}

type Mode = 'login' | 'forgot';
type CredentialType = 'email' | 'rut' | 'unknown';

interface LoginState {
  credential: string;
  password: string;
  showPassword: boolean;
  mode: Mode;
  credentialType: CredentialType;
}

export function Login({ onSuccess }: LoginProps) {
  const { login, loading, error } = useAuth();

  const [formState, setFormState] = useState<LoginState>({
    credential: '',
    password: '',
    showPassword: false,
    mode: 'login',
    credentialType: 'unknown'
  });

  const [uiMessage, setUiMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // 🔥 NUEVA: Función para validar RUT chileno
  const validateRut = (rut: string): boolean => {
    // Limpiar el RUT
    const cleanRut = rut.replace(/[^0-9kK]/g, '');
    
    if (cleanRut.length < 2) return false;
    
    // Separar cuerpo y dígito verificador
    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1).toUpperCase();
    
    // Validar que el cuerpo solo contenga dígitos
    if (!/^\d+$/.test(body)) return false;
    
    // Calcular dígito verificador
    let sum = 0;
    let multiplier = 2;
    
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const remainder = sum % 11;
    let expectedDv: string;
    
    if (remainder === 1) {
      expectedDv = 'K';
    } else if (remainder === 0) {
      expectedDv = '0';
    } else {
      expectedDv = (11 - remainder).toString();
    }
    
    return dv === expectedDv;
  };

  // 🔥 NUEVA: Función para validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para detectar si es email o RUT
  const detectCredentialType = (value: string): CredentialType => {
    const cleanValue = value.trim();
    
    // Detectar email (contiene @)
    if (cleanValue.includes('@')) {
      return 'email';
    }
    
    // Detectar RUT (tiene formato XX.XXX.XXX-X o similar)
    const rutPattern = /^[\d.-]+[kK\d]$/;
    if (rutPattern.test(cleanValue.replace(/\s/g, ''))) {
      return 'rut';
    }
    
    return 'unknown';
  };

  // Función para formatear RUT mientras se escribe
  const formatRut = (value: string): string => {
    let rut = value.replace(/[^0-9kK]/g, '');
    
    if (rut.length === 0) return '';
    
    let body = rut.slice(0, -1);
    let dv = rut.slice(-1).toUpperCase();
    
    body = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return body ? `${body}-${dv}` : dv;
  };

  const updateFormState = (updates: Partial<LoginState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  // Manejador de cambio en el input de credential
  const handleCredentialChange = (value: string) => {
    const type = detectCredentialType(value);
    const formattedValue = type === 'rut' ? formatRut(value) : value;
    
    // Limpiar errores de validación al escribir
    setValidationError(null);
    
    updateFormState({ 
      credential: formattedValue,
      credentialType: type 
    });
  };

  // 🔥 NUEVA: Función para validar el formulario antes de enviar
  const validateForm = (): boolean => {
    const { credential, credentialType } = formState;

    if (!credential.trim()) {
      setValidationError('Este campo es obligatorio');
      return false;
    }

    if (credentialType === 'email') {
      if (!validateEmail(credential)) {
        setValidationError('Correo electrónico inválido');
        return false;
      }
    } else if (credentialType === 'rut') {
      if (!validateRut(credential)) {
        setValidationError('RUT inválido. Verifica el dígito verificador');
        return false;
      }
    } else if (credentialType === 'unknown') {
      setValidationError('Ingresa un correo electrónico o RUT válido');
      return false;
    }

    return true;
  };

  const isForgot = formState.mode === 'forgot';

  const canSubmit =
    !loading &&
    formState.credential.trim() &&
    (isForgot || formState.password.trim());

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUiMessage(null);
    setValidationError(null);

    if (isForgot) {
      // Solo validar email en modo recuperación
      if (!validateEmail(formState.credential)) {
        setValidationError('Ingresa un correo electrónico válido');
        return;
      }
      
      setUiMessage(
        'Si el correo existe, te enviaremos instrucciones para restablecer la contraseña.'
      );
      return;
    }

    // 🔥 VALIDAR FORMULARIO ANTES DE ENVIAR
    if (!validateForm()) {
      return;
    }

    if (!formState.credential.trim() || !formState.password.trim()) return;

    try {
      await login(formState.credential, formState.password);

      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      console.error('Error en login:', err);
    }
  };

  const togglePasswordVisibility = () => {
    updateFormState({ showPassword: !formState.showPassword });
  };

  const goToForgot = () => {
    updateFormState({ mode: 'forgot', showPassword: false });
    setUiMessage(null);
    setValidationError(null);
  };

  const backToLogin = () => {
    updateFormState({ mode: 'login' });
    setUiMessage(null);
    setValidationError(null);
  };

  const getCredentialLabel = () => {
    if (formState.credentialType === 'rut') return 'RUT';
    if (formState.credentialType === 'email') return 'Email';
    return 'Email o RUT';
  };

  const getCredentialPlaceholder = () => {
    if (formState.credentialType === 'rut') return '12.345.678-9';
    if (formState.credentialType === 'email') return 'correo@empresa.com';
    return 'correo@empresa.com o 12.345.678-9';
  };

  const getCredentialIcon = () => {
    if (formState.credentialType === 'rut') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      );
    }
    
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
      </svg>
    );
  };

  // 🔥 NUEVA: Obtener indicador de validación visual
  const getValidationIndicator = () => {
    if (!formState.credential || formState.credentialType === 'unknown') {
      return null;
    }

    const isValid = formState.credentialType === 'email' 
      ? validateEmail(formState.credential)
      : validateRut(formState.credential);

    if (isValid) {
      return (
        <span className="pr-4 text-xs text-green-600 font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {formState.credentialType === 'rut' ? 'RUT válido' : 'Email válido'}
        </span>
      );
    } else if (formState.credential.length > 3) {
      return (
        <span className="pr-4 text-xs text-red-600 font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {formState.credentialType === 'rut' ? 'RUT inválido' : 'Email inválido'}
        </span>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex bg-gray-50 relative overflow-hidden">
      {/* Panel izquierdo - Formulario */}
      <div className="w-full lg:w-[48%] flex items-center justify-center p-8 lg:pr-12 relative z-20">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-12 text-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-18 h-18 mx-auto mb-4"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }}
            />
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isForgot ? '¿Olvidaste tu contraseña?' : '¡Bienvenido Nuevamente!'}
            </h1>
            <p className="text-gray-600">
              {isForgot
                ? 'Ingresa tu correo y te enviaremos instrucciones'
                : 'Ingresa con tu correo o RUT'}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email/RUT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getCredentialLabel()}
              </label>
              <div className="relative">
                <div
                  className={`flex items-center rounded-lg border-2 transition-colors ${
                    validationError || error
                      ? 'border-red-300 focus-within:border-red-500'
                      : 'border-gray-200 focus-within:border-blue-500'
                  } bg-white`}
                >
                  <span className="pl-4 text-gray-400">
                    {getCredentialIcon()}
                  </span>
                  <input
                    type="text"
                    className="flex-1 py-4 px-4 text-gray-900 bg-transparent outline-none placeholder-gray-500"
                    placeholder={getCredentialPlaceholder()}
                    value={formState.credential}
                    onChange={(e) => handleCredentialChange(e.target.value)}
                    disabled={loading}
                  />
                  {getValidationIndicator()}
                </div>
                
                {/* Mensaje de error de validación */}
                {validationError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {validationError}
                  </p>
                )}
              </div>
            </div>

            {/* Contraseña (solo en login) */}
            {!isForgot && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div
                    className={`flex items-center rounded-lg border-2 transition-colors ${
                      error
                        ? 'border-red-300 focus-within:border-red-500'
                        : 'border-gray-200 focus-within:border-blue-500'
                    } bg-white`}
                  >
                    <span className="pl-4 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      type={formState.showPassword ? 'text' : 'password'}
                      className="flex-1 py-4 px-4 text-gray-900 bg-transparent outline-none placeholder-gray-500"
                      placeholder="Ingresa tu contraseña"
                      value={formState.password}
                      onChange={(e) => updateFormState({ password: e.target.value })}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={loading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        {formState.showPassword ? (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="m10.73 5.08-1.1-.95A11 11 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.08" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="m6.61 6.61A13.5 13.5 0 0 0 1 12s4 8 11 8a9.74 9.74 0 0 0 5.39-1.61" />
                            <line strokeLinecap="round" strokeLinejoin="round" x1="2" x2="22" y1="2" y2="22" />
                          </>
                        ) : (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle strokeLinecap="round" strokeLinejoin="round" cx="12" cy="12" r="3" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>

                  {/* Mensaje de error del backend */}
                  {error && !validationError && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {error}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Mensaje UI */}
            {uiMessage && (
              <p className="text-sm mt-2 text-gray-600 flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-blue-700">{uiMessage}</span>
              </p>
            )}

            {/* Botón principal */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: loading ? '#94A3B8' : BUK_BLUE,
                boxShadow: loading ? 'none' : '0 4px 15px rgba(46, 73, 183, 0.3)'
              }}
              disabled={!canSubmit}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isForgot ? 'Procesando...' : 'Verificando...'}
                </div>
              ) : (
                isForgot ? 'Enviar instrucciones' : 'Iniciar Sesión'
              )}
            </button>

            {/* Enlaces adicionales */}
            <div className="text-center space-y-3 pt-4">
              {!isForgot ? (
                <>
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    disabled={loading}
                    onClick={goToForgot}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                  <div className="flex items-center justify-center">
                    <div className="border-t border-gray-200 flex-1"></div>
                    <span className="px-4 text-xs text-gray-400">o</span>
                    <div className="border-t border-gray-200 flex-1"></div>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    disabled={loading}
                  >
                    Copyright © 2025 Seven MDP.
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  disabled={loading}
                  onClick={backToLogin}
                >
                  ← Volver a iniciar sesión
                </button>
              )}
            </div>
          </form>

          
        </div>
      </div>

      {/* Panel derecho - Hero visual (sin cambios) */}
      <div className="hidden lg:block lg:w-[52%] relative">
        <div className="absolute inset-0 h-full">
          <img
            src="/slide1.png"
            alt="Workspace background"
            className="w-full h-full object-cover"
            style={{
              filter: 'brightness(0.4) contrast(1.1) saturate(0.8)',
              objectPosition: 'center'
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, 
                ${BUK_BLUE}CC 0%, 
                ${BUK_BLUE}99 30%, 
                ${BUK_DARK}BB 70%, 
                ${BUK_DARK}DD 100%)`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-indigo-900/30"></div>
        </div>

        <svg className="absolute top-0 -left-24 h-full w-28 text-gray-50"
          viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M100 0 C70 20, 70 80, 100 100 L0 100 L0 0 Z"
            fill="currentColor" />
        </svg>

        <div className="absolute inset-0 z-10">
          <div className="absolute top-16 right-16 w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm"></div>
          <div className="absolute bottom-20 left-12 w-16 h-16 rounded-full bg-white/8"></div>
          <div
            className="absolute top-1/4 right-8 w-3 h-24 rounded-full opacity-30"
            style={{ background: ACCENT_YELLOW }}
          ></div>
        </div>

        <div className="relative z-20 flex flex-col justify-center px-16 text-white h-full">
          <div className="max-w-md">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <span className="text-sm font-medium text-white/90">Muelles de Penco</span>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-6 drop-shadow-lg">
              Crea un lugar de trabajo <span style={{ color: ACCENT_YELLOW }}>más feliz :)</span>
            </h2>

            <p className="text-xl text-white/90 mb-8 leading-relaxed drop-shadow-sm">
              Gestiona tu equipo, simplifica procesos y mejora la experiencia laboral de todos.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-white/95 font-medium drop-shadow-sm">Colaboradores más conectados</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <span className="text-white/95 font-medium drop-shadow-sm">Gestión simplificada de RRHH</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-white/95 font-medium drop-shadow-sm">Procesos automatizados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}