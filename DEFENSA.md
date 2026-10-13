# Guía de defensa y ensayo

## Preparación

Ejecutar `npm ci` y `npx expo start`; abrir en Expo Go. Usar únicamente datos ficticios. No borrar las cuentas/datos previos. Si un correo ya existe, ingresar o usar un sufijo nuevo y anotarlo.

| Cuenta | Nombre | Correo | Contraseña de prueba |
| --- | --- | --- | --- |
| A | Defensa A | defensa.a@example.test | TurismoA14! |
| B | Defensa B | defensa.b@example.test | TurismoB14! |

En el ensayo final se registró A en el simulador, se creó «Destino defensa A» y se editó a «Destino defensa A editado», descripción «Lugar ficticio para practicar CRUD.», latitud -34.6037, longitud -58.3816. Es un dato de demostración con coordenadas del ejemplo del formulario, no un lugar turístico nuevo verificado. Quedó favorito y sin eliminar: cancelar la baja conservó el dato. B está preparada como credencial de guion; su registro final no se acredita. Los datos no se distribuyen con el repo ni se insertan automáticamente.

## Recorrido para ensayar (10–15 minutos)

1. Registrar A; explicar normalización del correo, contraseña mínima/confirmación, hash educativo y entrada automática. Ver 20 seeds antes del alta. Probar correo duplicado con mayúsculas/espacios, contraseña corta y confirmación diferente.
2. En Lugares, marcar Teatro Colón: corazón rojo y movimiento al grupo favorito. Quitar: vuelve al orden base. Aclarar que se guarda antes de confirmar el corazón y que tocar el corazón no abre Detalles.
3. Abrir Obelisco: datos/solo lectura, sin editar ni eliminar. Abrir formulario vacío y enviar; mostrar validaciones. Crear destino propio con los datos de arriba; comprobar 21 lugares.
4. Editar nombre, cancelar y comprobar que no cambió. Reabrir, editar/guardar y comprobar Detalles/lista. Recargar desde menú de Expo Go; verificar sesión, nombre editado y favoritos. Para cierre completo del proceso, terminar y reabrir Expo Go y cargar el proyecto: no confundirlo con Reload.
5. Marcar el destino propio favorito, abrir eliminar y cancelar. Confirmar su eliminación solo si fue identificado expresamente como dato descartable del ensayo; comprobar retorno a lista, ausencia del destino y favorito. La referencia interna también se valida con `test:deletion`.
6. Dejar otro destino propio de A y un seed favorito. Cerrar sesión, registrar B y comprobar 20 seeds sin los datos/favoritos de A. Cerrar B e ingresar A; verificar datos restantes y orden. Ingresar contraseña incorrecta y comprobar error genérico. Tras logout, Atrás/enlace privado no debe abrir pantallas protegidas.
7. En el iPhone físico, abrir Brújula sin prompt; iniciar y conceder foreground. Sostener plano en espacio abierto, rotar y contrastar aproximadamente la flecha. Detener/iniciar, volver a Detalles, abrir otro destino, pasar a background y regresar detenido. Rechazar permiso debe mostrar explicación/reintento y permitir volver. Evitar volver a pedir permiso bloqueado; restituirlo en Ajustes.
8. Explicar los fallos de storage y sensores con las suites controladas y sus resultados; no corromper la instalación de la demo. Mostrar la matriz ACEPTACION y distinguir evidencia física, simulada y pendiente.

## Explicación del código

Seguir pantalla → contexto → servicio → storage → resultado confirmado. La navegación está en `src/app/_layout.tsx`; FlatList y keyExtractor están en `places.tsx`. El catálogo constante está en `src/data/defaultDestinations.ts` y el filtrado por ownerId en `selectors.ts`. El orden de favoritos particiona sin alterar el orden base.

Validación de registro/login está en `src/features/auth/validation.ts`; la de destinos en `creation.ts` y se reutiliza al editar. La UI traduce resultados discriminados success/invalid/error a navegación o feedback. El dominio rechaza seeds y propietarios ajenos aunque alguien intente saltarse la UI.

`AuthProvider` comparte sesión y colecciones; no se duplican entidades en Detalles. El bloqueo ref serializa operaciones, y la UI tiene pending. Se hidratan y validan datos antes de habilitar el Stack; no se escriben seeds en AsyncStorage. Una baja multiclave usa `tourism.deletion.v1`: no hay una transacción física de AsyncStorage, sino recuperación que completa la misma baja antes de habilitar acciones.

Hooks: `useState` rerenderiza; `useRef` conserva servicios, bloqueo y flag montado; `useEffect([loadAttempt])` permite reintentar hidratación y su cleanup ignora resultados viejos. `useCallback` mantiene acciones con dependencias de sesión/datos; no se omiten dependencias para forzar estabilidad. El formulario usa inicializador y key por destino, sin resetear inputs tras cada cambio global.

Brújula: la pantalla resuelve un destino visible, conserva controlador con `useMemo`, limpia al perder foco y observa AppState. `location.ts` gestiona permiso/posición; `heading.ts` valida calidad y administra ambos listeners; `orientation.ts` calcula bearing verdadero y resta heading verdadero. Tokens invalidan callbacks y retiran handles tardíos, incluso si start seguía pendiente. No hay subscriptions al abrir ni permiso background. Interferencia, precisión y cercanía limitan el resultado.

## Preguntas frecuentes

- **¿Hay backend?** No; cuentas/datos viven en AsyncStorage de esta instalación y no se sincronizan.
- **¿Es autenticación segura de producción?** No; salt + SHA-256 es educativo y se usan credenciales ficticias.
- **¿Por qué Expo Router?** Ya estaba instalado y provee Stack, rutas y protección declarativa sin agregar otro sistema.
- **¿Qué pasa si falla una escritura?** Se informa error y se conserva estado confirmado; reintento/restauración consulta lo persistido. Registro parcial y baja tienen recuperación explícita.
- **¿Es GPS suficiente?** GPS obtiene posición; heading da orientación del teléfono. Son necesarios ambos y norte coherente para el ángulo relativo.
- **¿Por qué un iPhone físico?** El simulador no acredita sensor real. El usuario confirmó el paso 13 en iPhone 14 Pro/iOS 26.7.1/Expo Go 57.0.9.
- **¿Está todo validado manualmente al final?** No. Consultar ACEPTACION: se ejecutaron suites y parte del recorrido final; la herramienta perdió control de Device Hub. Falta repetir el guion completo tras los parches y VoiceOver real.
