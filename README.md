# MDP TI (React + Vite + Tailwind)

UI de ejemplo inspirada en Buk: login, cabecera y sidebar, con backend simulado.

## Requisitos
- Node.js 18+ y npm

## Pasos para correrlo
1. Instala dependencias:
   ```bash
   npm install
   ```
2. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre la URL que te muestra Vite (por defecto http://localhost:5173).

## Estructura
- `src/App.jsx`: componentes (Login, Header, Sidebar) y mock de login.
- `src/main.jsx`: arranque de React.
- `index.html`, `index.css`: base y Tailwind.
- `tailwind.config.js`, `postcss.config.js`: configuración Tailwind.

## Notas
- El login actualmente usa un **mock**. Cambia `mockLogin` por un `fetch('/api/auth/login')` cuando tengas backend real.
- Colores y layout están inspirados visualmente en Buk para propósitos de desarrollo interno.
