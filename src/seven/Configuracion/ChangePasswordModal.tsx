// src/seven/ChangePasswordModal.tsx
import React, { useState, useEffect } from 'react';
import { useChangePassword, type ChangePasswordRequest } from '../../hooks/useChangePassword';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { loading, error, success, changePassword, clearState } = useChangePassword();
  const [formState, setFormState] = useState<FormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });

  const updateFormState = (updates: Partial<FormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  // Limpiar formulario cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setFormState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false
      });
      clearState();
    }
  }, [isOpen, clearState]);

  // Cerrar automáticamente después del éxito
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones locales
    if (!formState.currentPassword.trim()) {
      return;
    }

    if (!formState.newPassword.trim()) {
      return;
    }

    if (formState.newPassword !== formState.confirmPassword) {
      return;
    }

    const request: ChangePasswordRequest = {
      currentPassword: formState.currentPassword,
      newPassword: formState.newPassword,
      confirmPassword: formState.confirmPassword
    };

    await changePassword(request);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    switch (field) {
      case 'current':
        updateFormState({ showCurrentPassword: !formState.showCurrentPassword });
        break;
      case 'new':
        updateFormState({ showNewPassword: !formState.showNewPassword });
        break;
      case 'confirm':
        updateFormState({ showConfirmPassword: !formState.showConfirmPassword });
        break;
    }
  };

  const isFormValid = () => {
    return formState.currentPassword.trim() &&
           formState.newPassword.trim() &&
           formState.confirmPassword.trim() &&
           formState.newPassword === formState.confirmPassword;
  };

  const passwordsMatch = formState.newPassword === formState.confirmPassword;
  const showPasswordMismatch = formState.confirmPassword && !passwordsMatch;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-xl transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Cambiar Contraseña
              </h3>
              <button
                onClick={onClose}
                className="text-blue-100 hover:text-white transition-colors"
                disabled={loading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Mensaje de éxito */}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-700 font-medium">
                    ¡Contraseña cambiada exitosamente!
                  </span>
                </div>
              </div>
            )}

            {/* Mensaje de error */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Contraseña actual */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña Actual
                </label>
                <div className="relative">
                  <input
                    type={formState.showCurrentPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ingresa tu contraseña actual"
                    value={formState.currentPassword}
                    onChange={(e) => updateFormState({ currentPassword: e.target.value })}
                    disabled={loading || success}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading || success}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      {formState.showCurrentPassword ? (
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
              </div>

              {/* Nueva contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={formState.showNewPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ingresa tu nueva contraseña"
                    value={formState.newPassword}
                    onChange={(e) => updateFormState({ newPassword: e.target.value })}
                    disabled={loading || success}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading || success}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      {formState.showNewPassword ? (
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
              </div>

              {/* Confirmar nueva contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={formState.showConfirmPassword ? 'text' : 'password'}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      showPasswordMismatch 
                        ? 'border-red-300 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                    placeholder="Confirma tu nueva contraseña"
                    value={formState.confirmPassword}
                    onChange={(e) => updateFormState({ confirmPassword: e.target.value })}
                    disabled={loading || success}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading || success}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      {formState.showConfirmPassword ? (
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
                {showPasswordMismatch && (
                  <p className="mt-2 text-sm text-red-600">
                    Las contraseñas no coinciden
                  </p>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  disabled={loading || !isFormValid() || success}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Cambiando...
                    </div>
                  ) : (
                    'Cambiar Contraseña'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export por defecto también para mayor compatibilidad
export default ChangePasswordModal;