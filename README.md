# TP integrador — Turismo en Buenos Aires

Aplicación académica de turismo con Expo, React Native y TypeScript, orientada a funcionar en Expo Go. La demostración tendrá preferencia por iOS.

## Estado actual

El paso 2 incorpora un Stack de Expo Router con Login, Registro, Lugares, Detalles, Formulario y Brújula. El paso 3 agrega registro local real: formulario validado, guardado de cuenta y sesión, y entrada automática a Lugares al registrarse. El paso 4 agrega Login/logout, restauración de sesión y rutas protegidas. El paso 5 incorpora los 20 destinos locales en una FlatList y el paso 6 permite seleccionar un lugar y consultar sus detalles reales. El paso 7 agrega destinos propios con validación, persistencia y aislamiento por cuenta. El paso 8 permite editar destinos propios desde Detalles, con guardado persistente y validación de propiedad. El paso 9 incorpora favoritos persistentes por cuenta en Lugares y Detalles, con corazones accesibles y orden estable. El paso 10 agrega eliminación confirmada y limpieza de favoritos con recuperación de escrituras parciales. El paso 11 agrega funciones puras de rumbo geográfico y giro relativo, con validaciones y pruebas. El paso 12 incorpora permiso foreground y posición bajo demanda, precisión, cancelación y reintento. Las funcionalidades siguientes todavía no están implementadas:

- Pantalla de brújula con orientación aproximada hacia un destino.

La interfaz y este README están en español. Perfil e internacionalización quedan fuera de la primera versión.

## Instalación y ejecución

```bash
npm install
npx expo start
```

Abrir el proyecto en Expo Go compatible con el SDK instalado. TypeScript, lint, Expo Doctor y la compilación del bundle iOS se verificaron el 11 de octubre de 2026. También se verificó visualmente Home → Explore → Home en Expo Go 57.0.9 del simulador iOS 27. La ejecución en el iPhone 14 Pro físico sigue pendiente; ver resultados en STEPBYSTEP.md.

Validaciones del proyecto:

```bash
npx tsc --noEmit
npm run lint
```

## Estructura actual y documentación

- `src/app/`: rutas y Stack del TP (`_layout.tsx`); Login corresponde a `index.tsx`.
- `src/components/`, `src/hooks/`, `src/constants/`: componentes, hooks y estilos existentes.
- [REQUIREMENTS.md](./REQUIREMENTS.md): requisitos, decisiones y escenarios de aceptación.
- [FLOWS.md](./FLOWS.md): navegación y comportamiento de cada acción.
- [AGENTS.md](./AGENTS.md): convenciones y reglas de desarrollo.
- [STEPBYSTEP.md](./STEPBYSTEP.md): checklist detallado por incremento y resultados de verificación.
- [PLACES.md](./PLACES.md): los 20 lugares seleccionados, coordenadas y fuentes.

La estructura se actualizará a medida que se implementen las features, sin crear carpetas vacías.

## Dependencias y decisiones

El proyecto ya incluye Expo, React Native, TypeScript y Expo Router; este último permite conservar la navegación basada en rutas. Se añadieron `@react-native-async-storage/async-storage` 2.2.0 para cuentas/sesión local y `expo-crypto` ~57.0.4 para UUID, salt aleatorio y verificador SHA-256. Se instalaron con `npx expo install`. Ambas están incluidas en Expo Go según la documentación oficial de [AsyncStorage](https://docs.expo.dev/versions/latest/sdk/async-storage/) y [Crypto](https://docs.expo.dev/versions/latest/sdk/crypto/). `expo-location` ~57.0.21 se instaló con `npx expo install expo-location` en el paso 12 para permiso foreground y posición; se usa además para heading y posición continua en el paso 13. Está incluido en Expo Go según la [documentación oficial](https://docs.expo.dev/versions/latest/sdk/location/).

No se implementarán backend, mapas en línea ni sincronización. Las cuentas y datos pertenecerán a una instalación local y no se compartirán automáticamente entre dispositivos. No se almacenan contraseñas en texto plano: se guarda un verificador SHA-256 de salt + contraseña. Es una demostración educativa, no autenticación de producción ni una función de derivación lenta para proteger contraseñas reales; usar credenciales ficticias.

## Desarrollo y demostración

Se trabajará por features pequeñas, con persistencia integrada desde cada operación mutable y revisión de cada entrega antes de avanzar. Los favoritos aparecerán primero, manteniendo el orden base dentro de cada grupo. La brújula tendrá una pantalla dedicada y solicitará permisos al iniciar la orientación.

La orientación deberá probarse en un iPhone físico; el simulador no reemplaza los sensores reales. El dispositivo confirmado es un iPhone 14 Pro; la prueba física de sensores se realizará en el paso 13. Se ignoran las fechas de 2025 de la consigna; no hay un cronograma vigente fijado en este README.

## Uso de inteligencia artificial

Se utilizó Codex para elaborar y revisar la especificación, alinear los flujos y recopilar el catálogo con fuentes enlazadas. También se utilizó para implementar y verificar la navegación mínima del paso 2 y el registro local y sus pruebas del paso 3, además de Login/logout, restauración, protección de rutas y auditoría del paso 4, el catálogo, selector por usuario y verificación del paso 5, y Detalles con resolución autorizada de IDs, navegación y auditoría del paso 6, y creación de destinos, recuperación de errores, pruebas y auditoría del paso 7, además de edición y auditoría del paso 8 y favoritos, pruebas y auditoría del paso 9, además de eliminación recuperable, pruebas y auditoría del paso 10 y cálculo de orientación, pruebas y auditoría del paso 11, además de ubicación bajo demanda, pruebas y auditoría del paso 12. El usuario revisa las decisiones y los incrementos. Esta sección se actualizará para reflejar la asistencia utilizada durante la implementación.

## Probar el paso 2

Ejecutar `npx expo start --go` y abrir Expo Go. Desde Login, recorrer Registro y volver. Ingresar con una cuenta ficticia para acceder a Lugares; desde el paso 6, seleccionar una fila abre sus detalles reales. Agregar destino abre el formulario funcional del paso 7; los sensores siguen pendientes de sus incrementos.

`src/components/navigation-screen.tsx` comparte el contenedor adaptable y los botones. El ID temporal `navigation-preview` del paso 2 fue retirado en el paso 6: las rutas resuelven únicamente entidades visibles para la cuenta activa.

## Registro local — paso 3

En Registro, completar nombre, correo, contraseña de al menos 8 caracteres y confirmación. Ejemplo ficticio: `Demo`, `demo@example.test`, `demo12345`. Crear cuenta guarda primero el usuario, luego la sesión y abre Lugares. Se recortan nombre/correo y se normaliza el correo; la contraseña se conserva exactamente para calcular el verificador. Correo duplicado, campos vacíos, correo inválido, contraseña corta o confirmación distinta muestran errores y conservan los campos.

La operación bloquea envíos repetidos y muestra «Guardando…». Si la cuenta se guardó pero falla la sesión, aparece un aviso específico y «Reintentar inicio de sesión»: se reusa la cuenta y se verifica la contraseña antes de reintentar únicamente la sesión. Si una escritura rechaza después de guardar, el reintento reconoce el ID pendiente y evita duplicarlo. Si no se pudo confirmar el guardado, no se anuncia éxito. Los JSON inválidos/errores de lectura bloquean la navegación con aviso y reintento, sin resetear ni sobrescribir datos.

El ID de recuperación permanece en memoria durante esta ejecución. Si se cierra Expo Go tras un guardado parcial, la cuenta sigue guardada y se rechaza crearla otra vez; se puede ingresar mediante Login. Desde el paso 4, una sesión válida se restaura al reiniciar y permite acceder a Lugares.

Archivos para explicar el registro:

- `src/app/signup.tsx`: campos, errores, loading, teclado y navegación tras éxito.
- `src/features/auth/validation.ts`: validaciones y normalización.
- `src/features/auth/password.ts`: salt y verificador educativos con Expo Crypto.
- `src/features/auth/registration.ts`: registro y recuperación de escrituras parciales, sin lógica de UI.
- `src/storage/auth-storage.ts`: claves `tourism.users.v1` / `tourism.session.v1`, validación de JSON y persistencia.
- `src/context/auth-context.tsx`: estado compartido y acción `signUp`.
- `tests/auth.test.ts`: pruebas de validación, duplicados, errores/reintentos y conservación de datos. Ejecutar `npm run test:auth`. Los fallos de almacenamiento se provocan en un adaptador controlado; no se modifican los datos reales del simulador para estas pruebas.

Se verificó en Expo Go 57.0.9 del iPhone 17e simulado con iOS 27.0: registro exitoso, campos vacíos, contraseñas ocultas, desplazamiento con teclado, regreso a Login y rechazo de duplicado tras reiniciar. Se inspeccionó el almacenamiento real de la cuenta ficticia para confirmar ausencia de contraseña en texto plano. La prueba física sigue pendiente.

## Login, logout y sesión — paso 4

Login requiere correo/contraseña, normaliza el correo y compara el hash con el salt/verificador guardado. El error de credenciales es genérico y conserva los campos. Se guarda la sesión antes de abrir Lugares. «Cerrar sesión» está en el encabezado: elimina únicamente `tourism.session.v1` antes de volver a Login. Ambos botones bloquean envíos repetidos y permiten reintentar si falla el almacenamiento.

Al arrancar se muestra loading mientras se validan cuentas/sesión. Una sesión válida abre Lugares; ausente o huérfana abre Login. La sesión huérfana se ignora sin borrar el registro almacenado. JSON inválido o error de lectura muestra aviso y «Reintentar lectura» sin sobrescribir datos. `Stack.Protected` restringe Lugares, Detalles, Formulario y Brújula y elimina su historial al cerrar sesión.

Para defender el cambio: `src/features/auth/session.ts` contiene verificación, persistencia y restauración; `src/context/auth-context.tsx` aplica el estado solo tras éxito y serializa operaciones; `src/app/_layout.tsx` controla loading/error y protección; `src/app/index.tsx` contiene el formulario; `src/app/places.tsx` contiene logout. Storage añade `removeItem` únicamente para la clave de sesión. No se añadieron dependencias.

Para probar: entrar con una cuenta ficticia, reiniciar Expo Go y comprobar Lugares; cerrar sesión y comprobar Login sin regreso privado por Atrás; volver a ingresar y verificar que la cuenta sigue disponible. Las pruebas `npm run test:auth` cubren fallos de lectura/escritura/borrado antes y después de commit, sesión huérfana y JSON inválido mediante almacenamiento controlado. Los resultados manuales y límites se registran en STEPBYSTEP.md; la ejecución física sigue pendiente.

## Catálogo local — paso 5

Ingresar o registrarse con una cuenta ficticia: Lugares muestra 20 destinos en el orden de PLACES.md. Desplazar hasta Puente de la Mujer. Las filas muestran nombre y origen; el espacio lateral queda reservado para favoritos. Desde el paso 6, tocar el nombre/origen abre Detalles; el espacio lateral sigue reservado para favoritos. Se retiraron los enlaces temporales de prueba de Lugares.

Para defender el código: `src/types/destination.ts` distingue seed/custom por prefijo y exige propietario para custom; `src/data/defaultDestinations.ts` contiene los 20 datos y descripciones en español; `src/features/destinations/selectors.ts` filtra por propietario y conserva orden; `src/app/places.tsx` usa FlatList y keyExtractor por ID, Flexbox y áreas seguras. Las constantes son de solo lectura y están congeladas; no se guardan en AsyncStorage ni consultan una API. La lista custom está vacía hasta implementar estado/persistencia y creación en el paso 7; el selector ya acepta custom en orden de creación y excluye los ajenos.

Ejecutar `npm run test:catalog` para contrastar exactamente IDs, nombres, coordenadas y orden con PLACES, verificar rangos/inmutabilidad y comprobar aislamiento A/B/anónimo. TypeScript, lint, estas comprobaciones y las 18 pruebas de autenticación pasaron. El catálogo y scroll se inspeccionaron en Expo Go de los simuladores iPhone 17e e iPhone 18 Pro, iOS 27.0. No se acredita prueba física ni modo avión: la independencia de API se verificó revisando las dependencias del catálogo y ejecutando sus módulos locales en Node. Metro existente se conservó.

## Detalles — paso 6

En Lugares, tocar una fila abre Detalles con nombre, descripción, latitud, longitud y origen. Los destinos predefinidos indican «Solo lectura». Editar aparece únicamente para destinos propios; favoritos y eliminar están disponibles para los destinos propios. El enlace a Brújula lleva el ID real y muestra el nombre seleccionado; pide permiso foreground únicamente al tocar Iniciar orientación. Desde el paso 13 integra heading y flecha aproximada; la prueba física sigue pendiente.

«Volver a Lugares» usa `dismissTo`: regresa a la lista existente o reemplaza la ruta si se abrió directamente, evitando duplicar Lugares en el historial. El Atrás del Stack también funciona. Un ID inválido, inexistente, múltiple o ajeno muestra el mismo aviso, sin revelar datos privados, y ofrece un retorno seguro.

Para defender el código: `src/app/places.tsx` pasa solo el ID con un Link tipado; `src/app/destination/[id].tsx` lee el parámetro y muestra la entidad sin copiarla a un estado de pantalla; `src/features/destinations/use-destinations.ts` comparte la lectura de la colección y del usuario activo entre lista, Detalles y Brújula; `selectors.ts` resuelve únicamente dentro del catálogo visible. La colección custom común sigue vacía hasta el paso 7: no se agregó persistencia anticipada ni se escribieron seeds en AsyncStorage.

Ejecutar `npm run test:catalog` para verificar resolución de seeds/custom propios y rechazo de IDs inválidos, desconocidos, ajenos y anónimos. Los custom de esa prueba son fixtures controlados; desde el paso 7 también se verificó un destino propio real en la interfaz. En Expo Go del iPhone 18 Pro simulado con iOS 27.0 se probó Obelisco → Brújula → Atrás → Detalles → Volver a Lugares, Torre Monumental → Atrás y el enlace directo `exp://127.0.0.1:8081/--/destination/seed-99` → aviso → Lugares. Se inspeccionaron visualmente el nombre largo, coordenadas y aviso. La prueba física continúa pendiente en sus pasos correspondientes; el paso 7 se documenta a continuación.


## Crear destino propio — paso 7

En Lugares, elegir **Agregar destino**. Completar nombre, descripción, latitud y longitud; se acepta punto o coma decimal, signo menos y 0, con latitud −90..90 y longitud −180..180. No se acepta notación exponencial, separadores de miles ni texto parcial. Guardar vuelve a Lugares y agrega el destino después del catálogo; Cancelar/Atrás descarta el formulario sin escribir. Los campos tienen etiquetas accesibles; el formulario se desplaza y evita el teclado. En iOS se usa teclado completo para poder escribir coordenadas negativas.

El contexto existente mantiene la colección única y la acción `createDestination`; asigna el propietario desde la sesión y bloquea operaciones simultáneas. `src/features/destinations/creation.ts` contiene validación, lectura de JSON desconocido y servicio de creación. `src/features/destinations/use-destinations.ts` conecta esa colección con los selectores de lista/Detalles. `src/app/destination/form.tsx` controla campos, errores y pending; `src/app/places.tsx` ofrece el acceso al formulario.

Se escribe únicamente `tourism.destinations.v1`, con destinos custom y orden de creación. Los seeds siguen en código. El arranque valida destinos antes de habilitar navegación; datos inválidos/error de lectura muestran aviso y reintento sin borrarlos. El estado confirmado cambia solo después de guardar. Si una escritura rechaza después de commit, se informa error y el reintento de la misma instancia del formulario reutiliza el ID, aplicando los campos actuales sin duplicar; una nueva instancia tiene un intento independiente. Si se reinicia tras un error, se restaura lo que efectivamente quedó persistido. No se necesita recuperación multi-clave para el alta.

Ejecutar `npm run test:destinations`, además de TypeScript, lint, `test:auth` y `test:catalog`. Para probar manualmente: crear un destino ficticio, consultar sus detalles, reiniciar Expo Go, cancelar otra alta y cambiar a otra cuenta local. La cuenta B debe ver solo sus destinos y los 20 seeds. La prueba del paso 7 se ejecutó en Expo Go del iPhone 18 Pro simulado con iOS 27.0; reinicio, detalles, campos vacíos, cancelación y cambio a B verificados. Los fallos de almacenamiento se comprobaron con adaptador controlado, sin provocar fallos reales de AsyncStorage. Prueba física pendiente según pasos 1/13.


## Editar destino propio — paso 8

En Detalles de un destino propio, tocar **Editar destino**. El formulario compartido precarga nombre, descripción, latitud y longitud. Guardar valida los mismos campos del alta y vuelve a Detalles solo después de persistir; Lugares refleja los cambios. Cancelar vuelve sin guardar. Los destinos predefinidos y los de otra cuenta no admiten edición, incluso con un ID enviado directamente al formulario o al servicio.

Para defenderlo: `selectors.ts` resuelve un custom autorizado; `destination/form.tsx` inicializa una copia de los campos para edición; `auth-context.tsx` toma el usuario de la sesión; `features/destinations/update.ts` relee y valida el almacenamiento, verifica propiedad y sustituye en el mismo índice conservando ID/ownerId/source. La única escritura usa `tourism.destinations.v1`. El contexto publica el resultado únicamente tras guardado exitoso. Ante fallo, mantiene el estado confirmado y el formulario conserva los valores para reintentar. Un fallo después de commit puede haber guardado datos: el reintento reemplaza el mismo ID y el reinicio lee lo realmente persistido, sin duplicar ni mover entidades.

Validación ejecutada: TypeScript, lint, pruebas de destinos/catálogo/auth y diff sin errores. En Expo Go del iPhone 18 Pro / iOS 27.0 simulado se comprobó precarga, nombre vacío, cancelación, guardado, actualización de ambas pantallas y restauración tras **Reload** (reinicio de ejecución JavaScript e hidratación; no cierre del proceso). Se restauró el nombre original del destino usado para probar. Permisos de rutas y fallos de lectura/escritura se verificaron con parámetros y almacenamiento controlados usando las funciones reales; no se provocaron fallos físicos de AsyncStorage. El iPhone físico sigue pendiente en sus pasos previstos.

## Probar y defender el paso 9

En Lugares, tocar el corazón de Floralis y luego el de Teatro Colón: ambos quedan llenos rojos y Teatro aparece primero por su posición en el catálogo. El corazón no abre Detalles. Abrir Detalles y quitar un favorito; volver y comprobar su posición entre los no favoritos. Marcar un destino propio, editar su nombre y verificar ambos lugares. Recargar Expo Go para comprobar persistencia; cambiar de cuenta y regresar para verificar aislamiento.

`src/components/favorite-button.tsx` comparte el botón y feedback; `src/context/auth-context.tsx` concentra estado y acción `toggleFavorite`. `src/features/favorites/favorites.ts` valida pares y referencias, persiste en `tourism.favorites.v1` y agrupa sin cambiar el orden base. `use-destinations.ts` aplica el orden a FlatList. El guardado usa el estado final solicitado, así un reintento tras un error posterior a la escritura no invierte accidentalmente el favorito. El estado confirmado cambia únicamente después de una escritura exitosa. Datos inválidos bloquean carga con aviso y reintento, sin reset.

Ejecutar `npm run test:favorites`; junto con las suites existentes verifica aislamiento, orden, errores y recuperación con almacenamiento controlado. La auditoría manual se hizo en Expo Go del simulador; no se acredita prueba física ni fallo real de AsyncStorage. No se incorporaron dependencias. Eliminación y brújula siguen pendientes en sus pasos.


## Eliminación de destinos propios — paso 10

Desde Detalles de un destino propio, «Eliminar destino» muestra confirmación con Cancelar/Eliminar. Cancelar conserva destino y favorito. Confirmar persiste la baja y la limpieza de sus favoritos antes de volver a Lugares; un indicador y un bloqueo evitan operaciones repetidas. Los seeds y destinos ajenos se rechazan también en el servicio.

`src/features/destinations/deletion.ts` guarda primero un registro pendiente en `tourism.deletion.v1` con el resultado validado de ambas colecciones. Luego escribe favoritos, destinos y retira el registro. No es una transacción atómica de AsyncStorage: si falla una parte, el contexto conserva el estado confirmado y muestra un aviso que bloquea nuevas operaciones. «Reintentar lectura» o reiniciar completa la baja pendiente antes de habilitar navegación. Si la escritura del registro no llegó a guardarse, la lectura conserva el destino y permite repetir la baja. JSON inválido bloquea recuperación sin sobrescribirlo. Una promesa rechazada nunca anuncia éxito, incluso si la escritura sí llegó al dispositivo.

Para defender el código: Detalles → confirmación → `deleteDestination` del contexto (sesión y bloqueo común) → servicio (propiedad y registro pendiente) → persistencia → estado compartido → Lugares. La hidratación llama `recoverDeletion` antes de validar favoritos. Ambos selectores resuelven siempre las colecciones confirmadas, sin copiar la entidad en la pantalla.

Validar con `npm run test:deletion`: favorito/no favorito, permisos, datos inválidos, concurrencia y fallos antes/después de cada escritura y de la limpieza, con recuperación por lectura. La prueba manual en Expo Go del simulador incluyó cancelar una baja, crear y borrar dos destinos ficticios autorizados y recargar. Los fallos de almacenamiento se probaron con un adaptador controlado; no se provocaron fallos físicos de AsyncStorage. Reload reinicia JavaScript e hidrata los datos, no termina el proceso del sistema. El iPhone 14 Pro físico y los sensores siguen pendientes del paso 13.


## Cálculo de orientación — paso 11

`src/features/compass/orientation.ts` contiene funciones puras, independientes de pantallas y sensores. `calculateBearing` recibe coordenadas en grados y precisión de posición opcional en metros; calcula distancia y rumbo inicial sobre una esfera, de 0° a menos de 360° respecto del norte verdadero. Devuelve `null` cuando el destino está dentro de max(1 metro, precisión) o es antípoda sin dirección única. Rechaza coordenadas fuera de rango y valores no finitos.

`calculateRelativeAngle` resta el heading verdadero del rumbo y normaliza a [-180°,180°): 0 apunta adelante, positivo gira a la derecha y negativo a la izquierda; -180 apunta atrás. El heading debe estar en [0°,360°), con disponibilidad/calidad previamente verificadas por la futura capa de sensores. No se debe usar heading magnético directamente con rumbo verdadero. `normalizeDegrees` acepta rotaciones negativas/equivalentes y rechaza valores no finitos.

Para probar, ejecutar `npm run test:orientation`: cardinales, caso esférico analítico, cruce del antimeridiano, cercanía/precisión, antípodas, validaciones, cruce 359°/0° y 576 combinaciones de giro. TypeScript, lint y todas las suites existentes pasaron. Se inspeccionaron también resultados directos en Node; no hubo prueba de sensores ni cambios de pantalla. Para defenderlo, explicar coordenadas → distancia/umbral → rumbo respecto del norte verdadero → resta de heading → giro firmado. Ubicación y flecha se conectarán en los pasos 12/13; el cálculo es aproximado.


## Ubicación bajo demanda — paso 12

Detalles → **Abrir Brújula** muestra el destino autorizado y **Iniciar orientación** sin consultar ubicación ni pedir permiso. Al iniciar se consulta el permiso foreground; si hace falta y se permite volver a preguntar, se solicita. Luego se verifica Localización y se obtiene una posición de alta precisión solicitada (no garantizada). Se validan latitud, longitud y precisión finita/no negativa antes de mostrar los datos. La posición permanece en memoria de pantalla, sin AsyncStorage ni servidor.

Se muestran «Solicitando permiso…»/«Obteniendo ubicación…», errores con reintento e instrucciones de Ajustes para permiso bloqueado o servicios apagados. La espera de servicios/posición tiene límite de 20 segundos. **Cancelar**, **Detener orientación**, volver o perder el foco invalidan el intento y limpian su timer. Las promesas nativas de una consulta puntual no permiten abortar físicamente el trabajo ni cerrar el diálogo del sistema: se ignoran sus respuestas tardías, incluso después de otro inicio. No hay listeners ni permiso background. Heading y flecha siguen en paso 13.

Para defenderlo: `src/app/compass/[id].tsx` resuelve el destino, conecta las APIs foreground de Expo Location y limpia al perder foco con `useFocusEffect`; `src/features/compass/location.ts` contiene estados, validación, timeout y token de intento; `scripts/test-location.cjs` usa ese controlador real con un adaptador controlado. Ejecutar `npm run test:location`, TypeScript y lint. `app.json` incluye explicación española del permiso para una aplicación compilada; **Expo Go usa su propio diálogo nativo**, observado en inglés en el simulador, que el proyecto no puede reemplazar. La explicación previa y los errores de la app están en español.

Prueba manual del paso 12: Expo Go en iPhone 18 Pro/iOS 27.0 simulado, abrir Obelisco → Brújula sin prompt, iniciar → rechazar permiso, comprobar instrucciones de Ajustes, reintentar y volver a Detalles. El permiso de Expo Go quedó denegado en ese simulador. El camino exitoso/Detener se inspeccionó ejecutando el controlador real en Node con coordenadas ficticias; no se acredita posición exitosa en la interfaz ni GPS real. Tests cubren éxito, rechazo recuperable/bloqueado, servicios apagados, precisión inválida, errores, timeout/reintento y salida/cancelación durante cada espera. La prueba GPS y sensores del iPhone 14 Pro sigue en paso 13.

`npx expo install --check` encontró actualizaciones patch pendientes de dependencias existentes (@expo/ui, expo, expo-router, expo-splash-screen); no señaló incompatibilidad de expo-location. Se conservaron sus versiones para limitar este incremento. Configuración pública, tipos, lint y todas las suites pasaron; ver auditoría en STEPBYSTEP.md.


## Brújula y flecha — paso 13

Detalles → Abrir Brújula → **Iniciar orientación**. Tras permiso foreground y posición validada, se suscribe al rumbo y a actualizaciones de ubicación. Sostener el teléfono plano, con su parte superior hacia adelante: la flecha gira según bearing al destino menos rumbo del teléfono. Solo se acepta norte verdadero y calidad media/alta (`accuracy` 2/3 según Expo); no se mezcla norte magnético con bearing geográfico. La precisión GPS determina el margen de cercanía: dentro de max(1 m, precisión) no se dibuja una dirección. Una posición inicial válida puede seguir usándose hasta la próxima actualización; no implica GPS continuo con precisión garantizada.

Si el heading no es válido o tiene baja calidad, se oculta la flecha y se explica cómo calibrar/alejar imanes. Una lectura posterior válida recupera la orientación. Si no llegan eventos durante 20 segundos o falla una API, se detiene y permite reintentar. **Detener**, salir, cambiar de destino, desmontar o pasar a background retira listeners y limpia datos/timer. Un handle que llega después de salir se elimina de inmediato; callbacks antiguos no pueden modificar el nuevo intento. Volver del background exige Iniciar otra vez. El estado iOS inactive del diálogo de permiso no cancela la solicitud. No hay permiso background ni almacenamiento de ubicación.

`src/features/compass/heading.ts` administra calidad/ciclo de vida y reutiliza el controlador location del paso 12. `src/app/compass/[id].tsx` conecta las APIs y dibuja flecha accesible (destino, grados y sentido de giro). `orientation.ts` conserva el cálculo puro. `npm run test:heading` prueba sensores ficticios con las funciones reales: calidad, giros, cercanía, actualización GPS, errores, timeout, stop repetido y carreras de handles/callbacks. Tipos, lint y todas las suites pasaron. Expo Go en el simulador permitió verificar pantalla inicial, permiso bloqueado, retry y vuelta a Detalles; **no acredita flecha/GPS/heading físicos**.

**Prueba física omitida por indicación del usuario:** iPhone 14 Pro no disponible durante esta entrega. STEPBYSTEP marca 13 checks con evidencia e identifica 5 físicos pendientes. Registrar iOS/Expo Go reales y comprobar SDK 57 antes de acreditar esos checks. El simulador puede carecer de heading o suministrar posiciones simuladas; no reemplaza al iPhone. Interiores, metal, fundas magnéticas e imanes pueden alterar el rumbo: probar en espacio abierto. Es orientación aproximada, sin navegación vial, UWB ni precisión centimétrica.

Cuando esté disponible el teléfono:

1. Registrar iOS y Expo Go; ejecutar `npx expo start` y abrir el proyecto con QR en Expo Go, usando la misma red que el Mac.
2. Ingresar con cuenta ficticia, abrir un destino conocido y Brújula. Abrir la ruta no debe pedir permiso. Iniciar y otorgar ubicación mientras se usa; observar posición y precisión.
3. En entorno abierto, sostener plano y girar el teléfono en varias direcciones; contrastar la flecha con la ubicación conocida del destino. Comprobar mensaje de cercanía usando un destino propio con coordenadas próximas.
4. Detener/iniciar varias veces, volver a Detalles, abrir otro destino y salir durante carga: verificar estado inicial y ausencia de actualizaciones tardías. Pasar a background y regresar: queda detenido.
5. Rechazar permiso y comprobar explicación, retry y retorno a otras pantallas; restituirlo desde Ajustes cuando se necesite. Anotar resultados reales de GPS/heading; los fallos de sensores también tienen cobertura controlada identificada en tests.

La asistencia de IA en este incremento incluyó implementación del controlador/screen, pruebas de ciclo de vida y calidad, auditoría y documentación; la verificación física requiere al usuario.
