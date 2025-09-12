// src/seven/Portal/Portal.tsx
import { Avatar } from '../../components/Avatar';

interface PortalProps {
  isSidebarCollapsed?: boolean;
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
  profileImage?: string;
  personName?: string;
  likes?: number;
  comments?: number;
  icon?: React.ReactNode;
}

export function Portal({ isSidebarCollapsed = false }: PortalProps) {
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
      type: 'celebration',
      title: '¡Felicidades! Rodrigo Andrés Flores celebra su cumpleaños',
      content: '',
      author: 'Muelles de Penco',
      date: '27 de agosto',
      time: '08:00 AM',
      personName: 'Rodrigo Andrés Flores',
      likes: 3,
      icon: (
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-lg">🎂</span>
        </div>
      )
    },
    {
      id: '3',
      type: 'welcome',
      title: 'Un nuevo integrante se suma al equipo ¡Bienvenido, Jonathan!',
      content: 'Damos la bienvenida a Jonathan Campos Toloza, quien ayer se integró al equipo como Supervisor de Mantenimiento, reportando directamente a Gonzalo Rubilar.\n\nJonathan es Ingeniero (E) en Mantenimiento Industrial de la Universidad Federico Santa María. Vive en Concepción junto a su pareja y sus dos hijos. En su tiempo libre, es voluntario en la 5ta Compañía de Bomberos de Concepción y también disfruta jugar fútbol.\n\n¡Le deseamos mucho éxito en este nuevo desafío!',
      author: 'Muelles de Penco',
      date: '15 de julio',
      time: '04:30 PM',
      image: 'https://bukwebapp-enterprise-chile.s3.amazonaws.com/muellesdepenco/employee_portal/mural_photo/url/1919/b07e6732-b786-447a-bd4a-04144a1388a7-Ingresos_para_BUK.png',
      personName: 'Jonathan Campos Toloza',
      icon: (
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        </div>
      )
    }
  ];

  const formatDate = (date: string) => {
    return date;
  };

  const renderPost = (post: Post) => {
    return (
      <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Header del post */}
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

        {/* Contenido del post */}
        {post.content && (
          <div className="p-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>
        )}

        {/* Imagen del post */}
        {post.image && (
          <div className="relative">
            <img
              src={post.image}
              alt="Post image"
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Perfil especial para cumpleaños y bienvenidas */}
        {(post.type === 'celebration' || post.type === 'welcome') && post.personName && (
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar 
                name={post.personName}
                size="lg"
                className="mb-3 border-4 border-blue-100 shadow-lg"
              />
              <h4 className="font-semibold text-gray-900">{post.personName}</h4>
              {post.type === 'welcome' && (
                <p className="text-sm text-gray-600 mt-1">Nuevo integrante</p>
              )}
            </div>
          </div>
        )}

        {/* Footer con interacciones */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 6v4m-5 8h2.5a2 2 0 002-2V8.5a2 2 0 00-2-2H4a2 2 0 00-2 2v5.5a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Me gusta</span>
                {post.likes && <span className="text-sm font-medium">{post.likes}</span>}
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm">Comentar</span>
                {post.comments && <span className="text-sm font-medium">{post.comments}</span>}
              </button>
            </div>
            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span className="text-sm">Compartir</span>
            </button>
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
      <div className="max-w-4xl mx-auto">
        {/* Header del Portal */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal</h1>
          <p className="text-gray-600">Mantente al día con las novedades de la empresa</p>
        </div>

        {/* Filtros y acciones */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Todas las novedades
              </button>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                Cumpleaños
              </button>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                Nuevos integrantes
              </button>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                Anuncios
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Timeline de posts */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <div key={post.id}>
              {/* Separador de fecha para posts antiguos */}
              {index > 0 && (
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-50 text-gray-500 font-medium">
                      {formatDate(post.date)}
                    </span>
                  </div>
                </div>
              )}
              {renderPost(post)}
            </div>
          ))}
        </div>

        {/* Botón cargar más */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Cargar más publicaciones
          </button>
        </div>
      </div>
    </main>
  );
}