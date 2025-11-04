# 🎃 El Huerto de Calabazas

Implementación en **React + TypeScript + Vite** del problema *"máximo sub-array contiguo"* (Kadane) por *Gonzalo Muñoz Quintero*. Incluye dos modos:
- **Modo Clásico**: devuelve la ganancia máxima (O(n)).
- **Modo Visual**: devuelve ganancia + índices (O(n)) y permite listar todos los sub-arrays (O(n²)).
- **Tests** con Vitest y medición sencilla en UI.


## Cómo ejecutar (Windows)
1. Instalar dependencias:
   ```
   npm install
   ```
2. Levantar app:
   ```
   npm run dev
   ```
3. Ejecutar tests:
   ```
   npx vitest
   ```

## Estructura relevante
- src/AppHuerto.tsx — lógica, UI y Kadane (clásico y visual).
- src/AppHuerto.css — estilos.
- src/App.test.tsx — tests con Vitest.
- package.json — scripts npm.

## ¿Por qué a veces las mediciones salen `0.0000 ms`?

- El algoritmo de Kadane es muy eficiente (O(n)) y para arrays pequeños/medianos (p. ej. 150 elementos) una sola ejecución puede ser extremadamente rápida.
- `performance.now()` tiene resolución limitada por el navegador y, por motivos de privacidad/seguridad, puede estar restringido o redondeado. Eso hace que mediciones individuales por debajo de esa resolución aparezcan como 0.
- Si la medición se hace una sola vez (una ejecución) es más probable que caiga por debajo de la resolución; además React/useMemo puede evitar ejecutar la función si las dependencias no cambian, dando tiempos 0 en las siguientes llamadas.
- La sobrecarga de la UI, re-renderes y el event loop introducen ruido en mediciones muy pequeñas.

## Tests y verificación
- Vitest está preconfigurado. Los tests comprueban:
  - **Funcionamiento correcto del algoritmo clásico** (ganancia esperada).
  - **Funcionamiento correcto del modo visual** (ganancia, índices inicio/fin).
  - **Construcción correcta del sub-array ganador** a partir de los índices.
- Para añadir nuevos testCases edita src/App.test.tsx (o el archivo de tests correspondiente).

## Autor

Gonzalo Muñoz Quintero

## Licencia

Este repositorio se distribuye bajo la licencia:

Creative Commons Attribution‑NonCommercial 4.0 International (CC BY‑NC 4.0)

- Permiso para usar, compartir y adaptar el material siempre que:
  - se dé crédito adecuado al autor (mención clara en la documentación o en el producto derivado), y
  - no se use el material para fines comerciales.
- Para detalles legales y el texto completo de la licencia, ver:
  https://creativecommons.org/licenses/by-nc/4.0/

Ejemplo de atribución recomendada (añadir en tu README o doc del proyecto que use este código):
> "El Huerto de Calabazas" — implementación por Gonzalo Muñoz Quintero, disponible bajo CC BY‑NC 4.0. https://github.com/gmqdev/reto-huerto-calabazas

Copyright © 2025 Gonzalo Muñoz Quintero • CC BY‑NC 4.0