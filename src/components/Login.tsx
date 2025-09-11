import { useState, FormEvent } from 'react';
import type { LoginProps, LoginState } from '../types';
import { mockLogin } from '../utils/auth';
import { COLORS } from '../utils/constants';

const { BUK_BLUE, BUK_DARK, ACCENT_YELLOW } = COLORS;

export function Login({ onSuccess }: LoginProps) {
  const [state, setState] = useState<LoginState>({
    email: '',
    error: '',
    loading: false,
  });

  const updateState = (updates: Partial<LoginState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateState({ error: '', loading: true });

    try {
      const user = await mockLogin(state.email.trim());
      onSuccess(user);
    } catch (err) {
      updateState({
        error: err instanceof Error ? err.message : 'Error desconocido',
        loading: false
      });
    }
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
              className="w-16 h-16 mx-auto mb-4"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }}
            />
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Bienvenido Nuevamente!
            </h1>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div
                  className={`flex items-center rounded-lg border-2 transition-colors ${
                    state.error
                      ? 'border-red-300 focus-within:border-red-500'
                      : 'border-gray-200 focus-within:border-blue-500'
                  } bg-white`}
                >
                  <span className="pl-4 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="flex-1 py-4 px-4 text-gray-900 bg-transparent outline-none placeholder-gray-500"
                    placeholder="tu@empresa.com"
                    value={state.email}
                    onChange={(e) => updateState({ email: e.target.value })}
                    aria-invalid={!!state.error}
                  />
                </div>
                {state.error && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {state.error}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: state.loading
                  ? '#94A3B8'
                  : `linear-gradient(135deg, ${BUK_BLUE} 0%, ${BUK_DARK} 100%)`,
                boxShadow: state.loading ? 'none' : '0 4px 15px rgba(46, 73, 183, 0.3)'
              }}
              disabled={state.loading}
            >
              {state.loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Ingresando...
                </div>
              ) : (
                'Siguiente'
              )}
            </button>

            {/* Enlaces adicionales */}
            <div className="text-center space-y-3 pt-4">
              <button
                type="button"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
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
              >
                Privacidad y protección de datos
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Panel derecho - Hero visual con curva suave (estilo BUK) */}
      <div className="hidden lg:block lg:w-[52%] relative">
        {/* Fondo con degradado */}
        <div
          className="absolute inset-0 h-full"
          style={{
            background: `linear-gradient(135deg, ${BUK_BLUE} 0%, ${BUK_DARK} 100%)`
          }}
        />

        {/* Curva de separación: SVG delgado a la izquierda */}
        <svg
          className="absolute top-0 -left-20 h-full w-20 text-gray-50"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/*
            Curva menos invasiva:
            - Para que "entre" menos, sube los valores 45 -> 55 o 60.
            - Para que "entre" más, baja a 40.
          */}
          <path d="M100 0 C45 25, 45 75, 100 100 L0 100 L0 0 Z" fill="currentColor" />
        </svg>

        {/* Formas decorativas */}
        <div className="absolute inset-0 z-10">
          <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white/5 backdrop-blur-sm"></div>
          <div className="absolute bottom-32 left-16 w-24 h-24 rounded-full bg-white/10"></div>
          <div className="absolute top-1/3 left-20 w-16 h-16 rounded-full bg-yellow-400/20"></div>

          {/* Círculo grande de fondo */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }}
          />

          {/* Ilustración central (igual que la tuya) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Fondo circular blanco semitransparente */}
              <div className="absolute inset-0 bg-white/20 rounded-full backdrop-blur-sm border border-white/30"></div>

              {/* Iconos centrales */}
              <div className="relative z-10 flex items-center justify-center space-x-4">
                {/* Personas */}
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="w-10 h-10 bg-pink-400/80 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Candado */}
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ background: ACCENT_YELLOW }}
                >
                  <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* Llave */}
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="relative z-20 flex flex-col justify-center px-16 text-white h-full">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Crea un lugar de trabajo <span style={{ color: ACCENT_YELLOW }}>más feliz :)</span>
            </h2>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Gestiona tu equipo, simplifica procesos y mejora la experiencia laboral de todos.
            </p>

            {/* Características destacadas */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-blue-100">Gestión simplificada de RRHH</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <span className="text-blue-100">Colaboradores más conectados</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-blue-100">Procesos automatizados</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
