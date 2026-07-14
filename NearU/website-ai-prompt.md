# Prompt para Claude/Cowork

Construye un website corporativo premium, moderno y completamente responsive para **NEARU Market**, una empresa de mercados autónomos para edificios residenciales en Panamá.

## Objetivo

Convencer a administradores de PH, promotores y desarrolladores de incorporar NEARU como una amenidad del edificio. El sitio debe generar solicitudes de evaluación comercial; no es un ecommerce para consumidores.

## Dirección visual

- Estética de arquitectura, hospitalidad y tecnología residencial ultra premium.
- Paleta: verde bosque `#123B32`, marfil `#F4EFE5`, carbón `#171B1A`, lima `#B8E34A` y musgo `#739B2E`.
- Tipografía: Manrope.
- Mucho espacio negativo, grilla editorial de 12 columnas, jerarquía tipográfica amplia, bordes discretos y animaciones suaves.
- Evitar apariencia de supermercado económico, startup de neón o compañía de seguridad.
- Usar el logo SVG horizontal en el encabezado y el favicon proporcionado.

## Nivel visual obligatorio: ultra premium

El website no debe parecer una plantilla de startup, una web de franquicias ni un catálogo de supermercado. Debe sentirse como la presentación digital de una nueva amenidad dentro de un proyecto inmobiliario de alto nivel en Punta Pacífica, Santa María o Costa del Este.

Trata a NEARU como una marca de arquitectura y hospitalidad residencial que utiliza tecnología, no como una empresa tecnológica que vende góndolas.

- Usa fotografías arquitectónicas grandes, con secciones a pantalla completa y encuadres generosos.
- Mantén aproximadamente 60–70 % de cada composición visual libre de ruido.
- Utiliza el verde lima únicamente en pequeños puntos de atención, nunca como grandes fondos.
- Alterna fondos marfil, verde bosque profundo y carbón con transiciones limpias.
- Emplea titulares grandes, pocas palabras y textos secundarios con excelente ritmo y legibilidad.
- Presenta los cuatro formatos como una colección arquitectónica: `Mini`, `Lobby`, `Container 20 FT` y `Container 40 FT`.
- Cada formato debe tener una imagen protagonista, medida claramente indicada y una descripción muy breve.
- Usa detalles sutiles: líneas finas, numeración editorial, etiquetas pequeñas y movimientos lentos.
- Permite que el logo y las imágenes sean los elementos dominantes.
- El CTA debe sentirse como una invitación privada a evaluar el edificio, no como una promoción comercial.

Evita específicamente:

- tarjetas blancas genéricas repetidas en toda la página;
- sombras fuertes, gradientes llamativos o efectos de vidrio excesivos;
- íconos de carrito, monedas, robots, cerebros de IA, escudos o cámaras como decoración;
- contadores o cifras sin respaldo;
- fotografías pequeñas dentro de marcos innecesarios;
- bloques densos de texto;
- carruseles automáticos;
- botones enormes o demasiados CTA compitiendo entre sí;
- ilustraciones de stock, emojis o renders tecnológicos futuristas;
- una apariencia económica, juvenil o de tienda de conveniencia.

El resultado debe comunicar exclusividad, calma, confianza, precisión operacional y valor inmobiliario.

## Referencias brasileñas de mercado

Analiza estos websites únicamente como referencias de categoría, recorrido comercial y contenido:

- `https://market4u.com.br`
- `https://honestmarketbrasil.com.br`

De Market4u, toma únicamente como referencia la claridad con la que separa la propuesta para condominios, explica beneficios, abastecimiento, seguridad, funcionamiento y preguntas frecuentes, además de ubicar llamadas a la acción en puntos naturales del recorrido.

De Honest Market Brasil, toma como referencia la variedad de contextos de instalación, la galería de puntos de venta y la explicación sencilla del concepto autónomo.

No copies su diseño, textos, fotografías, identidad, estructura exacta ni afirmaciones comerciales. No presentes a NEARU como franquicia. No incluyas cifras de tiendas, clientes, productos, payback, inversión, rentabilidad, tiempos de instalación o “costo cero” que pertenezcan a esas empresas o que no hayan sido comprobadas para NEARU.

No uses ninguno de estos dos websites como referencia estética. La interpretación NEARU debe ser considerablemente más breve, arquitectónica, exclusiva y sofisticada: menos densidad visual, más espacio negativo, fotografías protagonistas, cuatro formatos claramente diferenciados y una única conversión principal dirigida a administradores, juntas directivas, promotores y constructores de PH en Panamá.

## Estructura

1. Header fijo y sobrio.
2. Hero con el título “Tu mercado, donde vives.”
3. Presentación de NEARU como amenidad.
4. Colección de cuatro formatos, presentada editorialmente y sin una cuadrícula genérica de tarjetas:
   - Mini, aproximadamente 8 m².
   - Lobby, recomendado entre 14 y 20 m².
   - Container 20 FT, aproximadamente 14 m².
   - Container 40 FT, aproximadamente 28 m².
5. Sección “Cómo funciona” en tres pasos.
6. Beneficios para el PH.
7. Tecnología y seguridad.
8. Galería de formatos y referencias internacionales en Brasil, claramente identificadas como referencias y no como proyectos de NEARU.
9. Preguntas frecuentes.
10. CTA final y formulario de contacto.
11. Footer con correos y enlaces legales.

Usa exactamente los textos de `website-copy.md`, editando solamente repeticiones menores necesarias para el diseño.

## Imágenes

Implementa cada fotografía mediante `<picture>`, cargando WebP primero y JPG como fallback. Usa `object-fit: cover`, conserva el foco arquitectónico y no cortes el logo de las tiendas.

- Hero y sección Lobby: `images/full/nearu-lobby-14-20m2.webp`
- Tarjeta Mini: `images/full/nearu-mini-8m2.webp`
- Tarjeta Container 20 FT: `images/full/nearu-container-20ft-14m2.webp`
- Tarjeta Container 40 FT: `images/full/nearu-container-40ft-28m2.webp`
- Referencias internacionales: archivos WebP dentro de `images/referencias-brasil/`

La imagen hero debe cargarse de inmediato. El resto debe usar lazy loading. Incluye dimensiones para evitar layout shift.

## Interacciones

- Navegación con desplazamiento suave.
- CTA principal “Quiero NEARU en mi edificio”.
- Selector de formato dentro del formulario.
- Estados accesibles de hover y focus.
- FAQ tipo acordeón accesible.
- Animaciones de entrada mínimas, respetando `prefers-reduced-motion`.

## Formulario

Campos: nombre, empresa/administración, edificio, número de unidades, ubicación, formato, teléfono, correo y mensaje. Validación clara. Enviar inicialmente a `ventas@nearu.market` y mostrar confirmación sin abandonar la página.

## Requisitos técnicos

- Diseño mobile-first.
- Excelente rendimiento y accesibilidad.
- HTML semántico, títulos jerárquicos y metadatos SEO.
- Open Graph con la imagen del lobby.
- No inventar cifras, testimonios, clientes, cantidad de tiendas, inversionistas, casos de éxito o proveedores tecnológicos.
- No usar reconocimiento facial.
- No incluir precios ni promesas de rentabilidad.
- Preparar el sitio para español; no crear traducción automática por ahora.

## SEO

Título: `NEARU Market | Mercados autónomos para edificios en Panamá`

Descripción: `Mercados autónomos premium para edificios residenciales en Panamá. Formatos Mini, Lobby y containers exteriores de 20 y 40 pies.`

## Resultado esperado

Entregar un website visualmente impactante pero creíble, con acabados propios de una firma internacional de arquitectura y hospitalidad residencial. Debe sentirse diseñado a medida para NEARU, nunca derivado de una plantilla. En menos de 20 segundos, un administrador o constructor debe comprender el concepto, percibirlo como una amenidad de alto nivel y querer solicitar una evaluación privada para su edificio.
