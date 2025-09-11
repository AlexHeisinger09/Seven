import React, { useState } from "react";

const BUK_BLUE = "#2E49B7";
const BUK_DARK = "#1C2C6B";
const ACCENT_YELLOW = "#FFB100";

function mockLogin(email) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email) return reject(new Error("no puede estar en blanco"));
      if (email.includes("@")) resolve({ token: "demo-token", email });
      else reject(new Error("formato de email inválido"));
    }, 600);
  });
}

function Login({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await mockLogin(email.trim());
      onSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", border: `2px solid ${BUK_BLUE}` }}
            >
              <span className="text-2xl font-semibold" style={{ color: BUK_BLUE }}>•buk•</span>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">¡Bienvenido Nuevamente!</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className={`flex items-center rounded-md border ${error ? 'border-red-400' : 'border-gray-300'} bg-white focus-within:ring-2 focus-within:ring-blue-500` }>
                <span className="px-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.94 6.34L10 10.88l7.06-4.54A2 2 0 0015.94 4H4.06a2 2 0 00-1.12 2.34z"/><path d="M18 8.12l-8 5.14-8-5.14V14a2 2 0 002 2h12a2 2 0 002-2V8.12z"/></svg>
                </span>
                <input
                  type="email"
                  className="flex-1 py-2.5 pr-3 outline-none rounded-r-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!error}
                />
              </div>
              {error && (<p className="text-red-500 text-sm mt-1">{error}</p>)}
            </div>
            <button type="submit" className="w-full py-3 rounded-md font-medium text-white" style={{ background: BUK_BLUE }} disabled={loading}>
              {loading ? "Cargando..." : "Siguiente"}
            </button>
            <div className="text-center text-sm text-gray-600 space-y-2">
              <button type="button" className="hover:underline">¿Olvidaste tu contraseña?</button>
              <div><button type="button" className="hover:underline">Privacidad y protección de datos</button></div>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white items-center justify-center p-10 relative overflow-hidden">
        <div className="absolute -top-24 -right-16 w-[520px] h-[520px] rounded-3xl" style={{ background: BUK_DARK, transform: 'rotate(35deg)' }} />
        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl font-bold leading-tight">Crea un lugar de trabajo <span style={{ color: ACCENT_YELLOW }}>más feliz :)</span></h2>
          <div className="mt-8 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M12 1l3 7h7l-5.5 4 2.5 7-7-4.5L5.5 19 8 12 2 8h7z"/></svg>
            </div>
            <div><p className="text-white/90">Simulación visual inspirada en Buk para propósitos de desarrollo.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({ user, onSignOut }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b bg-white" style={{ borderColor: "#E5E7EB" }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ border: `2px solid ${BUK_BLUE}` }}>
          <span className="text-sm font-semibold" style={{ color: BUK_BLUE }}>•buk•</span>
        </div>
        <span className="font-semibold text-gray-808">MDP TI – Demo RRHH</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 hidden sm:inline">{user?.email}</span>
        <button onClick={onSignOut} className="text-sm px-3 py-1.5 rounded-md text-white" style={{ background: BUK_BLUE }}>Salir</button>
      </div>
    </header>
  );
}

function Sidebar() {
  const items = [
    { icon: "📊", label: "Dashboard" },
    { icon: "👤", label: "Colaboradores" },
    { icon: "📝", label: "Remuneraciones" },
    { icon: "⏱️", label: "Asistencia" },
    { icon: "📄", label: "Documentos" },
    { icon: "⚙️", label: "Configuración" },
  ];
  return (
    <aside className="w-64 border-r bg-white h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-3 space-y-1">
        {items.map((it) => (
          <button key={it.label} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-gray-100 text-gray-700">
            <span className="text-lg" aria-hidden>{it.icon}</span>
            <span className="text-sm font-medium">{it.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

function Content() {
  return (
    <main className="flex-1 p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {["Colaboradores", "Tareas", "Documentos", "Novedades", "Licencias", "Beneficios"].map((t) => (
          <div key={t} className="bg-white rounded-2xl p-5 shadow-sm border">
            <h3 className="font-semibold mb-2">{t}</h3>
            <p className="text-sm text-gray-600">Módulo placeholder para {t.toLowerCase()} (datos mock).</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  if (!user) return <Login onSuccess={setUser} />;
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onSignOut={() => setUser(null)} />
      <div className="flex flex-1">
        <Sidebar />
        <Content />
      </div>
    </div>
  );
}
