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
|---|---|---|
| Administrador | admin@helpdesk.dev | Admin123! |
| Agente | agent1@helpdesk.dev | Agent123! |
| Cliente | client1@helpdesk.dev | Client123! |

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

## Respuestas a las preguntas de sustentación

**¿Por qué existen dos tokens?**
El `accessToken` es de corta duración y viaja en cada petición; limita el
daño si se filtra. El `refreshToken` vive más tiempo y solo se usa contra
`/auth/refresh` para obtener un `accessToken` nuevo sin pedir credenciales
de nuevo. Separar ambos reduce la ventana de exposición del token que
realmente autoriza operaciones.

**¿Dónde se almacenan y por qué?**
Ambos en `localStorage` (ver `AuthService`), para sobrevivir a recargas de
página. Es una decisión pragmática para este ejercicio; en producción se
evaluaría mover el `refreshToken` a una cookie `httpOnly` para mitigar XSS.

**¿Cómo determina el guard si existe una sesión válida?**
`AuthGuard` verifica que exista un `accessToken` en almacenamiento y un
`currentUser` cargado en memoria (`AuthService`). No valida la firma del
JWT en el cliente; la validez real la confirma el backend en cada llamada.

**¿Qué ocurre cuando varias peticiones reciben 401 simultáneamente?**
`TokenRefreshInterceptor` usa un `BehaviorSubject<string|null>` como
semáforo: la primera petición que recibe `401 TOKEN_EXPIRED` dispara el
refresh y pone `isRefreshing = true`; las siguientes se "congelan"
escuchando ese subject (`filter` + `take(1)`) y se reintentan automáticamente
con el token nuevo en cuanto está disponible, sin disparar refrescos
duplicados.

**¿Diferencia entre 401 y 403?**
`401 Unauthorized`: no hay sesión válida (falta token o expiró) →
se intenta renovar o se redirige a login. `403 Forbidden`: hay sesión
válida, pero el usuario no tiene permiso para esa acción/recurso → se
muestra el error, no se reintenta ni se pide login de nuevo.

**¿Cómo restringir funcionalidades según el rol sin depender solo de la UI?**
La UI (guards, `*ngIf`, `SharedModule`) solo mejora la experiencia
ocultando lo que el rol no debería ver, pero la autorización real siempre
la aplica el backend en cada endpoint. Nunca se confía en que el cliente
"no mostró el botón" como medida de seguridad.

## Notas

- Los datos del backend se reinician al reiniciar el servidor: no se
  hardcodean IDs en ningún lado, todo se obtiene de la API.
- Los errores del backend siguen `{ error: { code, message } }`; se leen
  así en los `catchError`/`error:` de cada suscripción.
