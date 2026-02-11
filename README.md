# MotoTrack

Proyecto completo para la gestión y seguimiento de motos, compuesto por Backend (Node.js/Express) y Frontend (React).

---

## Demo

Accede a la aplicación frontend desplegada aquí:  
👉 [https://moto-track-front.vercel.app](https://moto-track-front.vercel.app)

---

## Estructura del Proyecto

```
AllMotoTrack/
│
├── MotoTrackBackend/
│   └── ...código backend
│
├── MotoTrackFrontend/
│   └── ...código frontend
│
└── README.md
```

---

## MotoTrackBackend

### Descripción

API RESTful construida con Node.js y Express para gestionar usuarios, motos, rutas y reportes.

### Instalación

```sh
cd MotoTrackBackend
npm install
```

### Variables de entorno

Crea un archivo `.env` basado en `.env.example` y configura tus variables.

### Ejecución

```sh
npm run dev
```

El servidor correrá por defecto en [http://localhost:3000](http://localhost:3000).

---

## MotoTrackFrontend

### Descripción

Aplicación web construida con React para interactuar con la API de MotoTrack y ofrecer una interfaz amigable al usuario.

### Instalación

```sh
cd MotoTrackFrontend
npm install
```

### Ejecución

```sh
npm start
```

La app estará disponible en [http://localhost:5173](http://localhost:5173) (o el puerto configurado).

---

## Scripts útiles

- **Backend**
  - `npm run dev` — Inicia el servidor en modo desarrollo.
  - `npm run build` — Compila el backend para producción.

- **Frontend**
  - `npm start` — Inicia la app en modo desarrollo.
  - `npm run build` — Compila la app para producción.

---

## Contribución

1. Haz un fork del repositorio.
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`).
3. Haz tus cambios y commitea (`git commit -am 'Agrega nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

---

## Licencia

MIT
