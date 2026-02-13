# FibLinks

Estoy cansado de tener que ir a diferentes plataformas buscar apuntes y ejercicios durante mucho rato, así que he decidido unificarlo.

## 📝 Descripción

FibLinks es un dashboard web construido con Next.js y Tailwind CSS que te permite gestionar todas tus asignaturas y sus enlaces de recursos educativos en un solo lugar. Perfecto para estudiantes que quieren organizar apuntes, ejercicios, videos y cualquier otro material de estudio.

## ✨ Características

- ✅ **Añadir y eliminar asignaturas** con nombre y descripción
- ✅ **Gestionar enlaces** para cada asignatura (añadir, ver, eliminar)
- ✅ **Interfaz intuitiva** con diseño responsive
- ✅ **Almacenamiento local** - tus datos se guardan automáticamente en el navegador
- ✅ **Tema oscuro** automático según preferencias del sistema
- ✅ **Sin backend necesario** - funciona completamente en el cliente

## 🚀 Instalación

### Requisitos previos

- Node.js 18.x o superior
- npm

### Pasos

1. Clona el repositorio:
```bash
git clone https://github.com/ikerbenitezdev/FibLinks.git
cd FibLinks
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea una versión optimizada para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 🎯 Uso

### Añadir una asignatura

1. Haz clic en el botón **"+ Añadir Asignatura"**
2. Completa el nombre de la asignatura (obligatorio)
3. Opcionalmente, añade una descripción
4. Haz clic en **"Guardar"**

### Añadir enlaces a una asignatura

1. Haz clic en **"Ver enlaces"** en la tarjeta de la asignatura
2. Haz clic en **"+ Añadir enlace"**
3. Completa el título y la URL del enlace (obligatorios)
4. Opcionalmente, añade una descripción
5. Haz clic en **"Guardar enlace"**

### Eliminar asignaturas o enlaces

- Para eliminar una asignatura: haz clic en el botón **"✕"** en la esquina superior derecha de la tarjeta
- Para eliminar un enlace: haz clic en el botón **"✕"** junto al enlace

## 🛠️ Tecnologías

- **[Next.js 16](https://nextjs.org/)** - Framework de React para aplicaciones web
- **[React 19](https://react.dev/)** - Biblioteca de JavaScript para interfaces de usuario
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado de JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework de CSS utility-first

## 📸 Capturas de pantalla

![Dashboard inicial](https://github.com/user-attachments/assets/19acb683-3578-462c-a7c7-65166e7ccde5)

![Dashboard con asignaturas](https://github.com/user-attachments/assets/0ebbf7fb-d15c-4b0d-b091-d0c9d89fd663)

## 💾 Almacenamiento de datos

Los datos se almacenan localmente en el navegador utilizando `localStorage`. Esto significa que:
- Tus datos permanecen en tu dispositivo
- No se requiere conexión a internet después de cargar la aplicación
- Los datos persisten entre sesiones
- Si borras los datos del navegador, perderás la información guardada

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si tienes ideas para mejorar FibLinks, no dudes en abrir un issue o pull request.

## 📄 Licencia

ISC
