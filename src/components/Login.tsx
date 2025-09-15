// src/components/Login.tsx
import { useState, FormEvent } from 'react';
import { useAuth, type Usuario } from '../hooks/useAuth';
import { COLORS } from '../utils/constants';

const { BUK_BLUE, BUK_DARK, ACCENT_YELLOW } = COLORS;

interface LoginProps {
  onSuccess: (user: Usuario) => void;
}

interface LoginState {
  credential: string;
  password: string;
  showPassword: boolean;
}

export function Login({ onSuccess }: LoginProps) {
  const { login, loading, error } = useAuth();
  const [formState, setFormState] = useState<LoginState>({
    credential: '',
    password: '', // Valor vacío por defecto
    showPassword: false,
  });

  const updateFormState = (updates: Partial<LoginState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formState.credential.trim() || !formState.password.trim()) {
      return;
    }

    try {
      await login(formState.credential, formState.password);
    } catch (err) {
      console.error('Error en login:', err);
    }
  };

  const togglePasswordVisibility = () => {
    updateFormState({ showPassword: !formState.showPassword });
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
              ¡Bienvenido Nuevamente!
            </h1>
            <p className="text-gray-600">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo de credencial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario o Email
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="flex-1 py-4 px-4 text-gray-900 bg-transparent outline-none placeholder-gray-500"
                    placeholder="usuario o correo@empresa.com"
                    value={formState.credential}
                    onChange={(e) => updateFormState({ credential: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Campo de contraseña */}
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {formState.showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                
                {/* Mensaje de error */}
                {error && (
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

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: loading
                  ? '#94A3B8'
                  : `linear-gradient(135deg, ${BUK_BLUE} 0%, ${BUK_DARK} 100%)`,
                boxShadow: loading ? 'none' : '0 4px 15px rgba(46, 73, 183, 0.3)'
              }}
              disabled={loading || !formState.credential.trim() || !formState.password.trim()}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Validando...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>

            {/* Enlaces adicionales */}
            <div className="text-center space-y-3 pt-4">
              <button
                type="button"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                disabled={loading}
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
                Privacidad y protección de datos
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Panel derecho - Hero visual */}
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

        <svg
          className="absolute top-0 -left-20 h-full w-20 text-gray-50"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M100 0 C45 25, 45 75, 100 100 L0 100 L0 0 Z" fill="currentColor" />
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
                <span className="text-white/95 font-medium drop-shadow-sm">Gestión simplificada de RRHH</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <span className="text-white/95 font-medium drop-shadow-sm">Colaboradores más conectados</span>
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