// src/hooks/useRutFormatter.ts
import { useState, useCallback } from 'react';

interface RutFormatterResult {
  formattedValue: string;
  rawValue: string;
  isValid: boolean;
  handleChange: (value: string) => void;
  reset: () => void;
}

export function useRutFormatter(initialValue = ''): RutFormatterResult {
  const [formattedValue, setFormattedValue] = useState(() => formatRut(initialValue));
  const [rawValue, setRawValue] = useState(() => cleanRut(initialValue));

  const handleChange = useCallback((value: string) => {
    const cleaned = cleanRut(value);
    const formatted = formatRut(cleaned);
    
    setRawValue(cleaned);
    setFormattedValue(formatted);
  }, []);

  const reset = useCallback(() => {
    setFormattedValue('');
    setRawValue('');
  }, []);

  const isValid = validateRut(rawValue);

  return {
    formattedValue,
    rawValue,
    isValid,
    handleChange,
    reset
  };
}

/**
 * Limpia el RUT removiendo puntos, guiones y espacios
 */
function cleanRut(rut: string): string {
  if (!rut) return '';
  return rut.toString().replace(/[^0-9kK]/g, '').toUpperCase();
}

/**
 * Formatea el RUT con puntos y guión
 */
function formatRut(rut: string): string {
  if (!rut) return '';
  
  const cleaned = cleanRut(rut);
  
  if (cleaned.length === 0) return '';
  if (cleaned.length === 1) return cleaned;
  
  // Separar número del dígito verificador
  const number = cleaned.slice(0, -1);
  const verifier = cleaned.slice(-1);
  
  if (number.length === 0) return verifier;
  
  // Formatear el número con puntos
  const formattedNumber = number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formattedNumber}-${verifier}`;
}

/**
 * Valida si un RUT es válido usando el algoritmo del módulo 11
 */
function validateRut(rut: string): boolean {
  if (!rut || rut.length < 2) return false;
  
  const cleaned = cleanRut(rut);
  
  if (cleaned.length < 2 || cleaned.length > 9) return false;
  
  const number = cleaned.slice(0, -1);
  const verifier = cleaned.slice(-1);
  
  // Validar que el número solo contenga dígitos
  if (!/^\d+$/.test(number)) return false;
  
  // Validar que el verificador sea dígito o K
  if (!/^[0-9K]$/.test(verifier)) return false;
  
  // Calcular dígito verificador
  let sum = 0;
  let multiplier = 2;
  
  for (let i = number.length - 1; i >= 0; i--) {
    sum += parseInt(number[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const remainder = sum % 11;
  let expectedVerifier: string;
  
  if (remainder === 1) {
    expectedVerifier = 'K';
  } else if (remainder === 0) {
    expectedVerifier = '0';
  } else {
    expectedVerifier = (11 - remainder).toString();
  }
  
  return verifier === expectedVerifier;
}

/**
 * Función utilitaria para obtener el RUT limpio (sin formato)
 */
export function getRawRut(formattedRut: string): string {
  return cleanRut(formattedRut);
}

/**
 * Función utilitaria para formatear un RUT
 */
export function formatRutValue(rut: string): string {
  return formatRut(rut);
}

/**
 * Función utilitaria para validar un RUT
 */
export function isValidRut(rut: string): boolean {
  return validateRut(rut);
}