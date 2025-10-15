// src/seven/Portal/Portal.tsx
import { useState, useEffect } from 'react';
import { Avatar } from '../../components/Avatar';

interface PortalProps {
  isSidebarCollapsed?: boolean;
}

interface DashboardData {
  infoTurnos: {
    totalTurnos: number;
    periodo: string;
    mes: number;
    anio: number;
  };
  vencimientoPase: {
    fechaVencimiento: string;
    diasParaVencer: number | null;
    vencido: boolean;
    proximoAVencer: boolean;
  };
  proximosCumpleanos: Array<{
    nombreCompleto: string;
    fechaCumpleanos: string;
    diasParaCumpleanos: number;
    traFoto: string;
    tseNombre: string;
  }>;
}

interface Post {
  id: string;
  type: 'birthday' | 'welcome' | 'announcement' | 'celebration';
  title: string;
  content: string;
  author: string;
  date: string;
  time: string;
  image?: string;
  personName?: string;
  icon?: React.ReactNode;
}

export function Portal({ isSidebarCollapsed = false }: PortalProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8081/api/v1/dashboard/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            console.log('Dashboard data:', result.data);
            setDashboardData(result.data);
          }
        }
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const posts: Post[] = [
    {
      id: '1',
      type: 'birthday',
      title: 'Celebramos los cumpleaños de agosto',
      content: '🎉🎈 Hoy tuvimos la alegría de celebrar a nuestros compañeros que estuvieron de cumpleaños durante el mes de agosto: Héctor Saldía, Jaime Mellado, Javier Concha, Marcelo Cerna, Cristian Godoy, Ricardo Muñoz y Rodrigo Flores.\n\nLes enviamos un afectuoso saludo y nuestros mejores deseos de éxito y felicidad.\n\n¡Gracias por ser parte de nuestro equipo!',
      author: 'Muelles de Penco',
      date: '10 de septiembre',
      time: '11:30 AM',
      image: 'https://media.licdn.com/dms/image/v2/D4E22AQHtOsNvsGgafQ/feedshare-shrink_1280/B4EZSEKHo1HgAw-/0/1737384034529?e=1760572800&v=beta&t=iy2MLpmhLTvbz80gEcQP2jAbYo6nx7SFP4RQnEqoqWI',
      icon: (
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        </div>
      )
    },
    {
      id: '2',
      type: 'welcome',
      title: 'Un nuevo integrante se suma al equipo ¡Bienvenido!',
      content: 'Damos la bienvenida a nuestro nuevo compañero que se integró al equipo esta semana.\n\n¡Le deseamos mucho éxito en este nuevo desafío!',
      author: 'Muelles de Penco',
      date: '15 de julio',
      time: '04:30 PM',
      icon: (
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        </div>
      )
    }
  ];

  const getAvatarGender = (genero?: string): 'male' | 'female' => {
    const g = genero?.toLowerCase() || '';
    if (g.includes('femenino') || g.includes('femenina')) return 'female';
    return 'male';
  };

  const renderPost = (post: Post) => {
    return (
      <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            {post.icon}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">{post.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Por {post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.time}</span>
              </div>
            </div>
          </div>
        </div>

        {post.content && (
          <div className="p-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>
        )}

        {post.image && (
          <div className="relative">
            <img src={post.image} alt="Post" className="w-full h-64 object-cover" />
          </div>
        )}

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 6v4m-5 8h2.5a2 2 0 002-2V8.5a2 2 0 00-2-2H4a2 2 0 00-2 2v5.5a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Me gusta</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm">Comentar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className={`
      flex-1 bg-gray-50 min-h-[calc(100vh-5rem)] w-full overflow-x-hidden
      transition-all duration-300 ease-in-out
      p-4 lg:p-6
      pb-20 lg:pb-6
      ${isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}
    `}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal</h1>
          <p className="text-gray-600">Mantente al día con las novedades de la empresa</p>
        </div>

        {/* Layout: Noticias + Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Noticias (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {posts.map(post => renderPost(post))}
          </div>

          {/* Columna Derecha: Dashboard (1/3) */}
          <div className="space-y-4">
            {/* Card: Turnos Trabajados */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Turnos del Mes</h3>
                  <p className="text-xs text-gray-500">
                    {loading ? 'Cargando...' : dashboardData?.infoTurnos.periodo || 'N/A'}
                  </p>
                </div>
              </div>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-1">
                    {dashboardData?.infoTurnos.totalTurnos || 0}
                  </div>
                  <p className="text-sm text-gray-600">turnos trabajados</p>
                </div>
              )}
            </div>

            {/* Card: Vencimiento Pase Portuario */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  dashboardData?.vencimientoPase.vencido 
                    ? 'bg-red-100' 
                    : dashboardData?.vencimientoPase.proximoAVencer 
                      ? 'bg-yellow-100' 
                      : 'bg-green-100'
                }`}>
                  <svg className={`w-5 h-5 ${
                    dashboardData?.vencimientoPase.vencido 
                      ? 'text-red-600' 
                      : dashboardData?.vencimientoPase.proximoAVencer 
                        ? 'text-yellow-600' 
                        : 'text-green-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Pase Portuario</h3>
                  <p className="text-xs text-gray-500">Fecha de vencimiento</p>
                </div>
              </div>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {dashboardData?.vencimientoPase.fechaVencimiento || 'Sin fecha'}
                    </div>
                  </div>
                  {dashboardData?.vencimientoPase.diasParaVencer !== null && (
                    <div className={`text-center p-2 rounded-lg ${
                      dashboardData?.vencimientoPase.vencido 
                        ? 'bg-red-50 text-red-700' 
                        : dashboardData?.vencimientoPase.proximoAVencer 
                          ? 'bg-yellow-50 text-yellow-700' 
                          : 'bg-green-50 text-green-700'
                    }`}>
                      <p className="text-sm font-medium">
                        {dashboardData && dashboardData.vencimientoPase.vencido 
                          ? `Vencido hace ${Math.abs(dashboardData.vencimientoPase.diasParaVencer ?? 0)} días`
                          : dashboardData && dashboardData.vencimientoPase.diasParaVencer === 0
                            ? '¡Vence hoy!'
                            : dashboardData
                              ? `${dashboardData.vencimientoPase.diasParaVencer ?? 0} días restantes`
                              : ''
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Card: Próximos Cumpleaños */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.506 2.506 0 00-1.5-.454M9 6v2m6-2v2m-9 7h12m-9 4h12" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Próximos Cumpleaños</h3>
                  <p className="text-xs text-gray-500">Siguientes 30 días</p>
                </div>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : dashboardData?.proximosCumpleanos && dashboardData.proximosCumpleanos.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.proximosCumpleanos.map((cumpleanero, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Avatar
                        name={cumpleanero.nombreCompleto}
                        size="md"
                        gender={getAvatarGender(cumpleanero.tseNombre)}
                        src={cumpleanero.traFoto && cumpleanero.traFoto.trim() !== '' ? cumpleanero.traFoto : undefined}
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {cumpleanero.nombreCompleto}
                        </p>
                        <p className="text-xs text-gray-500">
                          {cumpleanero.diasParaCumpleanos === 0 
                            ? '🎉 ¡Hoy!'
                            : cumpleanero.diasParaCumpleanos === 1
                              ? '🎂 Mañana'
                              : `En ${cumpleanero.diasParaCumpleanos} días`
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">No hay cumpleaños próximos</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}