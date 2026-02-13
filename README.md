# FibLinks

Dashboard web para unificar todos los enlaces de asignaturas universitarias en un solo lugar.

## 🎯 Características

- **Organización por Cuatrimestres**: Filtra tus asignaturas por cuatrimestre (Q1, Q2, Q3, Q4)
- **Enlaces Generales**: Añade enlaces importantes como aulas virtuales, materiales de clase, etc.
- **Organización por Temas**: Organiza tus recursos por temas/capítulos
- **Ejercicios y Entregas**: Separa claramente los ejercicios de las entregas para cada tema
- **Interfaz Intuitiva**: Dashboard limpio y fácil de usar construido con Next.js y Tailwind CSS
- **Responsive**: Funciona en todos los dispositivos

## 🚀 Tecnologías

- **Next.js 16**: Framework de React para aplicaciones web
- **TypeScript**: Tipado estático para mayor robustez
- **Tailwind CSS**: Framework de CSS para estilos rápidos y responsivos
- **React**: Biblioteca para interfaces de usuario

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/ikerbenitezdev/FibLinks.git
cd FibLinks
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en [http://localhost:3000](http://localhost:3000)

## 🏗️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter de código

## 📖 Uso

### Añadir una Asignatura

1. Haz clic en el botón "**+ Añadir Asignatura**"
2. Rellena el nombre, código y cuatrimestre
3. Haz clic en "**Añadir Asignatura**"

### Añadir Enlaces

1. Haz clic en el botón "**+**" en la tarjeta de la asignatura
2. Elige el tipo de enlace:
   - **General**: Enlaces generales de la asignatura (aula virtual, programa, etc.)
   - **Por Tema**: Enlaces organizados por temas con categorías de ejercicios y entregas
3. Si es por tema, puedes crear un nuevo tema o seleccionar uno existente
4. Rellena la información del enlace y haz clic en "**Añadir Enlace**"

### Filtrar por Cuatrimestre

Usa los botones en la parte superior para filtrar las asignaturas por cuatrimestre:
- **Todos**: Muestra todas las asignaturas
- **Cuatrimestre 1-4**: Muestra solo las asignaturas de ese cuatrimestre

## 🗂️ Estructura del Proyecto

```
FibLinks/
├── src/
│   ├── app/              # Páginas y layouts de Next.js
│   │   ├── layout.tsx    # Layout principal
│   │   ├── page.tsx      # Página principal del dashboard
│   │   └── globals.css   # Estilos globales
│   ├── components/       # Componentes React
│   │   ├── CourseCard.tsx       # Tarjeta de asignatura
│   │   ├── AddCourseForm.tsx    # Formulario para añadir asignaturas
│   │   └── AddLinkForm.tsx      # Formulario para añadir enlaces
│   └── types/            # Definiciones de TypeScript
│       └── index.ts      # Tipos de datos (Course, Link, Topic, etc.)
├── public/               # Archivos estáticos
├── tailwind.config.ts    # Configuración de Tailwind CSS
├── next.config.ts        # Configuración de Next.js
└── package.json          # Dependencias y scripts
```

## 🎨 Personalización

Los estilos se pueden personalizar editando:
- `tailwind.config.ts` - Configuración de Tailwind CSS
- `src/app/globals.css` - Variables CSS y estilos globales

## 📝 Notas

- Los datos se almacenan en el estado del componente. En el futuro, se puede integrar con una base de datos o almacenamiento local
- El diseño soporta modo claro y oscuro automáticamente según las preferencias del sistema

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias o mejoras.

## 📄 Licencia

ISC
