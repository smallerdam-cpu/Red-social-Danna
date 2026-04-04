# 🌌 Mi Galaxia

Una aplicación web interactiva de red social con una galería 3D de galaxias, autenticación de usuarios y características personalizadas.

## ✨ Características

- 🌟 **Visualización 3D Interactiva**: Galaxia 3D renderizada con Three.js y WebGL
- 👤 **Autenticación con Firebase**: Sistema de login y registro de cuentas
- 🎵 **Reproductor de Música**: Control de audio integrado
- 📱 **Diseño Responsive**: Optimizado para mobile con Tailwind CSS
- 🎂 **Cumpleaños Personalizado**: Cuenta regresiva para abril 9 con mensaje especial
- 🛠️ **Dev Tools**: Herramientas de desarrollo integradas para testing

## 🚀 Stack Tecnológico

- **Frontend**: React 19 + TypeScript + Vite
- **UI**: Tailwind CSS + Framer Motion
- **3D Graphics**: Three.js + React Three Fiber
- **Backend**: Firebase Realtime Database
- **Build Tool**: Vite 7

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/mi-galaxia.git
cd mi-galaxia

# Instalar dependencias
npm install

# Configurar Firebase
# 1. Crear proyecto en firebase.google.com
# 2. Actualizar src/config/firebase.ts con tus credenciales

# Iniciar servidor de desarrollo
npm run dev
```

## 🔐 Credenciales Demo

- Usuario: `admin`
- Contraseña: `1998`

## 📝 Funcionalidades

### Login & Signup
- Inicia sesión con credenciales
- Crea nueva cuenta guardada en Firebase
- Validación de email y contraseña

### Dashboard
- Acceso a la Galaxia 3D
- Cuenta regresiva para cumpleaños (9 de abril)
- Dev Tools (⚙️) para testing de fechas

### Galaxia 3D
- Visualización interactiva de 500 estrellas
- Música de fondo
- Optimizaciones de rendimiento (viewport culling, caching)

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Touch targets 44px+
- ✅ Breakpoints: sm (640px), md (768px), lg (1024px)

## 🔧 Configuración Firebase Requerida

En `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "https://your-project.firebaseio.com"
};
```

## 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── LoginScreen.tsx          # Pantalla de login con Firebase validation
│   ├── SignUpScreen.tsx         # Registro de nuevos usuarios
│   ├── Dashboard.tsx            # Menú principal
│   ├── GalaxyScreen.tsx         # Visualización 3D
│   ├── MusicPlayer.tsx          # Reproductor de audio
│   └── QuestionScreen.tsx       # Preguntas iniciales
├── config/
│   └── firebase.ts              # Configuración de Firebase
├── utils/
│   └── cn.ts                    # Utilidades CSS
├── App.tsx                      # Componente raíz
└── main.tsx                     # Punto de entrada
```

## 🎮 Controles

- **Mouse/Touch**: Interactuar con la galaxia
- **Dev Tools (⚙️)**: Cambiar fecha para testing

## 📄 Licencia

Este proyecto es de uso personal.

## 👨‍💻 Autor

Danna - Mi Página Web

---

**Nota**: Asegúrate de configurar las credenciales de Firebase antes de deployar.
