\# Proyecto: Padrón web y fichas de afiliación



\## Objetivo general

Crear una aplicación web responsive, pensada principalmente para celular, para consultar un padrón de afiliados y registrar fichas de afiliación en trámite.



\## Hosting inicial

La aplicación se desplegará inicialmente en Netlify, en una versión gratuita.



\## Enfoque inicial

\- Primera versión sin usuarios ni login.

\- Primera versión orientada a prueba simple.

\- Primera versión leyendo datos desde un archivo CSV.

\- Más adelante se podrá escalar a base de datos online y múltiples usuarios.



\## Archivo inicial del padrón

El padrón se leerá desde un archivo CSV ubicado en la carpeta `data/padron.csv`.



\### Columnas actuales del CSV

\- Localidad

\- Circuito

\- Apellido

\- Nombre

\- Genero

\- DNI

\- Fecha nacimiento

\- Fecha afiliacion

\- Domicilio



\## Módulo 1: Consulta de padrón

La aplicación debe permitir buscar personas por:
- Apellido
- DNI



La búsqueda debe ser simple, rápida y pensada para celular.



\## Resultados

Los resultados deben mostrarse en formato de tarjetas visuales.



Cada tarjeta debe mostrar principalmente:

\- Apellido

\- Nombre

\- DNI

\- Domicilio

\- Localidad

\- Fecha afiliacion

\- Antigüedad calculada a partir de la fecha afiliacion



Datos secundarios que pueden quedar disponibles para detalle futuro:

\- Circuito

\- Genero

\- Fecha nacimiento



\## Diseño visual

\- Estilo limpio y moderno

\- Formato de tarjetas

\- Paleta principal:

&#x20; - rojo

&#x20; - blanco

&#x20; - negro o gris oscuro para contraste

\- Diseño responsive para celular



\## Módulo 2: Fichas de afiliación

Debe existir una segunda sección o pantalla para fichas de afiliación.



No es necesario completarla totalmente en la primera etapa, pero la estructura debe quedar prevista.



Datos posibles de la ficha:

\- Apellido

\- Nombre

\- DNI

\- Domicilio

\- Localidad

\- Fecha de carga o afiliación

\- Referente

\- Ficha completa

\- Ficha firmada

\- Ficha enviada o notificada a provincia



La información de fichas debe almacenarse separada del padrón.



\## Búsqueda cruzada

A futuro, si una persona no aparece en el padrón, el sistema debe poder buscar también en fichas e informarlo claramente.



\## Exportación

A futuro, debe quedar prevista la posibilidad de exportar una tarjeta individual:

\- PDF

\- PNG o JPG



\## Versión 1

La primera versión debe incluir:

\- pantalla principal de búsqueda

\- lectura del archivo CSV del padrón

\- búsqueda por apellido o DNI

\- resultados en tarjetas

\- diseño responsive

\- estructura preparada para futura sección de fichas

