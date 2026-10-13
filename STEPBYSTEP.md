# Paso a paso — TP de turismo en Buenos Aires

## Cómo usar esta lista

Este plan contiene los pasos **0 a 14**: una preparación documental y catorce incrementos técnicos. Todos los checks comienzan sin marcar, incluso para decisiones ya documentadas. Se marcarán después de revisar la evidencia de cada entrega juntos. Un comando exitoso no acredita una prueba manual en el teléfono.

Cada incremento debe tener alcance pequeño, código explicable y una comprobación concreta. No avanzar al siguiente hasta revisar el actual. No agregar perfil, i18n, backend ni mapas. Conservar datos locales entre entregas y evitar cambios ajenos a la feature.

Documentos de referencia: [requisitos](./REQUIREMENTS.md), [flujos](./FLOWS.md), [reglas de desarrollo](./AGENTS.md), [catálogo](./PLACES.md) y [README](./README.md).

Dispositivo de demostración: **iPhone 14 Pro**. El simulador puede ayudar con interfaz/navegación, pero **la prueba física de ubicación y brújula se realizará en el paso 13**. Registrar en ese momento versiones reales de iOS y Expo Go.

## Checklist obligatorio para cada entrega de código

Repetir estas comprobaciones en cada paso que cambie código; registrar resultados en su entrega.

- [ ] Explicar el objetivo, los archivos previstos y el comportamiento que podrá probar el usuario.
- [ ] Leer las reglas aplicables y comprobar que no se contradicen los documentos.
- [ ] Implementar solo el alcance del incremento, con componentes funcionales y TypeScript.
- [ ] Mantener textos visibles en español y nombres de código en inglés.
- [ ] Incorporar loading, errores y accesibilidad donde corresponda.
- [ ] Ejecutar `npx tsc --noEmit` y registrar resultado real.
- [ ] Ejecutar `npm run lint` y registrar resultado real.
- [ ] Ejecutar pruebas adicionales solo cuando verifiquen reglas relevantes del cambio.
- [ ] Probar manualmente el camino exitoso, el error relevante y volver/cancelar cuando aplique.
- [ ] Revisar el diff y ejecutar `git diff --check`.
- [ ] Informar archivos afectados, comandos ejecutados, resultados y limitaciones pendientes.
- [ ] Explicar cómo encontrar y defender el código de la feature.
- [ ] Revisar el incremento con el usuario antes de comenzar el siguiente.

## Paso 0 — Alinear la documentación

**Resultado esperado:** una especificación coherente y un alcance claro.

- [x] Confirmar que la consigna y rúbrica ya fueron contrastadas por el usuario; no pedirlas nuevamente.
- [x] Revisar que REQUIREMENTS, FLOWS y AGENTS describen el mismo producto.
- [x] Confirmar acceso mediante Login/Registro, lista de lugares con favoritos y pantalla dedicada de brújula.
- [x] Confirmar Detalles y Formulario como pantallas auxiliares para información y CRUD.
- [x] Confirmar inicio automático de sesión después del registro exitoso.
- [x] Confirmar corazón vacío/lleno rojo y favoritos primero, con orden estable dentro de ambos grupos.
- [x] Confirmar que quitar un favorito restaura su posición relativa entre los no favoritos.
- [x] Revisar los 20 lugares de PLACES, IDs únicos, rangos de coordenadas y fuentes por lugar.
- [x] Confirmar interfaz y README en español; código y los tres documentos de especificación en inglés.
- [x] Confirmar preferencia iOS y dispositivo iPhone 14 Pro; diferir sensores físicos al paso 13.
- [x] Ignorar fechas de entrega de 2025 y no inventar reemplazos.
- [x] Mantener perfil e i18n fuera de la primera versión.
- [x] Confirmar persistencia junto con cada feature mutable y aislamiento desde el comienzo.
- [x] Revisar esta lista de pasos antes de implementar navegación.

## Paso 1 — Comprobar la plantilla y Expo Go

**Resultado esperado:** conocer si el proyecto actual compila y abre, sin implementar pantallas del TP.

- [x] Inspeccionar package.json, lockfile, app.json, tsconfig y rutas existentes.
- [x] Registrar versiones instaladas de Node, npm, Expo, React Native y TypeScript.
- [x] Comprobar dependencias instaladas sin instalar ni actualizar paquetes innecesariamente.
- [x] Ejecutar TypeScript sobre la plantilla actual y registrar errores o éxito.
- [x] Ejecutar lint sobre la plantilla actual y registrar errores, warnings o éxito.
- [x] Ejecutar `npx expo install --check` para compatibilidad de dependencias.
- [x] Ejecutar Expo Doctor si está disponible y revisar cada fallo pertinente.
- [x] Consultar documentación oficial sobre SDK actual, Expo Go iOS y expo-location.
- [x] Revisar especificaciones oficiales del iPhone 14 Pro para GPS y brújula.
- [x] Diferenciar compatibilidad teórica, compilación del bundle y ejecución real en Expo Go.
- [x] Detectar si hay Xcode, simuladores y Expo Go instalados en el Mac.
- [x] Iniciar Metro con `npx expo start` y comprobar que arranca sin errores.
- [x] Generar/cargar el bundle iOS y comprobar errores de resolución o compilación.
- [x] Abrir la plantilla en Expo Go del simulador si existe un entorno disponible.
- [x] Verificar visualmente las pantallas de ejemplo y el cambio entre pestañas si se logra abrir.
- [x] Abrir en Expo Go del iPhone mediante QR/enlace cuando el usuario esté disponible; confirmar carga y navegación básica. Confirmado por el usuario en la verificación física del paso 13.
- [x] Registrar exactamente qué entorno se probó y qué prueba quedó pendiente.
- [x] Dejar instrucciones para repetir el arranque y detener Metro cuando ya no sea necesario.
- [x] No solicitar permiso de ubicación ni activar sensores durante este paso.
- [x] Resolver o informar bloqueos de Expo Go antes de comenzar navegación; no introducir un development build.

## Paso 2 — Navegación mínima

**Resultado esperado:** rutas del TP conectadas, todavía sin autenticación real.

- [x] Preservar la base Expo Router y sustituir solo ejemplos necesarios.
- [x] Crear Stack raíz con Login y Registro.
- [x] Crear estructura de rutas para Lugares, Detalles, Formulario y Brújula.
- [x] Mantener pantallas iniciales pequeñas y textos en español.
- [x] Probar Login → Registro → volver a Login.
- [x] Comprobar títulos, botón Atrás y áreas seguras de iPhone.
- [x] Comprobar que los parámetros de destino estén tipados y sean validados antes de usarse.
- [x] No presentar rutas de prueba como autenticación funcional.
- [x] Verificar Flexbox en dos tamaños de pantalla y evitar anchos absolutos rígidos.
- [x] Completar la verificación común de entrega.

## Paso 3 — Registro local

**Resultado esperado:** cuenta válida guardada sin contraseña en texto plano.

- [x] Definir User y Session con tipos explícitos y un estado compartido mínimo.
- [x] Incorporar AsyncStorage y el mecanismo de verificación de contraseña compatibles con Expo Go.
- [x] Definir claves/versionado y validadores de datos leídos desde almacenamiento.
- [x] Definir recuperación si se guarda el usuario pero falla el guardado de sesión.
- [x] Crear campos nombre, correo, contraseña y confirmación; ocultar contraseñas visualmente.
- [x] Validar nombre no vacío, correo básico, mínimo de 8 caracteres y coincidencia.
- [x] Normalizar correo a minúsculas y recortar nombre/correo sin alterar la contraseña.
- [x] Rechazar correo duplicado aunque cambien mayúsculas o espacios exteriores.
- [x] Generar ID y salt; guardar únicamente salt y verificador, nunca contraseña/confirmación.
- [x] Mostrar errores junto a campos y conservar valores ante error.
- [x] Deshabilitar envíos repetidos durante la operación y mostrar estado de carga.
- [x] Guardar usuario/sesión antes de confirmar éxito y abrir Lugares automáticamente.
- [x] Probar registro válido y cada validación con credenciales ficticias.
- [x] Probar fallo de almacenamiento y reintento sin duplicar la cuenta.
- [x] Inspeccionar el dato almacenado para comprobar ausencia de contraseña en texto plano.
- [x] Completar la verificación común de entrega.

## Paso 4 — Login, logout y restauración de sesión

**Resultado esperado:** acceso protegido y sesión persistente.

- [x] Implementar signIn y signOut en la única fuente de verdad.
- [x] Validar correo/contraseña requeridos y mostrar error genérico por credenciales incorrectas.
- [x] Verificar contraseña contra salt/verificador local.
- [x] Guardar sesión antes de abrir Lugares.
- [x] Incorporar Cerrar sesión en el encabezado de Lugares.
- [x] Borrar solo sesión al cerrar, preservando usuarios y datos.
- [x] Mostrar loading al hidratar y validar almacenamiento antes de habilitar navegación.
- [x] Restaurar una sesión cuyo usuario existe y regresar a Login si es huérfana.
- [x] Manejar JSON inválido y errores de lectura con aviso/reintento, sin sobrescritura silenciosa.
- [x] Bloquear rutas privadas y retorno por Atrás después de cerrar sesión.
- [x] Probar inicio válido/incorrecto y fallos de guardado/borrado de sesión.
- [x] Reiniciar la app y verificar sesión válida; comprobar también sesión ausente/huérfana.
- [x] Completar la verificación común de entrega.

## Paso 5 — Catálogo en FlatList

**Resultado esperado:** los 20 lugares visibles sin consultar una API.

- [x] Definir Destination y IDs seed/custom sin colisiones.
- [x] Crear constantes con los 20 lugares de PLACES y sus coordenadas.
- [x] Añadir descripción breve en español para cada lugar, sin inventar hechos históricos.
- [x] Comprobar exactamente 20 seeds, IDs únicos y coordenadas finitas dentro de rango.
- [x] Mantener seeds en código; no insertarlos en AsyncStorage.
- [x] Implementar FlatList con keyExtractor basado en ID y filas legibles.
- [x] Mostrar nombre y origen, reservando el espacio de la futura acción de favorito.
- [x] Crear selector que incluya seeds y solo destinos propios del usuario activo.
- [x] Definir orden base de seeds y orden de creación de custom.
- [x] Verificar scroll, áreas seguras y tamaños diferentes de pantalla.
- [x] Comprobar catálogo sin API una vez cargado el bundle.
- [x] Completar la verificación común de entrega.

## Paso 6 — Detalles

**Resultado esperado:** abrir y consultar un lugar autorizado.

- [x] Navegar desde fila usando ID, sin duplicar entidades en estado de pantalla.
- [x] Resolver destino desde la fuente de verdad y validar visibilidad.
- [x] Mostrar nombre, descripción, coordenadas y origen en español.
- [x] Preparar acciones necesarias sin simular funcionalidades aún no implementadas.
- [x] Volver a Lugares con navegación coherente.
- [x] Manejar ID inexistente, inválido o ajeno mediante aviso y retorno seguro.
- [x] Probar al menos un seed y, cuando exista, un custom.
- [x] Completar la verificación común de entrega.

## Paso 7 — Crear destino propio

**Resultado esperado:** alta persistente y aparición en la lista.

- [x] Añadir Agregar destino en Lugares y abrir formulario vacío.
- [x] Crear campos nombre, descripción, latitud y longitud accesibles con teclado utilizable.
- [x] Definir formato de entrada de decimales y comunicarlo al usuario.
- [x] Rechazar nombre/descripcion vacíos, coordenadas vacías/no numéricas/no finitas y fuera de rango.
- [x] Permitir coordenadas 0 y valores límite válidos.
- [x] Generar ID custom único y asignar ownerId desde sesión, no desde el formulario.
- [x] Guardar mediante acción centralizada antes de confirmar éxito.
- [x] Volver a Lugares y mostrar el destino sin reiniciar.
- [x] Cancelar sin guardar; conservar valores si falla persistencia.
- [x] Reiniciar y verificar que el destino se conserva.
- [x] Cambiar de cuenta y comprobar que el destino no es visible para otro usuario.
- [x] Completar la verificación común de entrega.

## Paso 8 — Editar destino propio

**Resultado esperado:** cambios persistentes sin alterar identidad/propiedad/orden.

- [x] Mostrar Editar solo para custom propios y bloquear también en la acción de dominio.
- [x] Validar ID/propiedad antes de precargar el formulario compartido.
- [x] Precargar todos los campos y aplicar validaciones de creación.
- [x] Conservar ID, ownerId y posición de creación al guardar.
- [x] Persistir antes de éxito y regresar a Detalles con valores nuevos.
- [x] Verificar actualización simultánea en Lugares y Detalles.
- [x] Cancelar edición y comprobar que nada cambió.
- [x] Probar ruta directa a seed/custom ajeno y verificar rechazo.
- [x] Probar fallo de escritura y reintento conservando input.
- [x] Reiniciar y comprobar los cambios guardados.
- [x] Completar la verificación común de entrega.

## Paso 9 — Favoritos integrados

**Resultado esperado:** corazón funcional, orden estable y aislamiento por usuario.

- [x] Definir Favorite por userId/destinationId y validar datos persistidos.
- [x] Implementar toggleFavorite sin duplicados ni referencias a destinos ajenos/invisibles.
- [x] Añadir corazón vacío y corazón lleno rojo en cada fila y acción equivalente en Detalles.
- [x] Añadir etiquetas/estado accesible y área táctil adecuada.
- [x] Evitar que tocar corazón abra Detalles.
- [x] Mostrar pending y bloquear toques repetidos mientras guarda.
- [x] Conservar corazón/orden confirmados hasta completar persistencia.
- [x] Ordenar favoritos primero respetando orden base dentro de ambos grupos.
- [x] Desmarcar y comprobar retorno a posición relativa original.
- [x] Verificar funcionamiento para seeds y custom propios.
- [x] Verificar coherencia entre Detalles y lista, incluido texto editado de custom.
- [x] Probar lista sin favoritos y varios favoritos marcados en distinto orden temporal.
- [x] Probar reinicio y cambio A/B/A sin filtración de favoritos.
- [x] Probar error de escritura: estado previo conservado y reintento posible.
- [x] Completar la verificación común de entrega.

## Paso 10 — Eliminar destino propio

**Resultado esperado:** baja con confirmación y limpieza de favoritos.

- [x] Mostrar Eliminar solo para custom propios y verificar propiedad en dominio.
- [x] Abrir confirmación en español con Cancelar/Eliminar.
- [x] Cancelar y verificar destino/favorito intactos.
- [x] Definir recuperación si falla parte del guardado destino/favoritos.
- [x] Borrar destino y todas sus referencias favoritas en un mismo cambio lógico.
- [x] Confirmar éxito solo tras completar persistencia y regresar a Lugares.
- [x] Verificar que filas y Detalles no conserven entidad eliminada.
- [x] Rechazar eliminación de seeds o custom ajenos, incluso desde llamadas directas.
- [x] Probar borrado de un favorito y de un no favorito, y reiniciar.
- [x] Probar fallos/reintentos sin éxito falso ni referencias huérfanas.
- [x] Completar la verificación común de entrega.

## Paso 11 — Cálculo de orientación

**Resultado esperado:** cálculo matemático independiente de UI y sensores.

- [x] Crear función pura de bearing desde origen/destino geográficos.
- [x] Crear función pura de ángulo relativo entre bearing y heading.
- [x] Documentar grados/radianes, normalización y sentido de rotación de la flecha.
- [x] Validar valores finitos y rangos donde corresponda.
- [x] Comprobar casos norte, este, sur y oeste con coordenadas conocidas.
- [x] Comprobar cruce 359°/0° y rotaciones negativas/equivalentes.
- [x] Definir tratamiento de posición coincidente/cercana sin dirección inventada.
- [x] Comprobar que el rumbo usado y el heading comparten referencia norte coherente.
- [x] Añadir pruebas significativas de las funciones puras y ejecutarlas.
- [x] Completar la verificación común de entrega.

## Paso 12 — Ubicación bajo demanda

**Resultado esperado:** pantalla de Brújula y manejo de permisos/posición; sin acreditar sensores físicos aún.

- [x] Instalar expo-location con versión compatible mediante expo install.
- [x] Abrir Brújula desde Detalles con destino validado.
- [x] Mostrar destino y botón Iniciar orientación sin permiso al abrir la ruta.
- [x] Solicitar únicamente permiso foreground al tocar el botón.
- [x] Mostrar explicación de permiso y estados solicitando/obteniendo ubicación en español.
- [x] Obtener posición y precisión; validar coordenadas antes de usarlas.
- [x] Manejar permiso rechazado, sin posibilidad de volver a solicitarlo, servicios desactivados y error/timeout de posición.
- [x] Ofrecer reintento o instrucciones de ajustes cuando corresponda.
- [x] Evitar actualizaciones tardías después de salir y permitir cancelar/detener.
- [x] Probar estados con simulador/datos controlados y registrar sus límites.
- [x] No solicitar background ni incorporar mapas/geocodificación.
- [x] Reservar validación GPS/sensores del iPhone físico para el paso 13.
- [x] Completar la verificación común de entrega.

## Paso 13 — Brújula en el iPhone 14 Pro

**Resultado esperado:** demostración física de orientación y fallbacks.

**Estado:** 18/18 checks completados. El usuario confirmó haber realizado todas las pruebas de la guía en su iPhone 14 Pro físico. La evidencia física es su reporte manual; la auditoría técnica anterior conserva sus pruebas de simulador/adaptador controlado. El usuario comunicó en el paso 14: iOS 26.7.1, Expo Go 57.0.9 y SDK 57.0.0. Ver registro de verificación física al final.

- [x] Registrar iPhone 14 Pro, versión iOS, versión Expo Go y SDK del proyecto. Reporte del usuario: iOS 26.7.1, Expo Go 57.0.9, SDK 57.0.0.
- [x] Confirmar que el bundle abre en Expo Go del teléfono.
- [x] Suscribir heading únicamente con orientación activa.
- [x] Verificar disponibilidad/calidad de heading y elegir norte verdadero/magnético de forma coherente con bearing.
- [x] Calcular ángulo relativo y dibujar flecha accesible con explicación de orientación aproximada.
- [x] Mostrar calibración/no disponible si heading es inválido o de baja calidad.
- [x] Definir cercanía al destino tomando en cuenta precisión GPS.
- [x] Detener listeners al pulsar Detener, salir o desmontar, incluso con inicio asíncrono pendiente.
- [x] En el iPhone, iniciar, otorgar permiso foreground y comprobar ubicación/precisión.
- [x] Girar teléfono en distintas orientaciones y verificar respuesta continua de la flecha.
- [x] Contrastar orientación aproximada con un lugar conocido en un entorno abierto.
- [x] Probar rechazo de permiso y mantener el resto de la app utilizable.
- [x] Probar ubicación no disponible y heading inválido mediante condiciones reales o simulación controlada identificada.
- [x] Probar iniciar/detener repetidas veces y volver a Detalles sin listeners duplicados.
- [x] Verificar comportamiento al cambiar de destino y ante salida durante carga.
- [x] Documentar interferencia magnética/interiores y diferencias respecto del simulador.
- [x] No prometer navegación vial, UWB ni precisión centimétrica.
- [x] Completar la verificación común de entrega.


## Paso 14 — Preparar la presentación

**Resultado esperado:** app verificable, documentación fiel y defensa preparada.

**Estado:** cerrado por confirmación del usuario; **17/17 checks marcados**. El usuario informó haber completado las pruebas 1–13 de la guía final y confirmó las pruebas físicas previas de brújula y permisos. Aceptó cerrar con la cobertura técnica/histórica de accesibilidad y tamaños, sin acreditar una nueva ejecución de la prueba 16 ni VoiceOver. Ver [ACEPTACION.md](./ACEPTACION.md).

- [x] Ejecutar los 16 escenarios de REQUIREMENTS y registrar resultado/evidencia de cada uno.
- [x] Distinguir escenarios físicos, simulados y pendientes; no marcar pruebas no realizadas.
- [x] Ejecutar TypeScript/lint y las pruebas relevantes finales.
- [x] Comprobar arranque desde instalación documentada y reinicio con datos existentes.
- [x] Revisar separación por usuario, permisos de dominio e inmutabilidad del catálogo.
- [x] Revisar loading/error/retry, cancelaciones y fallos de persistencia.
- [x] Revisar UI española, accesibilidad, teclado, áreas seguras y tamaños de pantalla.
- [x] Actualizar README con estado real, instalación, comandos y estructura final.
- [x] Documentar dependencias efectivamente usadas y justificar cada incorporación.
- [x] Documentar cuentas locales sin sincronización y autenticación educativa.
- [x] Actualizar declaración de uso de IA con asistencia realmente utilizada.
- [x] Documentar dispositivo físico, limitaciones de brújula y resultados reales.
- [x] Preparar credenciales ficticias de A/B y un destino propio de prueba.
- [x] Ensayar registro/login, catálogo, CRUD, favoritos, cambio de usuario, reinicio y brújula.
- [x] Identificar archivos de navegación, FlatList, validación, dominio, estado, storage y cálculos.
- [x] Explicar hooks y dependencias de efectos, cleanup de sensores y aislamiento por usuario.
- [x] Revisar cambios finales y pendientes contra requisitos, sin agregar features nuevas.


## Registro de avances

Agregar una entrada por entrega con fecha, paso, archivos, comandos/resultados, comprobaciones manuales y pendientes. Mantener todos los checks sin marcar en la creación inicial de este documento; los resultados técnicos se registran por separado y se marcan al revisarlos.

### 11 de octubre de 2026 — Preparación y validación técnica inicial (pasos 0–1)

En esta entrega inicial se conservaron todos los checks sin marcar; ver la revisión de checks al final para el estado actual.

| Comprobación | Resultado ejecutado |
| --- | --- |
| Entorno | Node 26.3.0, npm 11.16.0, Expo 57.0.27, React Native 0.86.3, TypeScript 6.0.3 |
| `npx tsc --noEmit` | Exit 0, sin errores; repetido después del ajuste del hook web |
| `npm run lint` | Inicialmente falló por setState síncrono en el efecto de use-color-scheme.web.ts; corregido usando useSyncExternalStore para hidratación. Repetido: exit 0, sin errores/warnings de lint |
| `npx expo install --check` | Exit 0, dependencias alineadas |
| `npx expo-doctor` | Exit 0, 21/21 controles aprobados |
| Metro en modo Expo Go | Arrancó con `npx expo start --go --localhost --port 8081`; `/status` respondió `packager-status:running` |
| Bundle iOS | Solicitud HTTP exitosa; Metro compiló 1234 módulos, bundle de 5.918.287 bytes |
| Simulador | iPhone 18 Pro simulado con iOS 27.0; Expo Go 57.0.9 instalado; se intentó abrir el enlace del proyecto mediante Expo CLI |
| Ejecución visual | No acreditada: control de interfaz bloqueado por permisos pendientes de Accesibilidad/Grabación de pantalla. La lista de clientes Metro estaba vacía al comprobarla; no se considera probado el render ni el cambio de pestañas |
| iPhone físico | No probado en esta entrega; sensores reservados al paso 13 en iPhone 14 Pro |

**Archivos:** este plan; documentación de dispositivo/paso 13 en AGENTS, REQUIREMENTS, FLOWS y README; corrección mínima del hook web existente. No se implementaron rutas nuevas ni funcionalidades del TP.

**Repetir en el Mac:** `npx expo start --go`, pulsar `i` para el simulador y revisar Home/Explore. Para iPhone, usar Mac/teléfono en la misma red, Expo Go compatible y escanear el QR con Cámara; el modo localhost de esta prueba solo sirve para el simulador. Detener Metro con Ctrl+C al terminar. No activar ubicación en esta comprobación.

**Compatibilidad revisada:** el iPhone 14 Pro tiene GPS de doble frecuencia y brújula digital según [Apple](https://support.apple.com/en-us/111849). [expo-location](https://docs.expo.dev/versions/latest/sdk/location/) está incluido en Expo Go y expone ubicación y heading en iOS. La [ficha actual de Expo Go en App Store](https://apps.apple.com/us/app/expo-go/id982107779) publica versión 57.0.9 y requiere iOS 16.4 o posterior. No se conoce aún la versión instalada de iOS/Expo Go del teléfono; deberá coincidir con el SDK y cumplir el mínimo. La documentación histórica del lanzamiento SDK 57 mencionaba aprobación pendiente de App Store; la ficha actual ya muestra esa versión.

**Límites aplicables:** permisos en primer plano; heading válido y calibrado, trueHeading puede devolver -1; GPS/brújula aproximados y susceptibles a interiores/interferencia. Los textos del diálogo nativo de permisos pertenecen al binario Expo Go y no se personalizan por app.json; usar explicación previa y errores propios en español. No incorporar background ni un build personalizado. Todo esto se verificará físicamente en el paso 13; no se encontraron impedimentos de hardware para el alcance definido.

### 11 de octubre de 2026 — Revisión visual de Expo Go tras aprobar permisos

Los permisos del control de interfaz ya permiten inspeccionar Device Hub. Se verificó la plantilla en **Expo Go 57.0.9, simulador iPhone 18 Pro, iOS 27.0**:

- Home mostró el contenido “Welcome to Expo” y las instrucciones de la plantilla.
- Tocar Explore abrió la pantalla de ejemplos, con secciones de navegación, plataformas, imágenes, tema y animaciones.
- Tocar Home regresó correctamente a la pantalla inicial.
- No se observó una pantalla de error durante ese recorrido.

El primer intento con `--localhost` falló: Metro escuchaba en localhost IPv6 y Expo CLI abrió un enlace 127.0.0.1. Reiniciar con **`npx expo start --go --port 8081`** y abrir con `i` resolvió la conexión. Metro compiló el bundle solicitado por Expo Go (1681 módulos). Usar el comando habitual sin `--localhost` para repetir esta prueba.

Esta entrada reemplaza el pendiente de revisión visual del registro anterior; no acredita ejecución en el iPhone 14 Pro físico ni sensores. En esta revisión visual se conservaron los checks sin marcar; posteriormente se actualizaron en la revisión de checks registrada al final. No hubo cambios de código ni navegación del TP en esta revisión. Metro se detuvo al terminar.

### 11 de octubre de 2026 — Revisión de checks de los pasos 0 y 1

A pedido del usuario se marcaron los checks respaldados por las decisiones confirmadas y las verificaciones registradas arriba.

- **Paso 0: 14/14 completados.** Corresponde a confirmar el alcance/documentación, no a afirmar que esas funciones ya están implementadas.
- **Paso 1: 19/20 completados.** Incluye TypeScript, lint, dependencias, Doctor, Metro, bundle y recorrido visual Home → Explore → Home en Expo Go del simulador. Se revisó además el lockfile: dependencias raíz coincidentes con package.json y paquetes directos registrados.
- **Pendiente del paso 1:** abrir la plantilla en Expo Go del iPhone 14 Pro físico y confirmar carga/navegación básica. No confundir esa comprobación con la prueba de ubicación/brújula, que permanece reservada al paso 13.
- Los checks comunes y los pasos 2–14 no se modificaron. No se implementó código nuevo ni se repitieron pruebas técnicas sin necesidad.

### 12 de octubre de 2026 — Paso 2: navegación mínima

**Implementación:** Stack raíz en `src/app/_layout.tsx`, Login en `index.tsx`, Registro en `signup.tsx`, Lugares en `places.tsx`, Detalles en `destination/[id].tsx`, Formulario en `destination/form.tsx` y Brújula en `compass/[id].tsx`. Ruta desconocida en `+not-found.tsx`. Se retiraron Explore y los dos componentes de pestañas de ejemplo, que el Stack reemplaza. Se conservaron los otros componentes de la plantilla.

**Código compartido:** contenedor con ScrollView, Flexbox, áreas seguras y botones en `src/components/navigation-screen.tsx`; paleta inicial StyleSheet en `src/constants/theme.ts`, sin dependencias nuevas. `src/utils/destination-route.ts` acepta únicamente el ID temporal `navigation-preview`, rechaza parámetros ausentes, múltiples o desconocidos antes de usarlos. No es una entidad del catálogo; la resolución y visibilidad real quedan para los próximos pasos. No hay autenticación, escrituras ni sensores.

**Verificación ejecutada:** `npx tsc --noEmit` y `npm run lint` terminaron con exit 0; `git diff --check` sin errores. Se compiló el bundle iOS por Metro. TypeScript detectó inicialmente el enlace obsoleto de las pestañas a Explore y se corrigió retirando esas pestañas. La revisión visual detectó fondo ausente en enlaces con estilo funcional; se corrigió con estilos estáticos y se verificó el resultado.

**Pruebas manuales:** Expo Go en simulador iPhone 18 Pro / iOS 27.0: Login → Registro → volver a Login; Lugares → Detalles → Brújula → Atrás → Detalles → Atrás → Lugares; Formulario → Cancelar → Lugares. Títulos en español, encabezado Atrás y contenido bajo el área segura visibles. Enlace directo `destination/invalid` mostró «Destino no disponible» y permitió volver a Lugares. No se solicitó ubicación.

**Pendientes:** verificar visualmente en un segundo tamaño de pantalla y en el iPhone físico. El contenedor usa ancho relativo, ancho máximo, scroll y botones sin alturas rígidas, pero eso no acredita una segunda prueba visual. Revisar esta entrega con el usuario; los checks del paso 2 se conservan sin marcar hasta esa revisión. No se comenzó el paso 3. Metro se detuvo al finalizar.

**Defensa:** el Stack declara los títulos; cada archivo define una pantalla. Link pasa rutas tipadas mediante Href y parámetros; useLocalSearchParams lee entradas externas que se validan antes de continuar. BackButton usa el historial y una ruta de respaldo para apertura directa.

### 12 de octubre de 2026 — Auditoría de checks del paso 2

A pedido del usuario, se revisaron el código y la evidencia de la entrega de navegación. Se marcaron **9/10 checks** del paso 2: Expo Router/Stack, rutas, textos, recorrido Login–Registro, títulos/Atrás/áreas seguras, parámetros validados, aviso de navegación sin autenticación y verificación común registrada. La revisión solicitada satisface la revisión de este incremento; los checks comunes globales se conservan como plantilla para futuras entregas.

**Pendiente sin marcar:** prueba visual de Flexbox en dos tamaños. La entrega anterior acredita solo iPhone 18 Pro simulado; disponer de ancho relativo, maxWidth y ScrollView no sustituye esa segunda prueba. Se intentó preparar iPhone 17e, pero no se obtuvo evidencia visual del proyecto en ese dispositivo durante esta auditoría. El servidor de Metro encontrado en el puerto 8081 ya estaba ejecutándose en otra ventana; se preservó.

**Condición para avanzar:** el usuario autorizó el paso 3 si la revisión anterior resulta satisfactoria. Como el paso 2 conserva una comprobación pendiente, no se inició el paso 3 ni se marcaron sus checks. No se modificó código ni se afirmó que existiera registro local.

### 12 de octubre de 2026 — Paso 2 completo: segundo tamaño

Se abrió el proyecto en Expo Go 57.0.9 del simulador **iPhone 17e / iOS 27.0**, además de la prueba previa en iPhone 18 Pro. Se inspeccionaron visualmente Login, Registro, Lugares, Detalles, Brújula y Formulario: textos adaptados al ancho, botones visibles sin desbordes, encabezados y contenido respetando áreas seguras. Se verificaron Login → Registro → volver, Lugares → Detalles → Brújula → Atrás → Atrás, y Formulario → Cancelar → Lugares. No se observaron errores de aplicación ni se activaron sensores.

Se marca el check restante de Flexbox en dos tamaños: **paso 2, 10/10 completo**. Esta evidencia resuelve el pendiente de la auditoría anterior y habilita el paso 3 solicitado por el usuario. La comprobación en teléfono físico y sensores sigue pendiente en sus pasos correspondientes. Se preservó el Metro que el usuario ya tenía ejecutándose.

### 12 de octubre de 2026 — Paso 3: registro local y auditoría

**Paso 3: 16/16 checks marcados**, distinguiendo la implementación, las pruebas automatizadas y las pruebas manuales. No se comenzó el paso 4. La revisión/auditoría de esta entrega fue solicitada por el usuario al autorizar avanzar tras completar el paso 2.

**Archivos:** `src/types/auth.ts`, `src/features/auth/{validation,password,registration}.ts`, `src/storage/auth-storage.ts`, `src/context/auth-context.tsx`, formulario `src/app/signup.tsx`; integración en `_layout.tsx`, textos de Login/Lugares y contenedor compartido `navigation-screen.tsx`. Se actualizaron package.json/lockfile y README; pruebas en `tests/auth.test.ts`, runner `scripts/test-auth.cjs`.

**Antes de persistir:** se definió guardar usuario antes de sesión. Una sesión fallida conserva la cuenta y ofrece reintento verificado, sin duplicarla. El servicio conserva ID/verificador pendiente incluso ante un rechazo de escritura después de commit; no conserva contraseña/confirmación. Si ya se sabe que la cuenta está guardada, un posterior fallo de lectura conserva ese aviso. Al reiniciar después de una escritura parcial se conserva/rechaza duplicar la cuenta; el login de cuentas existentes se implementará en paso 4. Datos inválidos o fallos de lectura no se resetean/sobrescriben.

| Control ejecutado | Resultado |
| --- | --- |
| `npx expo install @react-native-async-storage/async-storage expo-crypto` | Instaló versiones compatibles con SDK 57: 2.2.0 / ~57.0.4 |
| `npx tsc --noEmit` | Exit 0 |
| `npm run lint` | Exit 0 |
| `npm run test:auth` | 13/13 pruebas aprobadas; validaciones, normalización, password sin trim, salt/IDs independientes, duplicados, errores de lectura/escritura antes/después de commit, reintentos, concurrentes y datos inválidos preservados |
| `git diff --check` | Sin errores |
| `npx expo install --check` | Informó nuevas revisiones patch recomendadas para dependencias previas: @expo/ui ~57.0.23, expo ~57.0.28, expo-router ~57.0.26 y expo-splash-screen ~57.0.10. No indicó incompatibilidad de las dos dependencias añadidas. No se actualizaron paquetes previos en esta feature. |

**Manual en Expo Go 57.0.9, iPhone 17e / iOS 27.0 simulado:** campos vacíos mostraron errores junto a campos y resumen; las contraseñas se mostraron ocultas. Se completó una cuenta ficticia (`prueba17e@example.test`), se comprobó desplazamiento/teclado y se abrió Lugares con el nombre normalizado después de guardar. Se terminó y reabrió Expo Go: cuentas/sesión conservadas; registrar el mismo correo con mayúsculas/espacios se rechazó, conservando inputs. Volver a Login funcionó. Se inspeccionó el manifest real de AsyncStorage y se comprobó estructura de cinco campos, salt hex de 32 caracteres, verificador hex de 64, ausencia de la contraseña ficticia y sesión asociada al mismo ID.

**Alcance de pruebas:** el registro exitoso, campos vacíos, máscara, teclado, duplicado/reinicio y volver se verificaron manualmente en Expo Go. Cada regla de validación y los fallos/reintentos de almacenamiento se verificaron con pruebas automatizadas que ejecutan las funciones reales del dominio sobre un adaptador controlado, usando crypto de Node para el adaptador de hash; Expo Crypto real se ejecutó durante el registro en Expo Go. No se afirma haber provocado un fallo real de AsyncStorage en el dispositivo. No se ejecutaron aún los 16 escenarios finales completos de REQUIREMENTS.

**Defensa:** el formulario controla input/errors/pending; el contexto tiene la acción compartida; el servicio de registro valida, compara duplicados, guarda cuenta/sesión y define el resultado de recuperación; storage valida objetos desconocidos; password genera salt y digest. SHA-256 con salt es una demostración educativa, no seguridad de producción.

**Pendientes fuera de paso 3:** Login/logout, restauración automática y rutas protegidas en paso 4; catálogo/CRUD/favoritos y sensores en sus pasos. Pruebas físicas en iPhone y revisión de patches de dependencias previas permanecen documentadas; no se acreditan con el simulador. Metro del usuario se conservó ejecutándose.


### 12 de octubre de 2026 — Paso 4: Login/logout, restauración y auditoría

**Paso 4: 13/13 checks marcados.** Se auditó cada criterio contra código, pruebas de dominio y verificación manual en Expo Go. Los checks que incluyen fallos de almacenamiento/sesión huérfana se acreditan con pruebas automatizadas controladas, no con fallos físicos de AsyncStorage. No se comenzó el paso 5. La revisión y marcado fueron solicitados por el usuario.

**Alcance y archivos:** formulario real `src/app/index.tsx`; logout en encabezado `src/app/places.tsx`; protección de todas las rutas privadas en `src/app/_layout.tsx`; registro actualizado para dejar la transición al Stack protegido. `src/features/auth/session.ts` implementa signIn/signOut/restauración; `validation.ts` valida requeridos; `src/types/auth.ts` tipa inputs/resultados; `src/storage/auth-storage.ts` elimina únicamente la clave de sesión; `src/context/auth-context.tsx` mantiene la única fuente de verdad y evita operaciones concurrentes. Se ampliaron `tests/auth.test.ts` y README. Sin dependencias nuevas, backend ni sensores.

| Criterio auditado | Evidencia |
| --- | --- |
| signIn/signOut centralizados, verificador con salt y correo normalizado | Servicio de sesión + acciones del contexto; prueba de contraseña exacta, incluida conservación de espacios |
| Requeridos y error genérico | Errores junto a campos y resumen accesible; cuenta inexistente y contraseña incorrecta devuelven el mismo mensaje |
| Persistir antes de abrir/cerrar | Contexto cambia usuario/sesión únicamente tras resultado success; errores antes/después de commit y reintento cubiertos |
| Logout en encabezado y conservación | Botón con pending/disabled; removeItem solo sobre session; prueba conserva cuentas y claves de destinos/favoritos byte por byte |
| Hidratación, sesión válida/ausente/huérfana | restoreSession valida cuentas/sesión antes de habilitar Stack; huérfana devuelve usuario/sesión null sin modificar almacenamiento |
| JSON inválido/error de lectura | Aviso/reintento del layout; pruebas verifican rechazo, cero escrituras, datos intactos y recuperación tras error de lectura |
| Rutas privadas y Atrás | Stack.Protected agrupa Lugares, Detalles, Formulario y Brújula; verificación manual sin Atrás privado y enlace directo rechazado tras logout |
| Verificación común | Objetivo/reglas revisados, alcance acotado, TypeScript y hooks, UI española, loading/errores/accesibilidad, comandos y diff revisados; pruebas manuales abajo y defensa en README |

**Comandos:** `npx tsc --noEmit`, `npm run lint`, `npm run test:auth` (18/18 aprobadas) y `git diff --check`, todos exit 0. Se revisaron los archivos nuevos además del diff porque el repositorio ya contenía cambios sin commit de pasos previos; se preservaron esos cambios.

**Manual en Expo Go, iPhone 17e con iOS 27.0 simulado:** sesión previa abrió Lugares; cerrar sesión mostró Login. Enviar campos vacíos mostró ambos errores. Credenciales incorrectas mostraron mensaje genérico conservando input. Ir a Registro y volver funcionó. Se creó cuenta ficticia `paso4@example.test` y se abrió Lugares; cerrar e ingresar con correo en mayúsculas/espacios abrió la misma cuenta. Terminar/reabrir Expo Go y cargar el proyecto restauró Lugares con la cuenta. Detalles → Atrás → Lugares funcionó. Tras logout no apareció Atrás y un enlace directo a `/destination/navigation-preview` mantuvo Login. Se reinició también sin sesión y se verificó Login.

**Límites y recuperación:** fallos de escritura/borrado, sesiones huérfanas y JSON inválido se verificaron con las funciones reales y adaptador controlado; no se alteraron datos reales para provocar fallos. Un rechazo después de commit se reporta como error y permite reintento idempotente; al reiniciar se toma el estado persistido real. La hidratación todavía abarca cuentas/sesión: destinos/favoritos se integrarán cuando existan. Prueba física de Expo Go en iPhone 14 Pro sigue pendiente según pasos 1/13. El catálogo, CRUD/favoritos y brújula siguen pendientes en sus incrementos. Metro existente se conserva.

**Defensa y repetición:** seguir formulario → acción del contexto → servicio → storage. El hash educativo compara salt/verificador; el contexto cambia solo ante éxito; Stack.Protected controla acceso e historial. Ejecutar `npx expo start --go`, entrar, reiniciar, cerrar y volver a entrar con credenciales ficticias. Consultar README para archivos y comandos. Esta entrega queda disponible para revisión antes de avanzar al paso 5.

### 12 de octubre de 2026 — Paso 5: catálogo en FlatList y auditoría

**Paso 5: 12/12 checks marcados.** Auditoría solicitada por el usuario: se cotejó cada criterio con los archivos reales, la prueba del catálogo y la inspección visual. No se inició el paso 6. Los checks comunes globales siguen como plantilla; esta entrada registra su aplicación al incremento.

**Objetivo y archivos:** catálogo de 20 destinos sin API en `src/data/defaultDestinations.ts`, tipos en `src/types/destination.ts`, selector en `src/features/destinations/selectors.ts`, FlatList en `src/app/places.tsx`. Prueba reproducible en `scripts/test-catalog.cjs`, comando en package.json y documentación README. Se preservaron los cambios previos sin commit. Sin nuevas dependencias ni escrituras de catálogo.

| Criterio | Evidencia auditada |
| --- | --- |
| Destination e IDs sin colisiones | Unión discriminada seed/custom, prefijos tipados y ownerId obligatorio para custom |
| 20 constantes, coordenadas y descripciones | Comparación exacta con las 20 filas de PLACES: IDs, nombres, orden, coordenadas; descripciones españolas breves sin fechas ni hechos históricos añadidos |
| Cantidad, unicidad y rangos | test:catalog comprueba 20, IDs únicos, coordenadas finitas/rangos y constantes congeladas |
| Seeds en código | Solo constantes importadas; ningún acceso a AsyncStorage del catálogo |
| FlatList y filas | keyExtractor por ID; nombre/origen español y reserva lateral de 48 puntos, sin corazón ficticio |
| Visibilidad y orden | Prueba con custom A/B intercalados: seeds primero, custom propios en orden del array, anónimo sin destinos; inputs no mutados |
| Scroll, áreas seguras y tamaños | Inspección visual del comienzo y final hasta Puente de la Mujer en iPhone 17e y iPhone 18 Pro simulados, iOS 27.0; nombres largos ajustados a varias líneas |
| Sin API tras cargar bundle | Los módulos de datos/selector solo importan constantes/tipos; ejecución local en Node sin servicio remoto. No se afirma haber activado modo avión |
| Verificación común | Reglas leídas, alcance paso 5, hooks/TypeScript, textos españoles, estado vacío y error de logout; loading/hidratación del layout existente. Comandos, diff y pruebas manuales registrados; defensa en README |

**Comandos:** `npx tsc --noEmit`, `npm run lint`, `npm run test:auth` (18/18), `npm run test:catalog` y `git diff --check`: exit 0. La prueba de catálogo ejecuta módulos puros reales y contrasta PLACES; el chequeo completo de tipos corresponde a tsc.

**Manual:** acceso con cuentas ficticias creadas en cada simulador, contador 20, orden desde Obelisco y scroll hasta Puente de la Mujer, origen visible y áreas seguras. Se observó un login incorrecto con aviso y conservación de input durante la preparación. Catálogo no tiene operación mutable ni cancelar; casos anónimo/usuario sin custom se verificaron en el selector. La UI no inventa loading de una lectura de catálogo síncrona.

**Defensa y límites:** seguir tipos → constantes → selector → FlatList. Custom permanece vacío en pantalla hasta estado/persistencia/creación del paso 7; su orden de creación se define como orden del array (ediciones conservarán posición). Los enlaces de prueba de Lugares se retiraron: selección/Detalles corresponde al paso 6, favoritos al 9. Prueba física sigue pendiente en pasos 1/13. El permiso de ubicación no se solicitó. Metro del usuario se preservó.


### 12 de octubre de 2026 — Paso 6: Detalles y auditoría

**Paso 6: 8/8 checks marcados.** La implementación y auditoría fueron solicitadas por el usuario. No se inició el paso 7. Se preservaron los cambios previos sin commit y el Metro existente del usuario. Sin dependencias nuevas ni escrituras de catálogo.

**Archivos:** filas seleccionables en `src/app/places.tsx`; Detalles real en `src/app/destination/[id].tsx`; resolución compartida en `src/features/destinations/{selectors.ts,use-destinations.ts}`; Brújula recibe el ID real en `src/app/compass/[id].tsx`; aviso genérico y retorno `dismissTo` en `src/components/navigation-screen.tsx`. Se retiró `src/utils/destination-route.ts`, que aceptaba solo el fixture obsoleto. Se ampliaron `scripts/test-catalog.cjs` y README. No se modificaron las reglas de autenticación ni los datos de PLACES.

| Check auditado | Evidencia |
| --- | --- |
| Fila → ID sin duplicar entidad | Link tipado pasa solo item.id; Detalles obtiene entidad en cada render, sin useState de destino |
| Fuente de verdad y visibilidad | Hook común lee sesión del contexto y catálogo del selector; colección custom única y vacía hasta paso 7; resolución filtra por ownerId |
| Información española | Nombre, descripción, Latitud, Longitud y Catálogo predefinido / Destino propio; seeds con Solo lectura |
| Acciones sin simulación | Brújula conserva navegación con ID/nombre real y aviso explícito de desarrollo; favoritos, editar/eliminar no tienen controles ficticios |
| Retorno coherente | Atrás del Stack y Volver a Lugares con dismissTo; observado retorno a lista sin Atrás duplicado |
| ID inexistente/inválido/ajeno | Aviso idéntico y retorno seguro; enlace seed-99 probado en Expo Go; arrays, ausentes, formato inválido, desconocidos, ajenos/anónimo cubiertos por test:catalog |
| Seed y custom cuando exista | Obelisco y Torre Monumental probados en pantalla; custom propio/ajeno comprobados en selector con fixtures. Custom real en UI aún no existe: prueba manual diferida al paso 7, conforme a «cuando exista» |
| Verificación común | Requisitos/flujos/reglas leídos, alcance acotado, componentes funcionales, TypeScript, textos españoles, accesibilidad en filas y aviso/retorno; loading de sesión en layout existente, catálogo síncrono sin loading ficticio. Comandos y pruebas manuales abajo; defensa documentada en README. Auditoría solicitada; no se avanzó de incremento |

**Comandos ejecutados:** `npx tsc --noEmit`, `npm run lint`, `npm run test:auth` (18/18) y `npm run test:catalog` (catálogo y resolución autorizada), todos exit 0. Tras ajustar el retorno a dismissTo se repitieron TypeScript/lint. `git diff --check` sin errores. Se revisó el diff y el contenido completo de los archivos nuevos del incremento, porque varios todavía no están registrados en Git.

**Manual en Expo Go, iPhone 18 Pro / iOS 27.0 simulado:** registro con credenciales ficticias `paso6@example.test`; Lugares → Obelisco mostró descripción/coordenadas/origen; Brújula mostró Orientación hacia Obelisco sin permiso ni sensores; Atrás volvió a Detalles; Volver a Lugares regresó sin duplicar lista. Desde Safari se abrió `exp://127.0.0.1:8081/--/destination/seed-99`: Destino no disponible, aviso genérico y retorno a Lugares. Torre Monumental mostró nombre largo ajustado, coordenadas y origen; se inspeccionó visualmente y Atrás volvió a lista. Durante la preparación se agregó y retiró un enlace temporal de prueba que no se utilizó ni quedó en el resultado; el error se verificó mediante el enlace directo real de Safari.

**Límites:** no se acredita prueba en iPhone físico, segundo tamaño nuevo de Detalles, CRUD/favoritos ni los 16 escenarios finales. No hay operación mutable de destinos en este paso; no corresponde reinicio de un cambio de destino ni pruebas de escritura de destinos. El aislamiento custom se acredita en funciones reales con fixtures controlados, no con entidades creadas en pantalla. La cuenta ficticia de prueba queda guardada localmente en ese simulador. Sensores físicos siguen en paso 13.

**Defensa y repetición:** seguir fila → parámetro ID → hook común → selector de visibilidad → JSX de Detalles. `dismissTo` encuentra Lugares en el Stack y reemplaza si no existe. Ejecutar `npx expo start --go`, ingresar con cuenta ficticia, seleccionar destino, comprobar información y volver; probar el enlace desconocido anterior. La entrega queda disponible para revisión; no se comenzó el paso 7.


### 12 de octubre de 2026 — Paso 7: creación persistente y auditoría

**Paso 7: 12/12 checks marcados.** Se cotejó cada punto con el código y evidencia manual/automatizada. El usuario autorizó implementación, auditoría y marcado. No se inició el paso 8; los checks comunes globales permanecen como plantilla.

**Archivos:** `src/app/places.tsx`, `src/app/destination/form.tsx`, `src/context/auth-context.tsx`, `src/features/destinations/use-destinations.ts`, nuevo `src/features/destinations/creation.ts`, `scripts/test-destinations.cjs`, comando en package.json y README. Se conservaron cambios previos sin commit. Sin dependencias nuevas, sensores ni backend.

| Check auditado | Evidencia |
| --- | --- |
| Agregar → formulario vacío | Botón real en Lugares, ruta existente; apertura y reapertura vacías comprobadas en Expo Go |
| Campos accesibles/teclado | Labels, accessibilityLabel, descripción multiline, ScrollView + KeyboardAvoidingView; teclado iOS completo permite signo menos |
| Decimales comunicados | Ayuda española; punto/coma, signo, sin miles; parser decimal completo, sin parseFloat parcial |
| Rechazar vacíos/no numéricos/no finitos/rangos | Validación compartida formulario/dominio; pruebas con NaN, Infinity, exponentes, texto parcial y límites excedidos; vacíos manuales |
| 0 y límites válidos | Prueba de 0/0, −90/−180 y 90/180 |
| ID único/propietario desde sesión | Crypto.randomUUID con prefijo custom; comprobación de colisión; acción usa session.userId, el formulario no envía propietario |
| Acción centralizada/persistir antes de éxito | Contexto único, servicio escribe una clave, setCustomDestinations solo tras success; bloqueo de concurrencia |
| Retorno y lista inmediata | dismissTo Lugares; contador 20 → 21, fila propia y Detalles con campos reales |
| Cancelar/error conserva input | Cancelación de «No guardar» mantuvo 21; UI no limpia inputs en error; pruebas controladas de fallos/retry |
| Reiniciar y conservar | Se terminó Expo Go y reabrió proyecto: 21 lugares; Detalles del destino guardado con nombre, descripción y coordenadas |
| Cambiar de cuenta | Logout A → registro B ficticio paso7b@example.test: 20 seeds sin destino A; selector también probado con A/B y ruta ajena rechazada |
| Verificación común | Objetivo/reglas revisados; alcance paso 7, hooks/TypeScript, español, loading/errores/accesibilidad, pruebas y revisión de código/diff, defensa en README; revisión solicitada, sin avance de paso |

**Comandos ejecutados:** `npx tsc --noEmit`, `npm run lint`, `npm run test:auth` (18/18), `npm run test:catalog`, `npm run test:destinations` y `git diff --check`: exit 0. Se revisó también el contenido completo de los archivos nuevos, aún sin seguimiento de Git.

**Manual en Expo Go / iPhone 18 Pro / iOS 27.0 simulado:** abrir formulario vacío; enviar vacío y observar cuatro errores y resumen; completar «Destino paso 7», descripción ficticia, latitud -34,6037 y longitud -58.3816; guardar y observar 21 lugares; terminar/reabrir Expo Go y observar 21, abrir custom y comprobar -34.6037/-58.3816; volver, abrir formulario vacío, escribir «No guardar», cancelar y conservar 21; cerrar sesión y registrar B, observar 20 sin destino A. La interacción usó el árbol accesible para campos/acciones; se inspeccionó el formulario y lista visualmente. La cuenta B queda activa y las cuentas/destino ficticios se conservan en el simulador. Metro existente se conservó.

**Recuperación definida antes del alta:** una sola escritura de destinos; no modifica cuentas/sesión ni almacena seeds. Invalid JSON/datos y fallo de lectura no causan reset ni escrituras. Fallo antes/después de commit devuelve error, mantiene el estado confirmado y permite reintentar con el mismo ID por instancia de formulario. El reintento aplica input actual sin duplicar ni mover el registro; una nueva instancia genera otro intento. Reinicio toma el dato realmente persistido. Fallos, concurrencia, límites y aislamiento de rutas se acreditan con funciones reales sobre almacenamiento controlado; no se afirma haber provocado errores físicos de AsyncStorage.

**Defensa:** formulario → acción del contexto (sesión) → validación/servicio → AsyncStorage → estado confirmado → selector → FlatList/Detalles. El validador del arranque recibe unknown y rechaza datos malformados antes de habilitar navegación. La separación por cuenta está en selectores y propietario de dominio, no solo en botones.

**Límites pendientes fuera del paso:** prueba física del iPhone 14 Pro, edición/favoritos/eliminación y sensores en sus incrementos; no se acreditan los 16 escenarios finales completos. La verificación manual se hizo en un tamaño de simulador; los límites numéricos y errores de almacenamiento se verificaron automáticamente. El paso 7 queda disponible para revisión.


### 12 de octubre de 2026 — Paso 8: edición y auditoría

**Paso 8: 11/11 checks auditados y marcados**, con evidencia manual y automatizada diferenciada. El usuario solicitó implementación y auditoría; no se inició el paso 9. Se conservaron cambios previos y Metro existente. Sin dependencias nuevas.

**Archivos afectados:** Detalles y formulario compartido (`src/app/destination/`), acción en `src/context/auth-context.tsx`, servicio nuevo `src/features/destinations/update.ts`, resolución autorizada en `selectors.ts`/`use-destinations.ts`, pruebas en `scripts/test-destinations.cjs`, README y esta lista.

| Criterio | Evidencia |
| --- | --- |
| Editar solo custom propio + dominio | Detalles usa entidad visible y source custom; servicio relee almacenamiento y exige ownerId de sesión. Tests seed/ajeno/anónimo/desconocido sin escrituras |
| Validar ruta antes de precargar | selectEditableDestination compartido; tests de parámetros directos seed/ajeno/ausente/array/inválido. Ruta muestra aviso genérico sin montar formulario |
| Precarga y validaciones | Cuatro campos observados en Expo Go; nombre vacío mostró error y resumen; mismos validateDestination y casos numéricos del alta |
| Identidad, propiedad y orden | Sustitución en mismo índice, fields limitados; pruebas comparan IDs, propietario y otras entidades |
| Persistencia antes de éxito → Detalles | await setItem antes de success y setCustomDestinations; retorno dismissTo observado con nombre nuevo |
| Lugares y Detalles coherentes | Nombre temporal «Cancha de Boca · prueba paso 8» observado en ambas pantallas; mismo contexto y selectores |
| Cancelar sin cambios | «Cambio cancelado» no se guardó; volvió a Detalles con «Cancha de Boca» |
| Rechazo de rutas seed/ajenas | Automatizado sobre el resolver real que usa la ruta y servicio independiente; no se acredita apertura visual del enlace directo en este incremento |
| Fallo y reintento | Adaptador controlado falla antes/después de commit; estado previo ante fallo anterior, retry con input corregido sin duplicados. UI conserva input y habilita reintento; no fallo físico de AsyncStorage |
| Reinicio y cambios | Reload de Expo Go reinició ejecución e hidrató AsyncStorage: nombre editado presente en Lugares y Detalles. No se terminó el proceso del sistema. También parseo del dato serializado en test |
| Verificación común | Reglas y alcance leídos; hooks/TypeScript, español, loading/errores/accesibilidad; camino exitoso/error de validación/cancelación manual; comandos y revisión de archivos/diff; defensa en README. Entrega para revisión, sin avanzar de paso |

**Comandos ejecutados:** `npx tsc --noEmit`, `npm run lint`, `npm run test:destinations`, `npm run test:catalog`, `npm run test:auth` (18/18), `git diff --check`: exit 0 en validación final. Lint detectó inicialmente una precarga mediante efecto; se corrigió con inicialización del formulario y componente con key por ID, y se repitieron tipos/lint. El input no se reinicializa cuando cambia la colección confirmada.

**Manual:** Expo Go, iPhone 18 Pro, iOS 27.0 simulado, cuenta B previamente activa. Abrir custom, precarga completa, cancelar cambio, rechazar nombre vacío conservando los otros campos, guardar nombre temporal y ver Detalles/lista, Reload y comprobar restauración. Finalmente guardar el nombre original «Cancha de Boca», preservando descripción y coordenadas. La navegación por enlace desde Safari no pudo completarse mediante la herramienta; el rechazo se acredita por pruebas automatizadas del resolver real, no por observación visual. La captura de pantalla de Device Hub no estuvo disponible; evidencia manual basada en árbol de accesibilidad.

**Defensa:** ruta → resolver autorizado → campos de formulario → acción del contexto con sesión → servicio con propiedad y validación → escritura única → estado confirmado → Detalles/FlatList. No hay escrituras de seeds ni cambios de ownerId/ID/orden. Pendientes fuera del paso: favoritos, eliminación y sensores; prueba física del iPhone 14 Pro según pasos 1/13. No se acreditan todos los escenarios finales ni errores físicos de almacenamiento.


### 12 de octubre de 2026 — Paso 9: favoritos y auditoría

**15/15 checks auditados y marcados.** El usuario autorizó implementación, auditoría, marcado y commit/push. No se inició el paso 10. Los checks comunes globales son una plantilla; la evidencia específica se registra aquí.

**Archivos:** nuevo `src/features/favorites/favorites.ts`, nuevo `src/components/favorite-button.tsx`, contexto central, hook de destinos, Lugares/Detalles, nuevo `scripts/test-favorites.cjs`, comando en package.json, README y esta lista. Sin dependencias nuevas.

| Check | Evidencia |
| --- | --- |
| Favorite y validación persistida | Pares tipados; parser unknown verifica estructura, cuentas existentes, visibilidad y duplicados antes de navegación; null significa colección vacía |
| Toggle sin duplicados/ajenos | Servicio valida sesión y destino visible; elimina par previo antes de añadir; tests anónimo, ajeno y desconocido sin escrituras |
| Corazones lista/Detalles | Componente común: ♡ y ♥ rojo, acción equivalente con texto en Detalles; UI real probada |
| Accesibilidad y área | Labels españoles agregar/quitar + nombre, selected/disabled/busy, tamaño mínimo 48; selected observado en árbol accesible |
| Corazón no navega | Botón hermano del enlace de fila; marcar Floralis conservó Lugares |
| Pending/repetidos | Indicador, bloqueo global en contexto + ref síncrono por botón; test concurrente del servicio |
| Estado previo hasta persistir | await setItem precede success/setFavorites; errores no cambian estado confirmado |
| Favoritos primero/orden estable | Partición del orden base; tests y UI: marcados Floralis → Manzana → Teatro, mostrados Teatro → Floralis → Manzana |
| Desmarcar restaura posición | Quitar Teatro desde Detalles; al volver quedó después de Obelisco entre no favoritos; test compara grupo completo |
| Seeds y custom | Floralis/Teatro/Manzana y Cancha de Boca marcados en UI; tests ambos tipos |
| Coherencia y edición | Detalles de Teatro seleccionado, desmarcado visible en lista; test cambia nombre de custom y conserva favorito/orden; ambos leen mismo contexto sin copia de entidad |
| Ninguno/varios en distinto orden | Inicio manual sin favoritos; orden temporal distinto comprobado; tests colección vacía y varios |
| Reinicio y A/B/A | Reload real de Expo Go rehidrató Floralis, Manzana y Cancha de Boca seleccionados al principio. A/B/A probado con serialización/parser/selectores reales; no cambio manual de cuentas en este incremento |
| Fallo/retry | Adaptador controlado falla antes/después de escritura y lectura; error sin success, reintento idempotente para agregar/quitar, JSON inválido preservado |
| Verificación común | Reglas/alcance revisados, código funcional/TypeScript/español, loading/error/accesibilidad; tipos/lint/suites/diff ejecutados; camino feliz y volver manual, error de persistencia automatizado; defensa/limitaciones documentadas, entrega para revisión sin avanzar |

**Comandos:** `npx tsc --noEmit`, `npm run lint`, `npm run test:auth` (18/18), `npm run test:catalog`, `npm run test:destinations`, `npm run test:favorites` y `git diff --check`: exit 0. Auditoría del diff y archivos nuevos realizada.

**Manual:** Expo Go en Device Hub, iPhone 18 Pro / iOS 27.0 simulado, cuenta ficticia B existente. Inicio sin favoritos; marcar Floralis, Manzana de las Luces y Teatro Colón; comprobar orden base; abrir Teatro, quitar favorito, volver y comprobar posición. Marcar Cancha de Boca; Reload desde menú de Expo Go y observar tres favoritos restaurados, incluidos custom y sesión. Captura visual mostró corazones vacíos y filas ajustadas; estados seleccionados/acciones y orden comprobados por árbol accesible. Los favoritos de prueba quedan guardados en esa cuenta. Metro existente se conservó. El enlace desde Safari quedó inicialmente bloqueado por limitación de click por coordenadas de la herramienta; se abrió Expo Go desde Spotlight y se completó la prueba.

**Recuperación/defensa:** botón → toggle del contexto con sesión y bloqueo → servicio valida referencia y relee favoritos → una escritura de clave versionada → estado confirmado → partición estable → FlatList/Detalles. Se solicita estado final a partir del estado confirmado para recuperar escrituras que hayan persistido pero rechazado la promesa, sin doble inversión. No hay operación multi-clave en este paso. Parser inválido bloquea hidratación sin sobrescribir. El paso 10 deberá definir el cambio lógico de eliminación + limpieza de favoritos.

**Límites:** errores de almacenamiento, concurrencia, A/B/A y edición de favorito se acreditan con funciones reales y datos controlados, no fallos físicos de AsyncStorage ni recorrido manual completo de esas variantes. Reload reinició ejecución JS, no terminó el proceso del sistema. Prueba física del iPhone 14 Pro y todos los 16 escenarios finales siguen pendientes en sus pasos. La entrega queda disponible para revisión.


### 12 de octubre de 2026 — Paso 10: eliminación y auditoría

**11/11 checks auditados y marcados.** Se cotejó cada criterio con código y evidencia diferenciada. El usuario autorizó implementación, auditoría, marcado y commit/push; también autorizó crear y borrar dos destinos ficticios en el simulador para completar la prueba manual. No se inició el paso 11. Los checks comunes globales permanecen como plantilla.

**Archivos:** `src/app/destination/[id].tsx`, `src/context/auth-context.tsx`, nuevo `src/features/destinations/deletion.ts`, nuevo `scripts/test-deletion.cjs`, comando en `package.json`, README y esta lista. Sin dependencias nuevas.

| Check | Evidencia |
| --- | --- |
| Eliminar solo custom propios + dominio | Detalles usa resolver visible y source custom. Servicio relee destinos y exige cuenta existente y ownerId. Obelisco no mostró Editar/Eliminar en UI |
| Confirmación en español | Alert con nombre, advertencia de limpieza y Cancelar/Eliminar observado en Expo Go |
| Cancelar conserva destino/favorito | Cancelar sobre Cancha de Boca conservó Detalles, coordenadas y corazón seleccionado; volvió a lista intacta |
| Recuperación parcial definida | Registro previo `tourism.deletion.v1`; completar favoritos/destinos y retirar registro; fallos bloquean navegación/mutaciones hasta lectura/reinicio validado. No se promete atomicidad física |
| Baja y referencias en un cambio lógico | Servicio filtra ID de destinos y todas sus referencias favoritas; devuelve ambas colecciones solo al terminar; tests preservan datos de B |
| Persistir antes de éxito/retorno | Escrituras y limpieza awaited antes de success; contexto actualiza ambas colecciones; dismissTo Lugares observado |
| Sin entidad obsoleta | Test del selector real devuelve null tras baja; lista sin Test10A/B y retorno a Lugares manual. No se acredita apertura manual de deep link borrado |
| Rechazar seeds/ajenos/directos | Tests del servicio con seed, ajeno, anónimo, usuario ausente e ID desconocido: error sin escritura |
| Favorito/no favorito + reinicio | Test10A marcado y borrado; Test10B sin favorito borrado. Reload de Expo Go: 21 lugares originales, tres favoritos previos, sin ambos destinos ficticios. Además rehidratación con parsers reales en tests |
| Fallos/reintentos | Ocho fallos: antes/después del registro, favoritos, destinos y removeItem; ningún resultado success, recuperación antes de hidratar deja colecciones válidas sin huérfanos. Pending bloquea otra baja; JSON inválido/read failure/concurrencia probados |
| Verificación común | Reglas/alcance revisados; componentes funcionales/TypeScript/español; pending/error y accesibilidad; tipos/lint/suites/diff, revisión del código nuevo; happy path y cancelar manual, errores de almacenamiento controlados; defensa en README, entrega para revisión sin avanzar |

**Comandos ejecutados:** `npx tsc --noEmit`, `npm run lint`, `npm run test:auth` (18/18), `npm run test:catalog`, `npm run test:destinations`, `npm run test:favorites`, `npm run test:deletion` y `git diff --check`: exit 0. Tras mejorar el mensaje de recuperación de arranque y el test de bloqueo, se repitieron tipos/lint/deletion. Revisión del diff y contenido de archivos nuevos realizada.

**Manual:** Expo Go / Device Hub, iPhone 18 Pro / iOS 27.0 simulado, cuenta B existente. Cancha de Boca → Eliminar → Cancelar; destino y favorito intactos. Crear Test10A, marcar favorito, abrir Detalles, confirmar baja: Lugares 22 → 21, sin entidad de prueba. Crear Test10B sin favorito, confirmar baja: mismo retorno y contador. Reload mostró primero Leyendo datos locales y luego Lugares con 21 y los tres favoritos originales, sin los dos ficticios. Obelisco mostró solo lectura, sin acciones de edición/baja. Se volvió a Lugares. La entrada inicial tuvo autocorrección y una pega que recibió contenido viejo del clipboard; se corrigieron los campos antes de guardar y se verificaron los nombres reales Test10A/B. Los dos datos ficticios se eliminaron con autorización explícita; los destinos previos permanecen. Se observó árbol accesible y capturas de Detalles/lista; Metro existente se conservó.

**Defensa/recuperación:** confirmación → contexto con sesión y bloqueo común → servicio con ownership → registro pendiente validado → favoritos → destinos → retirar registro → estado compartido → Lugares. Es un protocolo recuperable entre claves, no una transacción atómica: puede existir estado parcial en disco mientras haya registro, pero la app no habilita navegación antes de completar recuperación. Una promesa rechazada después de guardar también devuelve error y exige lectura. Si el registro no se persistió, la lectura conserva el destino y permite repetir. Registro inválido se preserva y bloquea la carga.

**Límites:** fallos físicos de AsyncStorage y recorrido visual de recuperación no se provocaron; se acreditan con el servicio real y adaptador controlado. Reload reinició JS, no terminó el proceso del sistema. No se acreditan los 16 escenarios finales completos ni prueba física del iPhone 14 Pro; sensores siguen en paso 13. La entrega queda disponible para revisión.


### 12 de octubre de 2026 — Paso 11: cálculo de orientación y auditoría

**10/10 checks auditados y marcados.** Implementación limitada a matemática pura; no se inició ubicación ni sensores. Checks comunes globales conservados como plantilla. El usuario autorizó auditoría, marcado y commit/push.

**Archivos:** nuevo `src/features/compass/orientation.ts`, nuevo `scripts/test-orientation.cjs`, comando `test:orientation` en package.json, README y esta lista. Sin dependencias, UI ni almacenamiento nuevos.

| Check | Evidencia |
| --- | --- |
| Bearing puro | `calculateBearing`: rumbo inicial de círculo máximo mediante atan2, sin estado, UI ni sensores |
| Ángulo relativo puro | `calculateRelativeAngle`: bearing menos trueHeading, resultado [-180, 180) |
| Unidades/normalización/rotación | Comentarios documentan entradas en grados, trigonometría en radianes, norte=0, derecha positiva, izquierda negativa y detrás=-180 |
| Valores/rangos | Coordenadas finitas ±90/±180; precisión finita no negativa; heading verdadero [0,360), rechaza -1; normalización acepta vueltas equivalentes |
| Cardinales | Desde (0,0) hacia (±1,0)/(0,±1): 0/90/180/270; pruebas ejecutadas |
| Cruce norte y equivalencias | 0−359=+1, 359−0=−1; ángulos negativos y vueltas múltiples; 576 combinaciones reconstruyen bearing |
| Coincidencia/cercanía | null dentro de max(1 metro, precisión de posición); también antípodas sin rumbo único y mismo polo con distintas longitudes; tests |
| Norte coherente | Bearing geográfico usa norte verdadero; contrato exige trueHeading y prohíbe sustituir norte magnético sin corrección de declinación. Disponibilidad/calidad real quedan para paso 13 |
| Pruebas significativas | Cardinales, caso esférico analítico no plano, antimeridiano, cercanía/precisión, antípodas, valores inválidos, giros y propiedad de reconstrucción |
| Verificación común | Reglas leídas, alcance puro y tipos explícitos; errores en español; loading/accesibilidad/cancelación/persistencia no aplican a funciones síncronas sin UI. Tipos/lint/todas las suites y diff ejecutados; inspección manual de resultados en Node; documentación de defensa y límites; entrega para revisión sin avanzar |

**Comandos:** `npx tsc --noEmit`, `npm run lint`, `npm run test:orientation`, `npm run test:auth` (18/18), `npm run test:catalog`, `npm run test:destinations`, `npm run test:favorites`, `npm run test:deletion` y `git diff --check`: exit 0. La primera ejecución de orientación detectó un valor esperado incorrecto en un ejemplo numérico; se sustituyó por un caso esférico con solución analítica independiente (45°,0°)→(0°,90°), rumbo inicial 90°. La suite corregida pasó.

**Comprobación manual:** ejecución directa de las funciones reales en Node: norte=0°, cruce 359°→0°=+1°, destino dentro de precisión= null y heading -1 produce RangeError en español. Sin recorrido de pantalla porque este incremento no cambia UI. No se acredita prueba de GPS/heading real ni ejecución en teléfono.

**Defensa:** coordenadas → validación → distancia haversine y umbral de precisión → rumbo inicial respecto de norte verdadero → resta de heading verdadero → giro firmado para flecha. Null impide inventar dirección cercana o indefinida. La futura capa de sensores debe verificar calidad/disponibilidad antes de llamar estas funciones y proporcionar precisión GPS; aún no está conectada. La esfera terrestre es una aproximación apropiada para orientación académica, sin navegación vial ni precisión UWB.

**Pendiente:** permiso/ubicación en paso 12, heading/flecha y prueba física iPhone 14 Pro en paso 13, aceptación final en paso 14. Entrega disponible para revisión.


### 12 de octubre de 2026 — Paso 12: ubicación bajo demanda y auditoría

**13/13 checks auditados y marcados**, con evidencia y límites identificados abajo. Usuario autorizó implementación, auditoría, marcado y commit/push. No se inició el paso 13. La checklist común global permanece como plantilla; la comprobación exitosa manual de este incremento fue del controlador con datos controlados, no del GPS/interfaz.

**Archivos:** Brújula y texto/enlace desde Detalles, nuevo `src/features/compass/location.ts`, nuevo `scripts/test-location.cjs`, package.json/lock, app.json, README y esta lista. Dependencia única añadida: expo-location ~57.0.21 mediante `npx expo install expo-location` para SDK 57, incluida en Expo Go.

| Check | Evidencia |
| --- | --- |
| Instalación compatible | expo install seleccionó SDK 57; expo-location satisface ~57.0.20 del manifiesto local. Check remoto no señaló esta dependencia |
| Detalles → destino validado | resolver visible ya compartido; Obelisco → Brújula observado en Expo Go. Tests existentes rechazan IDs inválidos/ajenos/anónimos |
| Destino e Iniciar, sin permiso al abrir | Pantalla mostró Orientación hacia Obelisco y botón sin prompt; controlador no hace llamadas al construirse (test) |
| Únicamente foreground por acción | Adaptador solo get/requestForegroundPermissionsAsync; prompt apareció al tocar Iniciar. Sin background |
| Explicación y estados españoles | Texto previo, requesting/locating, indicador y errores en pantalla; estados observados en ejecución controlada. Diálogo propio de Expo Go en inglés, limitación documentada |
| Posición y precisión validadas | High solicitada, muestra precisión estimada; tests de éxito, rangos, NaN/Infinity, null/negativo y precisión inválida |
| Rechazo/bloqueo/servicios/error/timeout | Denegación y bloqueo observados en UI; tests del controlador real cubren rechazo recuperable, servicios apagados, cuatro errores de API y timeout |
| Reintento/ajustes | Texto indica ajustes para bloqueo/servicios; reintento UI mantuvo aviso y no volvió a pedir permiso bloqueado; test timeout seguido de éxito |
| Salida/cancelar/detener | useFocusEffect invalida al blur/unmount; key por destino; Stop limpia timer/datos. Tests cancelación en las cuatro esperas, repetidos y rechazo tardío tras nuevo inicio |
| Simulador/datos controlados y límites | Expo Go: navegación, ausencia de prompt inicial, rechazo, reintento, retorno. Node: flujo exitoso/stop inspeccionado; tests de estados y fallos. No se acredita posición exitosa visual ni GPS real |
| Sin background/mapas/geocodificación | Config pública Android únicamente COARSE/FINE; código sin APIs background, mapas, geocoding ni listeners |
| Reserva física paso 13 | Sin heading/flecha todavía; iPhone 14 Pro, iOS/Expo Go reales y GPS/sensores pendientes del paso 13 |
| Verificación común | Reglas/alcance revisados; componentes funcionales/TypeScript/español, Flexbox compartido, loading/error, botones de 48 y roles accesibles. Tipos/lint/suites/config/diff revisados; error y retorno manual UI, éxito y stop manual controlado; defensa/documentación, entrega sin avanzar |

**Comandos:** `npx expo install expo-location` exit 0; `npx tsc --noEmit`, `npm run lint`, `npm run test:location`, todas las suites previas (auth 18/18, catalog, destinations, favorites, deletion, orientation), `npx expo config --type public` y `git diff --check` exit 0. `npx expo install --check` exit 1 por cuatro patches existentes pendientes: @expo/ui 57.0.22→~57.0.23, expo 57.0.27→~57.0.28, expo-router 57.0.25→~57.0.26, expo-splash-screen 57.0.9→~57.0.10. No señaló expo-location. Se preservó alcance sin actualizar otras dependencias. La ejecución de suites se hizo después por separado porque ese check detuvo la cadena inicial.

**Manual:** Device Hub, iPhone 18 Pro / iOS 27.0 simulado, cuenta B existente: Obelisco → Abrir Brújula → destino/Iniciar sin prompt → Iniciar → prompt nativo Expo Go → Don't Allow → mensaje «El permiso está bloqueado…» → Reintentar → mismo aviso → Volver a Detalles. No se alteraron cuentas/destinos/favoritos. El permiso de Expo Go quedó denegado en ese simulador. Evidencia por árbol accesible; después se reabrió Brújula y una captura visual confirmó texto y botones legibles sin recorte y estado inicial restablecido. No se atribuye GPS exitoso a esta prueba. Ejecución directa en Node del controlador real con posición ficticia (-34.603, -58.382), precisión 15 m: requesting → locating → ready con los tres valores → stop → idle. Errores/timeout/cancelación en suite controlada, no condiciones físicas provocadas.

**Defensa:** acción explícita → permiso foreground → servicios → posición validada → estado local. Cada intento usa generación; cancelación/salida/timeout cambia la generación, por lo que un resultado antiguo no puede publicar ni pisar otro intento. Timeout de 20 segundos desde la fase de localización incluye comprobación de servicios. No hay timeout sobre el diálogo interactivo; puede cancelarse el intento de la app y salir. Las promesas nativas no son abortables: se limpian timer/estado y se ignora la respuesta, sin afirmar cancelación física. No se persiste ubicación ni se crean subscriptions. El texto de app.json no cambia el prompt del binario Expo Go.

**Pendientes:** prueba exitosa de posición en pantalla y validación real GPS/heading en iPhone 14 Pro del paso 13; aceptación final completa en paso 14. No se acredita prueba física, flecha ni todos los 16 escenarios finales. Entrega disponible para revisión.


### 12 de octubre de 2026 — Paso 13: heading, flecha y auditoría

**Alcance:** completar orientación bajo demanda; usuario autorizó omitir la prueba física por no tener disponible el iPhone. No se inició el paso 14. **13/18 checks marcados**; 5 verificaciones físicas pendientes y expresamente sin marcar. La checklist común global sigue siendo plantilla.

**Archivos:** `src/features/compass/heading.ts`, `src/app/compass/[id].tsx`, texto de Detalles, `scripts/test-heading.cjs`, script en package.json, README y STEPBYSTEP. Sin nuevas dependencias ni cambios en almacenamiento. SDK 57 / Expo instalado 57.0.27 / expo-location 57.0.21. Versiones reales de iOS/Expo Go del iPhone sin verificar.

| Check | Evidencia / estado |
| --- | --- |
| Dispositivo/versiones reales y bundle en teléfono | Pendiente: iPhone 14 Pro confirmado previamente, no disponible; no se inventan versiones ni ejecución física |
| Heading solo activo | El controlador no llama APIs al construirse; tras permiso/posición inicia watchHeadingAsync y watchPositionAsync; test sin llamadas previas |
| Calidad y norte coherente | Solo trueHeading finito en [0,360) y accuracy 2/3. Norte magnético nunca sustituye al verdadero. Matriz de valores inválidos/calidad en test |
| Ángulo/flecha accesible | Funciones puras del paso 11 conectadas a posición/heading; flecha con rotación firmada y etiqueta con destino/grados/sentido. Giros cardinales controlados; flecha física/VoiceOver pendientes |
| Calibración/no disponible | Lecturas inválidas/baja calidad retiran flecha y explican calibración/interferencia. Puede recuperar al recibir calidad válida. Timeout de 20 s sin eventos limpia listeners y ofrece reintento |
| Cercanía/precisión | calculateBearing usa max(1 m, precisión GPS), devuelve null y UI oculta flecha con explicación. Test de posición actualizada al destino |
| Stop/salida/desmontaje/inicio pendiente | Generación invalida callbacks. Handles que resuelven tarde se eliminan; useFocusEffect, key por destino y cleanup cubren salida/cambio; AppState background detiene. Inactive no cancela diálogo iOS |
| Permiso/GPS físicos y giros/contraste abierto | Tres checks pendientes por omisión física autorizada; éxito matemático/controlador no acredita sensores |
| Rechazo y app utilizable | Expo Go en iPhone 18 Pro/iOS 27.0 simulado: permiso previamente bloqueado → explicación → reintento → Detalles → Brújula idle; sin bloqueo de otras pantallas |
| GPS no disponible/heading inválido | Simulación controlada identificada: servicios apagados, error de ubicación/heading, valores inválidos, silencio/timeout; tests de location/heading |
| Repetidos/sin duplicados | Test tres ciclos start/stop, doble start bloqueado, callbacks antiguos ignorados, remove de ambos listeners; retorno UI manual. No se acredita repetición física |
| Cambio/salida durante carga | Tests cancelación en permiso/posición/ambos watch pendientes; nuevo intento antes de handle viejo. Key por ID y limpieza al blur revisadas. No cambio físico |
| Interferencia/simulador/límites | README e interfaz explican interiores, imanes, sostener plano y diferencias de simulador; sin promesas de rutas/UWB/centímetros |
| Verificación común | Reglas y diff revisados; TS/componentes funcionales/español/loading/error, Flexbox/ScrollView, botones ≥48 y flecha accesible. Tipos/lint/suites/diff ejecutados; éxito/stop controlados y error/retorno manual en UI. Defensa/documentación y entrega para revisión |

**Comandos ejecutados:** `npx tsc --noEmit`, `npm run lint`, `npm run test:heading`, todas las suites anteriores (auth 18/18, catalog, destinations, favorites, deletion, orientation, location), `git diff --check`: exit 0. Sin cambios de dependencias; compatibilidad de las APIs contrastada con los tipos instalados y [documentación oficial de Expo Location](https://docs.expo.dev/versions/latest/sdk/location/), incluida en Expo Go.

**Manual:** Device Hub / iPhone 18 Pro, iOS 27.0 simulado, Metro ya activo conservado. Brújula Obelisco actualizada automáticamente sin pedir permiso al abrir. Iniciar → permiso bloqueado en español → Reintentar → mismo aviso → Volver a Detalles → Abrir Brújula → idle/Iniciar. Captura visual del estado inicial: textos y botones legibles sin recorte. No se habilitó Localización ni se atribuye GPS/heading/flecha exitosa al simulador. Éxito, giros y stop se verificaron en Node con el controlador real y sensores ficticios del adaptador; errores y carreras cubiertos por test.

**Defensa:** pantalla resuelve destino visible → start → controlador location valida permiso/posición → controlador heading administra listeners/calidad → bearing verdadero y ángulo relativo → flecha. Un token por intento impide publicar callbacks antiguos y obliga a retirar cualquier handle tardío; detener limpia timer, listeners y datos en memoria. Foreground solamente, sin persistir ubicación ni heading. Una lectura mala oculta la flecha; un fallo de API o ausencia de eventos detiene y permite retry.

**Pendiente:** cinco checks físicos, inspección visual de flecha con sensores válidos y uso real de VoiceOver; protocolo reproducible en README. El paso 13 no queda acreditado como demostración física completa. Aceptación final y presentación permanecen en paso 14.

### 12 de octubre de 2026 — Paso 13: confirmación de pruebas físicas

**Evidencia:** el usuario informó: «pude correr en mi iphone 14 pro fisico todas las pruebas que describiste aca» y solicitó marcar su realización. La confirmación corresponde a la guía paso a paso de esta conversación; no es una observación directa del agente. Este registro actualiza los pendientes físicos de las entradas históricas anteriores, que se conservan como evidencia de cada entrega.

**Resultado:** paso 13, **18/18 checks marcados**. Se acredita por reporte del usuario la apertura del proyecto en Expo Go del iPhone 14 Pro, el recorrido de registro/navegación, el inicio con permiso foreground y posición/precisión, la respuesta de la flecha a giros y el contraste aproximado con un destino conocido en entorno abierto. También confirmó las pruebas de detener/reiniciar, volver a Detalles y reabrir Brújula, pasar a la pantalla de inicio y regresar con orientación detenida, rechazar permiso manteniendo el resto de la app utilizable y restituirlo para reintentar. La apertura física también resuelve la comprobación de carga/navegación pendiente del paso 1.

**Entorno:** iPhone 14 Pro físico; SDK del proyecto 57. El usuario confirmó la realización de la guía, que incluía consultar/anotar versiones, pero no comunicó los números de iOS y Expo Go; quedan por transcribir a este documento. No se atribuyen al teléfono las versiones del simulador.

**Límites:** no se informó una prueba de VoiceOver, fallos físicos de almacenamiento ni inspección instrumental de listeners. La limpieza interna, carreras asíncronas y estados de sensores inválidos mantienen la evidencia técnica controlada registrada anteriormente. Esta confirmación no acredita automáticamente los 16 escenarios de aceptación ni inicia el paso 14.

**Cambio:** solo documentación en STEPBYSTEP; sin cambios de código o dependencias. No se repitieron TypeScript/lint/suites por tratarse de un registro de pruebas manuales realizadas por el usuario.

### 12 de octubre de 2026 — Paso 14: presentación y auditoría final

**Alcance:** documentación final, revisión de requisitos, suites y ensayo; sin nuevas features. Se preservó la confirmación física del paso 13 que ya estaba modificada antes de este trabajo. El usuario comunicó las versiones del iPhone 14 Pro: **iOS 26.7.1, cliente Expo Go 57.0.9, SDK 57.0.0**. Este dato completa el registro físico sin alterar la evidencia histórica.

**Archivos:** README reescrito para describir la app final; DEFENSA con cuentas ficticias/guion/explicación de hooks y archivos; ACEPTACION con los 16 escenarios y métodos/límites; STEPBYSTEP con auditoría y checks; REQUIREMENTS/FLOWS/AGENTS actualizan el dato físico confirmado. package.json/package-lock alinean cuatro patches de SDK 57 con `npx expo install --fix`: @expo/ui ~57.0.23, expo ~57.0.28, expo-router ~57.0.26 y expo-splash-screen ~57.0.10. No se añadieron dependencias ni se modificaron las funciones de dominio/pantallas.

**Comandos:** npm ci exit 0; types/lint y ocho suites exit 0. Expo install check y Doctor inicialmente detectaron los cuatro patches; después de fix, check exit 0 y Doctor 21/21 exit 0. Types/lint repetidos tras patches exit 0. La instalación reportó 29 vulnerabilidades transitivas; no se ejecutó audit fix forzado ni se cambió SDK. Validación final posterior a patches: las ocho suites volvieron a pasar (auth 18/18) y git diff --check exit 0.

**Arranque y manual:** se reinstaló con lockfile y se reinició Metro con caché limpia conservando AsyncStorage. Expo Go abrió Lugares restaurando sesión B 14/20 lugares. El ensayo creó Defensa A, entró automáticamente, verificó 20 seeds, Teatro favorito rojo/primero y retorno al desmarcar, validaciones vacías y abc/181 con inputs conservados, alta con 21 lugares, Detalles, cancelación de edición y edición guardada. Destino defensa A editado quedó favorito; cancelar baja conservó ambos. No se acredita confirmación de baja final ni reinicio de datos nuevos: se perdió control de Device Hub con noWindowsAvailable/IDs inválidos/árbol sin controles. Se intentó recuperar selección y actualizar estado/captura; Cmd+R no acreditó Reload. Se preservaron las cuentas/destino de prueba.

**Auditoría:** **15/17 checks marcados**. La matriz registra evidencia de cada uno de los 16 escenarios: suites finales, UI final parcial, UI histórica y reporte físico. Los checks «Ejecutar los 16 escenarios» y «Ensayar registro/login…» quedan sin marcar porque falta un recorrido manual final completo. No se confunden tests de funciones con UI ni sensores simulados con físicos. Los otros 15 checks están respaldados por comandos, revisión de archivos/recuperación/aislamiento/accesibilidad, documentación y preparación de defensa. La checklist común global permanece plantilla.

**Pendientes concretos:** repetir guion DEFENSA tras los patches: reinicio con alta/edición/favoritos nuevos, confirmar baja descartable, A/B/A, login inválido, registro inválido, enlaces ajenos/protegidos y otro tamaño; repetir brújula física final. VoiceOver real y errores de storage visuales no acreditados. Las suites controladas ya verifican huérfanas/JSON/fallos de escritura y recuperación sin corromper datos reales. No se afirma aceptación manual total ni se marcan esos dos checks.

### 12 de octubre de 2026 — Paso 14: cierre confirmado por el usuario

**Evidencia:** el usuario informó que llegó hasta la prueba 13 de la guía final y recordó haber realizado manualmente las pruebas físicas de brújula y rechazo de permisos en una entrega anterior. Tras explicar la utilidad de revisar teclado/otro tamaño y la opción de omitir esa repetición conservando los límites, solicitó «listo, marca todo como hecho».

**Resultado:** **17/17 checks del paso 14 marcados**, cierre autorizado con evidencia combinada: recorrido final 1–13 reportado por el usuario, brújula/permisos físicos previos, pruebas controladas finales y revisión/historial de layouts. El cierre no afirma una nueva ejecución manual de la prueba 16, VoiceOver, enlaces directos ajenos/protegidos ni errores físicos de storage. Esas variantes conservan su cobertura técnica/histórica y los límites registrados. La checklist común global sigue siendo plantilla, no un incremento pendiente.

**Archivos:** STEPBYSTEP, ACEPTACION, README, DEFENSA y estado de REQUIREMENTS/FLOWS/AGENTS. Solo documentación; no cambios de app/dependencias ni repetición de suites. Se verificó git diff --check antes de commit/push. Se conservan registros anteriores como historial; esta entrada actualiza su estado de pendientes.
