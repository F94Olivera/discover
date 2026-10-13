# Turismo en Buenos Aires — TP integrador

Aplicación académica con Expo, React Native y TypeScript para Expo Go. Incluye registro/login locales, sesión persistente, 20 destinos de CABA, Detalles, alta/edición/baja de destinos propios, favoritos por cuenta y una Brújula con orientación aproximada. La interfaz está en español y usa Stack de Expo Router y FlatList.

## Estado y evidencia

Las funciones de los pasos 1–13 están implementadas. El usuario confirmó las pruebas físicas del paso 13 en **iPhone 14 Pro, iOS 26.7.1, Expo Go 57.0.9, SDK 57.0.0**. Esa evidencia es su reporte, no una observación directa del agente. El proyecto usa SDK 57; la revisión final alineó cuatro parches recomendados por Expo, sin cambiar de SDK.

El paso 14 prepara documentación y defensa, ejecuta las ocho suites y audita los requisitos. La [matriz de aceptación](./ACEPTACION.md) distingue pruebas finales, evidencia histórica del simulador, reporte físico y pendientes. **No se acredita un recorrido manual final completo de los 16 escenarios**: Device Hub dejó de aceptar acciones durante el ensayo final. Tampoco se acredita VoiceOver real ni fallos físicos de AsyncStorage. Consultar [STEPBYSTEP.md](./STEPBYSTEP.md) para comandos y resultados.

## Instalación y arranque

Requisitos: Node.js y npm, Expo Go compatible con SDK 57 y Mac/teléfono en la misma red. El entorno verificado usa Node 26.3.0 y npm 11.16.0.

```bash
npm ci
npx expo start
```

`npm ci` instala exactamente el lockfile; no borra los datos de Expo Go. Escanear el QR con Cámara del iPhone y abrir en Expo Go. Para simulador iOS disponible, pulsar `i` en la terminal. Detener Metro con Ctrl+C. Si aparece un error de resolución tras cambiar dependencias, detener Metro y ejecutar `npx expo start --go --clear`; conservar AsyncStorage, sin reinstalar Expo Go ni borrar sus datos.

El bundle debe cargarse antes de probar sin conexión. Catálogo, autenticación, CRUD y favoritos no consultan ninguna API. La orientación depende del permiso, GPS y heading del dispositivo; no requiere mapas ni servidor. El servidor de desarrollo Metro sí es necesario para cargar el proyecto.

```bash
npx tsc --noEmit
npm run lint
npx expo install --check
npx expo-doctor
npm run test:auth
npm run test:catalog
npm run test:destinations
npm run test:favorites
npm run test:deletion
npm run test:orientation
npm run test:location
npm run test:heading
```

Las suites ejecutan funciones reales con almacenamiento/sensores controlados en Node; no son pruebas de pantalla ni de hardware. `test:catalog` contrasta los 20 seeds con PLACES. Para instalar dependencias Expo, usar `npx expo install`.

## Estructura y archivos para la defensa

| Responsabilidad | Archivos |
| --- | --- |
| Stack, protección, carga/error/reintento inicial | `src/app/_layout.tsx` |
| Login y registro | `src/app/index.tsx`, `src/app/signup.tsx` |
| FlatList, orden, logout | `src/app/places.tsx` |
| Detalles, confirmación de baja y formulario compartido | `src/app/destination/[id].tsx`, `src/app/destination/form.tsx` |
| Estado confirmado y acciones | `src/context/auth-context.tsx` |
| Validación, hash educativo, registro y sesión | `src/features/auth/` |
| Validación/alta, edición, baja y selectores por propietario | `src/features/destinations/` |
| Persistencia/validación de favoritos y orden estable | `src/features/favorites/favorites.ts` |
| Validación de usuarios/sesión y adaptador AsyncStorage | `src/storage/auth-storage.ts` |
| Constantes y tipos discriminados seed/custom | `src/data/defaultDestinations.ts`, `src/types/` |
| Permiso/posición, calidad/cleanup, bearing/ángulo | `src/features/compass/location.ts`, `heading.ts`, `orientation.ts` |
| Integración nativa y flecha | `src/app/compass/[id].tsx` |
| Contenedor adaptable, botones y corazón accesible | `src/components/navigation-screen.tsx`, `favorite-button.tsx` |
| Suites | `tests/auth.test.ts`, `scripts/test-*.cjs` |

La estructura existente se conserva; componentes de la plantilla que no usa el TP no se presentan como funciones del proyecto. [REQUIREMENTS](./REQUIREMENTS.md), [FLOWS](./FLOWS.md), [AGENTS](./AGENTS.md) y [PLACES](./PLACES.md) definen alcance, flujo, convenciones y catálogo con fuentes.

## Dependencias y justificación

| Dependencia usada | Motivo |
| --- | --- |
| Expo ~57.0.28, React 19.2.3, React Native 0.86.3, TypeScript ~6.0.3 | Entorno Expo Go, componentes funcionales, hooks y tipos |
| Expo Router ~57.0.26 | Stack real, rutas tipadas, parámetros y protección por sesión |
| AsyncStorage 2.2.0 | Persistencia local de cuentas, sesión, destinos y favoritos |
| Expo Crypto ~57.0.4 | UUID, salt aleatorio y verificador SHA-256 educativo |
| Expo Location ~57.0.21 | Permiso foreground, posición/precisión, heading y observers |
| react-native-safe-area-context ~5.7.0 | Respetar áreas seguras del teléfono |
| expo-status-bar ~57.0.1 | Barra de estado legible |
| expo-splash-screen ~57.0.10 | Configuración de arranque heredada en app.json |
| eslint ^9 y eslint-config-expo ~57.0.2 | Validación estática del proyecto |

Router y Expo incluyen dependencias de infraestructura como constants, linking y screens. El resto de dependencias de la plantilla (@expo/ui, device, font, glass-effect, image, symbols, system-ui, web-browser, gesture-handler, reanimated, worklets y paquetes web) se conservó; varias solo aparecen en componentes heredados fuera de las rutas del TP. No se añadió una biblioteca de mapas ni arquitectura adicional. Los cuatro parches finales fueron @expo/ui, expo, expo-router y expo-splash-screen, instalados con `npx expo install --fix`. Las versiones exactas están en package-lock.json.

## Datos locales y recuperación

Cada cuenta existe solo en esta instalación; no se sincroniza con otro teléfono. Cerrar sesión borra únicamente la sesión. No usar credenciales reales: el salt y SHA-256 evitan texto plano, pero son una **demostración educativa**, sin derivación lenta ni seguridad de producción.

Claves: `tourism.users.v1`, `tourism.session.v1`, `tourism.destinations.v1`, `tourism.favorites.v1` y `tourism.deletion.v1` (registro de recuperación). Los seeds son constantes; nunca se insertan en storage. Custom exige ownerId e ID `custom-`; los selectores y acciones de dominio comprueban propiedad. Favoritos solo apuntan a destinos visibles para esa cuenta.

El contexto publica cambios después del éxito de persistencia. Una escritura rechazada puede haber guardado datos: no se afirma éxito; reintento/restauración consultan el estado real. Registro parcial conserva la cuenta y permite reintentar sesión sin duplicar; tras reinicio se ingresa por Login. La baja registra primero el resultado previsto, guarda favoritos/destinos y retira el registro; una falla bloquea mutaciones hasta recuperar por lectura. JSON inválido/error de lectura muestra aviso y reintento, sin reset silencioso. Sesión huérfana vuelve a Login sin sobrescribirla.

## Brújula: uso y límites

Detalles → Abrir Brújula → Iniciar orientación. Abrir la pantalla no pide permiso. Iniciar solicita ubicación mientras se usa, obtiene posición y comienza heading/posición; la explicación propia está en español. Expo Go controla el idioma del diálogo nativo.

Se acepta solo norte verdadero válido y calidad media/alta. Bearing usa coordenadas y calcula rumbo geográfico; el giro relativo resta heading y normaliza a [-180°,180°). Sostener el teléfono plano, con su parte superior hacia adelante. Cerca del destino, dentro de max(1 m, precisión GPS), se oculta la dirección. Heading inválido/baja calidad oculta la flecha y ofrece calibración; errores o 20 segundos sin eventos detienen y permiten reintentar.

Detener, salir, desmontar, cambiar destino o entrar en background retira listeners y timers. Volver exige iniciar otra vez. Tokens por intento ignoran callbacks viejos y eliminan handles tardíos. Las promesas puntuales no son físicamente abortables: se ignora su resultado después de cancelar. No se pide background ni se persiste ubicación.

El iPhone físico fue probado según reporte del usuario; el simulador puede carecer de brújula o dar coordenadas simuladas. Interiores, metal, fundas magnéticas e imanes afectan el rumbo. Es orientación aproximada, sin rutas viales, UWB ni precisión centimétrica. Después de los parches finales queda pendiente repetir el recorrido completo en Expo Go del teléfono.

## Ensayo de presentación y hooks

La [guía de defensa](./DEFENSA.md) prepara cuentas ficticias, destino de prueba, recorrido y preguntas técnicas. Para pruebas físicas: anotar versiones, abrir destino conocido en espacio abierto, iniciar/otorgar permiso, rotar, comparar dirección aproximada, detener/reiniciar y salir. Rechazar permiso debe dejar las demás pantallas utilizables; restituirlo en Ajustes para reintentar.

`useState` guarda estado de pantalla y datos confirmados; el contexto comparte una única fuente de verdad. `useRef` conserva servicios y bloqueos sin rerender, y detecta montaje/intent IDs. La hidratación usa `useEffect([loadAttempt])`; cleanup impide publicar después de desmontar. Acciones usan `useCallback` con sesión/datos actuales. El formulario se inicializa al montar y su key cambia por ID, sin un efecto que sobrescriba lo escrito. Brújula conserva controlador con `useMemo([])`, gestiona AppState con efecto y limpia al blur mediante `useFocusEffect`/`useCallback([controller])`.

## Uso de inteligencia artificial

Se utilizó Codex para especificación, flujos, recopilación del catálogo con fuentes, implementación de navegación, autenticación, estado/persistencia, catálogo/CRUD/favoritos y orientación. También asistió con pruebas automatizadas, revisión de permisos/recuperación/ciclo de vida, verificaciones de simulador, auditorías por paso, documentación y preparación de defensa del paso 14. El usuario revisó incrementos y confirmó pruebas físicas. La asistencia no sustituye la comprensión del código ni acredita pruebas que no se realizaron.
