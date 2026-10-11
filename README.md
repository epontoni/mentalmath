# ⚡ MentalMath — Gimnasio de Cálculo Mental en Tiempo Real

> Plataforma abierta y colaborativa de agilidad numérica en tiempo real: entrena en solitario, desafía a tus compañeros con salas multijugador o proyecta desafíos en el aula escolar.

Desarrollado con pasión por **[Emanuel Pontoni](https://epontoni.github.io/)**.

---

## 🎯 ¿Qué es MentalMath?

**MentalMath** es una aplicación web interactiva inspirada en la dinamicidad de *Kahoot* y los métodos de cálculo rápido de *Arthur Benjamin*. Transforma complicados cálculos en operaciones sencillas y divertidas mediante trucos numéricos, tablas dinámicas y atajos matemáticos.

---

## 🚀 Características Principales

- **🎮 Multijugador en Tiempo Real:** Salas con código PIN de 6 dígitos que sincronizan a decenas de participantes en simultáneo con milisegundos de latencia vía WebSockets.
- **👨‍🏫 Modo Aula / Docente (Sólo Anfitrión):** Pensado para que el educador proyecte los cálculos, el reloj y el podio final en pantalla gigante o proyector sin participar como jugador ni alterar el ranking.
- **⚔️ Modo Duelo (Participar y Jugar):** Permite al creador de la sala competir contra sus amigos desde su propia pantalla con teclado interactivo, contando adicionalmente con un enlace para proyectar en una segunda pantalla o TV si lo desea.
- **⚡ Modo Práctica Rápida (1 Jugador):** Entrenamiento contrarreloj individual sin necesidad de crear salas ni esperar a nadie.
- **🎛️ Generador Modular de Operaciones:**
  - Sumas mentales y restas con llevada.
  - Multiplicación estándar y regla especial del 11.
  - Complementos a 100 y cálculo de potencias/cuadrados terminados en 5.
  - Propiedad distributiva, doble y mitad, y divisiones exactas.
- **🤖 Generador con Inteligencia Artificial:** Posibilidad de crear baterías de preguntas contextualizadas mediante IA.
- **⌨️ Teclado Numérico de Alta Velocidad:** Teclado táctil optimizado para celulares y compatibilidad con teclado numérico físico de PC.
- **🏆 Podio y Rachas de Fuego:** Bonificaciones por rachas de aciertos continuos, cálculo de velocidad y podio con confeti interactivo.
- **📚 Academia de Técnicas:** Sección educativa con explicaciones paso a paso de los mejores trucos y atajos matemáticos.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend Framework** | [Next.js](https://nextjs.org/) (App Router, v16/19) | Enrutamiento, SSR y renderizado de componentes cliente |
| **Librería UI** | [React 19](https://react.dev/) | Interfaces reactivas y componentes modulares |
| **Estilos** | [Tailwind CSS v4](https://tailwindcss.com/) | Diseño responsivo con estética neo-brutalista |
| **Animaciones** | [Framer Motion](https://www.framer.com/motion/) | Transiciones fluidas, animaciones de entrada y micro-interacciones |
| **Iconos** | [Lucide React](https://lucide.dev/) | Iconografía minimalista |
| **Efectos** | [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) | Celebración visual en el podio de ganadores |
| **Tiempo Real** | [Socket.IO](https://socket.io/) (v4.8) | Conexión bidireccional cliente-servidor con WebSockets y fallback HTTP |
| **Servidor Custom** | [Node.js](https://nodejs.org/) + `server.ts` | Servidor HTTP unificado que orquesta Next.js y el motor Socket.IO |
| **Ejecutor TypeScript** | [tsx](https://github.com/privatenumber/tsx) | Ejecución directa de TypeScript en Node con soporte para live-reload (`watch`) |
| **Gestión de Partidas** | In-Memory Authoritative `GameManager` | Motor de juego centralizado en memoria (sin latencia de BD en partida activa) |
| **Base de Datos (Opcional)**| [Prisma ORM](https://www.prisma.io/) + PostgreSQL | Modelos de persistencia para usuarios, torneos y registros de academia |

---

## 📋 Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas en tu sistema:

- **Node.js**: Versión 18.x, 20.x o superior (Probado en Node.js v20+ / v24+).
- **npm**: Gestor de paquetes incluido con Node.js (o alternativamente `pnpm`, `yarn` o `bun`).

---

## 📦 Puesta en Marcha (Desarrollo Local)

Sigue estos sencillos pasos para clonar y ejecutar el proyecto en tu entorno local:

### 1. Clonar el repositorio
```bash
git clone https://github.com/epontoni/mentalmath.git
cd mentalmath
```

### 2. Instalar dependencias
Instala los paquetes necesarios definidos en `package.json`:
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo
El proyecto utiliza un servidor customizado (`server.ts`) para inicializar tanto la aplicación de Next.js como el motor de WebSockets en el mismo puerto:
```bash
npm run dev
```

### 4. Abrir en el navegador
Una vez iniciado, abre tu navegador en:
```text
http://localhost:3000
```

> **💡 Nota sobre puertos:** El servidor se ejecutará por defecto en el puerto `3000`. Puedes definir otro puerto configurando la variable de entorno `PORT` (por ejemplo: `PORT=3001 npm run dev`).

---

## 📜 Scripts Disponibles

En el archivo `package.json` encontrarás los siguientes comandos:

- `npm run dev`: Inicia el servidor de desarrollo en modo observación con `tsx watch server.ts`.
- `npm run build`: Genera el build optimizado de producción de Next.js.
- `npm run start`: Ejecuta el servidor en modo producción con `tsx server.ts`.
- `npm run lint`: Ejecuta el análisis estático de código con ESLint.

---

## 📁 Estructura del Proyecto

```text
mentalmath/
├── prisma/
│   └── schema.prisma         # Esquema de base de datos relacional (PostgreSQL)
├── public/                   # Recursos estáticos (sonidos, imágenes, favicon)
├── server.ts                 # Punto de entrada del servidor Node + Socket.IO + Next.js
├── src/
│   ├── app/                  # Rutas y páginas de Next.js (App Router)
│   │   ├── page.tsx          # Landing page principal (Unirse con PIN o Crear Sala)
│   │   ├── play/             # Interfaz del jugador (lobby, cuenta regresiva, teclado de respuesta)
│   │   ├── host/
│   │   │   ├── create/       # Pantalla de configuración y creación de sala
│   │   │   └── [pin]/        # Vista del anfitrión (proyector, tablero de aula, podio)
│   │   ├── academy/          # Cursos y técnicas explicadas de cálculo mental
│   │   └── api/              # Endpoints API (generador con IA, etc.)
│   ├── components/           # Componentes modulares reutilizables
│   │   ├── common/           # Logo 3D animado, modales, etc.
│   │   ├── game/             # Teclado (Keypad), Podio, Temporizador
│   │   └── layout/           # Barra de navegación (Navbar), etc.
│   ├── hooks/                # Hooks personalizados de React (useGameSocket, etc.)
│   ├── lib/                  # Generadores matemáticos, sonidos y datos estáticos
│   ├── server/               # Lógica del servidor de juego
│   │   ├── game-manager.ts   # Motor central autoritativo de salas y puntuación en memoria
│   │   └── socket-handlers.ts# Controladores de eventos de WebSockets
│   └── types/                # Definiciones de TypeScript (Game, Rooms, Socket events)
├── package.json              # Manifiesto de dependencias y scripts
├── tsconfig.json             # Configuración de TypeScript
└── README.md                 # Documentación del proyecto
```

---

## 🤝 Guía para Colaboradores

¡Las contribuciones son bienvenidas! Si deseas colaborar:

1. **Haz un Fork** del repositorio.
2. **Crea una rama** para tu funcionalidad o corrección:
   ```bash
   git checkout -b feature/nueva-tecnica-calculo
   ```
3. **Realiza tus cambios** manteniendo los estándares de TypeScript y el diseño coherente con la guía estética.
4. **Verifica que el código compile y pase los linters**:
   ```bash
   npm run lint
   ```
5. **Haz Commit** de tus cambios siguiendo mensajes descriptivos:
   ```bash
   git commit -m "feat: agrega truco de multiplicación por 25 a la academia"
   ```
6. **Haz Push** a tu rama:
   ```bash
   git push origin feature/nueva-tecnica-calculo
   ```
7. **Abre un Pull Request** explicando las mejoras incorporadas.

---

## ☕ Apoyo y Donaciones

Si este proyecto te resulta útil para tu escuela, universidad o práctica personal, puedes apoyar su mantenimiento y desarrollo continuo:

- **Mercado Pago:** [link.mercadopago.com.ar/emanuelpontoni](https://link.mercadopago.com.ar/emanuelpontoni)
- **Web del Autor:** [epontoni.github.io](https://epontoni.github.io/)

---

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Consulta el código fuente y úsalo libremente para fines educativos o comunitarios.
