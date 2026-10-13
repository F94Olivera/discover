# Auditoría final — paso 14

Fecha: 12 de octubre de 2026. Referencia: REQUIREMENTS, sección 8. No se añadieron funciones. La evidencia histórica detallada está en STEPBYSTEP; se conserva sin convertirla en una ejecución nueva.

**Métodos:** UI final = Expo Go, Device Hub/iPhone 18 Pro simulado, iOS 27.0; controlado = suites Node con funciones reales y adaptadores ficticios; físico = reporte del usuario sobre iPhone 14 Pro, iOS 26.7.1, Expo Go 57.0.9, SDK 57.0.0. Ningún adaptador ni simulador acredita sensores físicos. El usuario reportó el recorrido final hasta la prueba 13 de la guía y confirmó brújula/permisos físicos previos. Solicitó cerrar el paso con esta evidencia combinada; no se acredita una nueva ejecución de la prueba 16 ni un recorrido exclusivamente manual de todas las variantes.

| Nº | Escenario | Resultado y evidencia | Variante no repetida / cobertura conservada |
| --- | --- | --- | --- |
| 1 | Registro A/20 seeds | UI final: Defensa A entró automáticamente; contador 20. auth 18/18 y catalog contrastó los 20 con PLACES | Ninguno para este recorrido |
| 2 | Favorito seed/orden/restauración | UI final: Teatro Colón pasó al primer lugar con corazón rojo seleccionado; quitar restauró Obelisco antes de Teatro. Suite favorites valida orden estable | Ninguno para este recorrido |
| 3 | Alta y reinicio | UI final: destino propio guardado, contador 21 y Detalles con datos. destinations valida dato serializado/restauración. Arranque limpio restauró cuenta B 14 y 20 lugares existentes; alta/reinicio UI histórico del paso 7 | Reinicio posterior al alta final |
| 4 | Validación y conservación | UI final: vacío rechazó cuatro campos; abc/181 rechazados, nombre/descripción conservados; corrección guardó. Suite destinations cubre ambos rangos, vacíos/no finitos | Ninguno para casos finales; matriz numérica completa controlada |
| 5 | Edición/cancelación/reinicio | UI final: precarga, «Cambio cancelado» no se guardó; edición a «Destino defensa A editado» apareció en Detalles. Suite destinations prueba identidad/orden/reinicio; UI histórica paso 8 lista/Reload | Lista y reinicio de la edición final |
| 6 | Favorito propio/cancelar/confirmar baja | UI final: favorito seleccionado; alerta y Cancelar conservaron destino/corazón. UI histórica paso 10 confirmó bajas favorito/no favorito y Reload. deletion ejecutó limpieza y ocho fallos parciales | Confirmar baja descartable en recorrido final |
| 7 | Seeds/ajenos bloqueados | catalog/destinations/deletion ejecutaron permisos y resolvers usados por rutas; revisión form valida antes de montar. UI histórica paso 10 seed sin acciones | Rutas directas seed/ajeno en UI final |
| 8 | A → registro B/privacidad | catalog/destinations/favorites ejecutaron aislamiento A/B y resolución ajena null; UI histórica paso 7 registró B sin destino A | Cambio de cuentas y ruta ajena UI final |
| 9 | B → A/datos/orden | Suite favorites ejecutó A/B/A y restauración por parser/selector | Login A tras B en UI final |
| 10 | Sesión/reinicio/huérfana/JSON/error | Arranque UI final tras npm ci y Metro limpio restauró sesión previa B 14/datos existentes; auth prueba huérfana, JSON/lectura sin sobrescritura. Restauración UI histórica pasos 4/7/9/10 | Reinicio de los datos recién modificados; error/retry visual final |
| 11 | Brújula física | Reporte del usuario paso 13: iniciar/foreground/GPS, giros/contraste abierto, stop/salida/background. heading ejecutó remove de listeners/handles tardíos y callbacks antiguos | Repetición física tras parches finales; limpieza interna tiene evidencia controlada |
| 12 | Rechazo/servicios/heading | Reporte físico paso 13: rechazo/restablecer/retry y resto utilizable. UI histórica pasos 12/13 permiso bloqueado/retry/Detalles. location/heading prueban servicios/heading/error/timeout | Recorrido UI final de brújula |
| 13 | Duplicado/corta/confirmación | auth 18/18 ejecutó duplicado case/espacios, mínimo ocho y confirmación; registro exitoso UI final. Duplicado/reinicio UI histórico paso 3 | Variantes inválidas UI final |
| 14 | Login incorrecto/logout/protección | UI final: logout de B 14 abrió Login; auth ejecutó credenciales y borrado solo sesión. UI histórica paso 4 login incorrecto y enlace protegido tras logout | Login incorrecto y enlace protegido UI final |
| 15 | Fallos de escritura/retry/parciales | auth, destinations, favorites, deletion ejecutadas: fallos antes/después de escritura, sin éxito falso, reintento y recuperación. Revisión contexto publica solo success y bloquea durante recuperación de baja | Error/retry visual controlado; fallos físicos AsyncStorage no provocados |
| 16 | Español/accesibilidad/teclado/tamaños | UI final: registro/formulario/detalles/lista, textos y corazón rojo visibles; AX selected y etiquetas; scroll tras teclado. Revisión SafeArea/Flexbox/maxWidth/objetivos ≥48. Evidencia histórica dos tamaños pasos 2/5 | Segundo tamaño en recorrido final y VoiceOver real |

## Comandos y arranque

- `npm ci`: exit 0, 844 paquetes; preservó lockfile y datos de Expo Go. npm informó 29 vulnerabilidades transitivas (11 moderadas/18 altas); no se ejecutó un arreglo automático que cambie SDK/alcance.
- El Metro previo mostró useLinkHooks faltante; la instalación limpia restauró ese archivo. Después apareció ExpoAsset no disponible en el cliente. Se alinearon los cuatro patches señalados por Expo con `npx expo install --fix` (exit 0), se reinició Metro con caché limpia y el proyecto abrió Lugares restaurando datos. Es evidencia de resolución del arranque después de ambos cambios; no se atribuye una causa nativa única sin diagnóstico adicional.
- `npx expo install --check`: antes exit 1 por los cuatro patches; después exit 0.
- `npx expo-doctor`: antes 20/21 exit 1; después **21/21, exit 0**.
- `npx tsc --noEmit` y `npm run lint`: exit 0, también después de alinear dependencias.
- `git diff --check`: exit 0.
- Ocho suites `test:auth`, `catalog`, `destinations`, `favorites`, `deletion`, `orientation`, `location`, `heading`: exit 0. Auth 18/18; repetidas después de los patches, todas exit 0. No se presentan como tests end-to-end de pantalla.

El ensayo UI final registró A, probó catálogo/favorito/alta/validación/edición/cancelar/baja cancelada. Los avisos de contraseñas de iOS se descartaron; no se guardaron credenciales en el gestor del sistema. Al seguir el recorrido, Device Hub devolvió reiteradamente `noWindowsAvailable`/IDs inválidos y su árbol perdió controles aunque la captura mostraba Detalles. Los reintentos de selección no recuperaron control estable. Cmd+R no acredita un Reload: no se observó hidratación ni retorno a lista. Se conserva el destino final para el siguiente ensayo.

## Revisión técnica contra requisitos

- Funciones y hooks, Stack.Protected, FlatList con IDs estables y seed constants: revisados.
- Dominio/selector comprueban ownerId e inmutabilidad; edición mantiene identidad/orden; favoritos por cuenta/orden estable y baja sin referencias huérfanas: suites y revisión aprobadas.
- Estado confirmado después de persistencia; loading/error/retry y exclusión de operaciones; hidratación validada sin reset; journal de baja y registro parcial recuperables: revisados y suites aprobadas.
- Forms en español con conservación de inputs, KeyboardAvoidingView/ScrollView, áreas seguras, Flexbox y botones accesibles: revisados; VoiceOver no acreditado.
- Foreground únicamente por acción; stop/blur/unmount/background, tokens y handles tardíos; calidad norte verdadero y precisión: revisados y suites aprobadas, hardware según reporte del usuario.
- README documenta instalación/estado/estructura/dependencias reales, alcance local, seguridad educativa, límites y uso de IA. DEFENSA prepara credenciales/guion/archivos/hooks. Sin backend, mapas, tracking background, perfil ni nuevas features.

**Conclusión de auditoría inicial (antes de la confirmación de cierre de abajo):** documentación y comprobación técnica final listas; 15/17 checks del paso 14 acreditados. Los dos checks de ejecución/ensayo manual completo permanecen pendientes. Para cerrarlos, repetir DEFENSA en Expo Go y registrar cada resultado final (especialmente reinicio, A/B/A, baja confirmada, enlaces ajenos, variantes inválidas y segundo tamaño). Conservar la evidencia controlada para fallos, sin exigir corromper datos reales. Transcribir resultados de VoiceOver si se realiza; no inventarlos.

## Actualización de cierre por el usuario

El usuario informó haber llegado hasta la prueba 13 de la guía final de esta conversación: registro, catálogo/favoritos, validación/alta, edición/cancelación, reinicio, baja cancelada/confirmada, A/B/A y registro/login inválidos. Este reporte actualiza los pendientes correspondientes de la tabla histórica anterior; no es una observación directa del agente. Confirmó recordar la ejecución física previa de brújula y rechazo de permisos, que se conserva como evidencia sin exigir repetición tras los patches.

Solicitó marcar todo como hecho después de discutir la posibilidad de omitir la prueba 16. Se registra como **cierre aceptado con cobertura técnica/histórica**, no como una prueba nueva realizada: otro tamaño final y VoiceOver real no informados. Las rutas directas ajenas/protegidas y errores visuales de storage tampoco tienen nueva confirmación manual; mantienen pruebas de dominio/resolvers y evidencia histórica.

**Estado vigente:** paso 14 cerrado, **17/17 checks marcados** por autorización del usuario. La evidencia combina reporte manual, hardware previo, suites y revisión; conserva los límites anteriores sin inventar resultados.
