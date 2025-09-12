// src/components/Avatar.tsx
import React from 'react';

// 1. DEFINIR LAS PROPIEDADES QUE ACEPTA EL COMPONENTE
interface AvatarProps {
  src?: string;           // URL de imagen personalizada (opcional)
  alt?: string;           // Texto alternativo para la imagen (opcional)
  name?: string;          // Nombre de la persona (opcional)
  gender?: 'male' | 'female' | 'other'; // Género (opcional)
  size?: 'sm' | 'md' | 'lg' | 'xl';     // Tamaño del avatar (opcional)
  className?: string;     // Clases CSS adicionales (opcional)
}

// 2. DEFINIR LOS TAMAÑOS DISPONIBLES
const sizeClasses = {
  sm: 'w-8 h-8',      // 32px × 32px
  md: 'w-10 h-10',    // 40px × 40px  
  lg: 'w-16 h-16',    // 64px × 64px
  xl: 'w-20 h-20'     // 80px × 80px
};

// 3. FUNCIÓN PARA DETECTAR GÉNERO BASADO EN EL NOMBRE
const inferGenderFromName = (name: string): 'male' | 'female' => {
  // Lista básica de nombres femeninos comunes en español
  const femaleNames = [
    'ana', 'maria', 'carmen', 'laura', 'sofia', 'valentina', 
    'isabella', 'alejandra', 'andrea', 'carolina', 'fernanda',
    'paula', 'camila', 'natalia', 'daniela', 'gabriela'
  ];
  
  // Extraer el primer nombre y convertirlo a minúsculas
  const firstName = name.toLowerCase().split(' ')[0];
  
  // Si está en la lista de nombres femeninos, devolver 'female', sino 'male'
  return femaleNames.includes(firstName) ? 'female' : 'male';
};

// 4. COMPONENTE PRINCIPAL
export function Avatar({ 
  src,                    // Imagen personalizada
  alt, 
  name = '',              // Valor por defecto: cadena vacía
  gender,                 // Puede ser undefined
  size = 'md',            // Valor por defecto: tamaño mediano
  className = ''          // Valor por defecto: sin clases adicionales
}: AvatarProps) {
  
  // 5. DETERMINAR EL GÉNERO
  // Si no se proporciona género, intentar detectarlo del nombre
  const detectedGender = gender || inferGenderFromName(name);
  
  // 6. CASO 1: SI HAY IMAGEN PERSONALIZADA
  if (src) {
    return (
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Si falla la carga de la imagen personalizada, 
            // cambiar a imagen genérica
            const target = e.target as HTMLImageElement;
            target.src = detectedGender === 'female' ? '/woman.png' : '/men.png';
          }}
        />
      </div>
    );
  }

  // 7. CASO 2: USAR IMAGEN GENÉRICA
  const genericImage = detectedGender === 'female' ? '/woman.png' : '/men.png';
  
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
      <img
        src={genericImage}
        alt={alt || name || 'Avatar'}
        className="w-full h-full object-cover"
        onError={(e) => {
          // 8. CASO 3: FALLBACK FINAL - MOSTRAR INICIALES
          // Si las imágenes genéricas también fallan
          const target = e.target as HTMLImageElement;
          const parent = target.parentElement;
          
          if (parent) {
            // Extraer iniciales del nombre
            const initials = name
              .split(' ')                    // Dividir por espacios
              .map(word => word.charAt(0))   // Tomar primera letra de cada palabra
              .join('')                      // Unir las letras
              .substring(0, 2)               // Tomar máximo 2 caracteres
              .toUpperCase() || '?';         // Convertir a mayúsculas, '?' si está vacío
            
            // Determinar tamaño del texto según el tamaño del avatar
            const textSize = size === 'sm' ? 'text-xs' : 
                           size === 'lg' ? 'text-lg' : 
                           size === 'xl' ? 'text-xl' : 'text-sm';
            
            // Reemplazar la imagen con un div que contiene las iniciales
            parent.innerHTML = `
              <div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span class="text-white font-semibold ${textSize}">${initials}</span>
              </div>
            `;
          }
        }}
      />
    </div>
  );
}