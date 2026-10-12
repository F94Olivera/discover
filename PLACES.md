# PLACES.md — Catálogo de Buenos Aires

Selección confirmada para el TP: **20 lugares históricos, monumentos y sitios culturales emblemáticos de la Ciudad Autónoma de Buenos Aires**. Se incluyen Floralis Genérica y Puente de la Mujer como hitos contemporáneos.

## Coordenadas y fuentes

Coordenadas consultadas el **11 de octubre de 2026** en las fichas de Wikipedia enlazadas en cada fila. Se convirtieron las coordenadas publicadas en grados/minutos/segundos a grados decimales, redondeadas a seis decimales. Son puntos de referencia del lugar, no entradas verificadas ni posiciones relevadas en campo. El redondeo no implica precisión de GPS de seis decimales; son adecuadas como referencia para orientación aproximada.

Sistema geográfico: WGS84; orden **latitud, longitud**. Ambos valores son negativos por estar al sur y al oeste. No se usaron coordenadas de paradas de colectivos como sustituto del lugar.

| Orden | ID estable | Lugar | Latitud | Longitud | Fuente de coordenadas |
| --- | --- | --- | --- | --- | --- |
| 1 | seed-01 | Obelisco | -34.603889 | -58.381667 | [Ficha](https://es.wikipedia.org/wiki/Obelisco_de_Buenos_Aires) |
| 2 | seed-02 | Teatro Colón | -34.601111 | -58.383056 | [Ficha](https://es.wikipedia.org/wiki/Teatro_Col%C3%B3n) |
| 3 | seed-03 | Floralis Genérica | -34.583056 | -58.393333 | [Ficha](https://es.wikipedia.org/wiki/Floralis_Gen%C3%A9rica) |
| 4 | seed-04 | Torre Monumental (Torre de los Ingleses) | -34.593056 | -58.373056 | [Ficha](https://es.wikipedia.org/wiki/Torre_Monumental) |
| 5 | seed-05 | Monumento de los Españoles | -34.575000 | -58.415278 | [Ficha](https://es.wikipedia.org/wiki/Monumento_de_los_espa%C3%B1oles) |
| 6 | seed-06 | Plaza de Mayo | -34.608333 | -58.371944 | [Ficha](https://es.wikipedia.org/wiki/Plaza_de_Mayo) |
| 7 | seed-07 | Pirámide de Mayo | -34.608889 | -58.372222 | [Ficha](https://es.wikipedia.org/wiki/Pir%C3%A1mide_de_Mayo) |
| 8 | seed-08 | Casa Rosada | -34.608056 | -58.370278 | [Ficha](https://es.wikipedia.org/wiki/Casa_Rosada) |
| 9 | seed-09 | Cabildo de Buenos Aires | -34.608889 | -58.373889 | [Ficha](https://es.wikipedia.org/wiki/Cabildo_de_Buenos_Aires) |
| 10 | seed-10 | Catedral Metropolitana | -34.607500 | -58.373333 | [Ficha](https://es.wikipedia.org/wiki/Catedral_Metropolitana_de_Buenos_Aires) |
| 11 | seed-11 | Palacio del Congreso de la Nación Argentina | -34.610000 | -58.392778 | [Ficha](https://es.wikipedia.org/wiki/Palacio_del_Congreso_de_la_Naci%C3%B3n_Argentina) |
| 12 | seed-12 | Palacio Barolo | -34.609444 | -58.385833 | [Ficha](https://es.wikipedia.org/wiki/Palacio_Barolo) |
| 13 | seed-13 | Café Tortoni | -34.608889 | -58.378333 | [Ficha](https://es.wikipedia.org/wiki/Caf%C3%A9_Tortoni) |
| 14 | seed-14 | Palacio de Aguas Corrientes | -34.600556 | -58.395000 | [Ficha](https://es.wikipedia.org/wiki/Palacio_de_Aguas_Corrientes) |
| 15 | seed-15 | Cementerio de la Recoleta | -34.588056 | -58.393056 | [Ficha](https://es.wikipedia.org/wiki/Cementerio_de_la_Recoleta) |
| 16 | seed-16 | Basílica de Nuestra Señora del Pilar | -34.586667 | -58.391944 | [Ficha](https://es.wikipedia.org/wiki/Bas%C3%ADlica_de_Nuestra_Se%C3%B1ora_del_Pilar_%28Buenos_Aires%29) |
| 17 | seed-17 | Monumento al General San Martín y a los Ejércitos de la Independencia | -34.595000 | -58.377222 | [Ficha](https://es.wikipedia.org/wiki/Monumento_al_General_San_Mart%C3%ADn_y_a_los_Ej%C3%A9rcitos_de_la_Independencia) |
| 18 | seed-18 | Manzana de las Luces | -34.610556 | -58.374444 | [Ficha](https://es.wikipedia.org/wiki/Manzana_de_las_Luces) |
| 19 | seed-19 | Buque Museo Fragata Presidente Sarmiento | -34.608944 | -58.365667 | [Ficha](https://es.wikipedia.org/wiki/ARA_Presidente_Sarmiento) |
| 20 | seed-20 | Puente de la Mujer | -34.608056 | -58.365000 | [Ficha](https://es.wikipedia.org/wiki/Puente_de_la_Mujer) |

## Uso en la aplicación

- Este orden será el orden base del catálogo; los IDs no deben cambiar al ordenar la lista.
- La aplicación tendrá exactamente estos 20 destinos predefinidos en código fuente, con descripciones breves en español. Este documento registra la selección y sus coordenadas; no implementa todavía el catálogo.
- Los favoritos del usuario activo aparecen primero, manteniendo el orden base dentro del grupo; los restantes conservan también su orden base.
- Los destinos propios se agregan después de los predefinidos en el orden base, por orden de creación. También pueden marcarse como favoritos.
- Quitar un favorito devuelve el destino a su posición relativa en el grupo no favorito.
- Los datos se incluirán en el bundle: la app no consultará Wikipedia ni mapas en tiempo de ejecución.
