# HelpDesk – Frontend (Angular 17)

Frontend para el sistema de gestión de incidencias de soporte técnico,
consumiendo la API ya desplegada en `https://sla-api.areasoftccyt.com/api`.

## Puesta en marcha

```bash
npm install
npm start        # ng serve --proxy-config proxy.conf.json  → http://localhost:4200
```

En desarrollo, las peticiones a `/api/*` se redirigen mediante `proxy.conf.json`
hacia el backend real, evitando problemas de CORS. En producción
(`npm run build`), `environment.prod.ts` apunta directamente a la URL pública.

## Credenciales de prueba

| Rol | Usuario | Contraseña |

## Estructura del proyecto

```
src/app/
├── core/                # Todo lo transversal, sin UI
│   ├── models/           # Interfaces: User, Ticket, Auth, paginación
│   ├── services/          # AuthService, TicketService, UserService
│   ├── interceptors/       # AuthInterceptor, TokenRefreshInterceptor
│   └── guards/             # AuthGuard, RoleGuard
├── shared/               # UI reutilizable, sin lógica de negocio
│   ├── components/         # navbar, sidebar, badges, spinner, dialog
│   └── pipes/               # relativeTime
├── layout/               # Shell (navbar + sidebar + router-outlet)
├── features/             # Módulos con lazy loading
│   ├── auth/               # login, register
│   ├── dashboard/           # resumen por rol (no lazy, es la home)
│   ├── tickets/              # list, detail, create
│   └── users/                 # solo administrador
└── app-routing.module.ts  # rutas raíz + guards + lazy loading
```

## Notas

- Los datos del backend se reinician al reiniciar el servidor: no se
  hardcodean IDs en ningún lado, todo se obtiene de la API.
- Los errores del backend siguen `{ error: { code, message } }`; se leen
  así en los `catchError`/`error:` de cada suscripción.
