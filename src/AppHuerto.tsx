import { useState, useMemo } from "react";
import "./AppHuerto.css";
import type { JSX } from "react/jsx-runtime";

interface ResultadoGanancia {
  ganancia: number;
  inicio: number;
  fin: number;
}

/**
 * Algoritmo de Kadane MODIFICADO (Versión Visual).
 * Devuelve un objeto con la ganancia, el inicio y el fin para la UI.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function encontrarMaximaGananciaVisual(
  parcelas: number[]
): ResultadoGanancia {
  if (!parcelas || parcelas.length === 0) {
    return { ganancia: 0, inicio: 0, fin: -1 };
  }

  let gananciaMaximaGlobal: number = parcelas[0];
  let gananciaMaximaActual: number = parcelas[0];

  let inicioGlobal: number = 0;
  let finGlobal: number = 0;
  let inicioActual: number = 0;

  for (let i = 1; i < parcelas.length; i++) {
    const parcelaActual = parcelas[i];

    if (parcelaActual > gananciaMaximaActual + parcelaActual) {
      gananciaMaximaActual = parcelaActual;
      inicioActual = i;
    } else {
      gananciaMaximaActual = gananciaMaximaActual + parcelaActual;
    }

    if (gananciaMaximaActual > gananciaMaximaGlobal) {
      gananciaMaximaGlobal = gananciaMaximaActual;
      inicioGlobal = inicioActual;
      finGlobal = i;
    }
  }

  return {
    ganancia: gananciaMaximaGlobal,
    inicio: inicioGlobal,
    fin: finGlobal,
  };
}

/**
 * Algoritmo de Kadane CLÁSICO (Versión Original).
 * Devuelve solo la ganancia máxima.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function encontrarMaximaGanancia(parcelas: number[]): number {
  if (!parcelas || parcelas.length === 0) {
    return 0;
  }

  let gananciaMaximaGlobal: number = parcelas[0];
  let gananciaMaximaActual: number = parcelas[0];

  for (let i = 1; i < parcelas.length; i++) {
    const parcelaActual = parcelas[i];

    gananciaMaximaActual = Math.max(
      parcelaActual,
      gananciaMaximaActual + parcelaActual
    );

    gananciaMaximaGlobal = Math.max(gananciaMaximaGlobal, gananciaMaximaActual);
  }
  return gananciaMaximaGlobal;
}

/**
 * String del algoritmo original para mostrar en el panel de explicación.
 */
const kadaneOriginalCodigo = `
function kadaneOriginal(arr) {
  let maxGlobal = arr[0];
  let maxActual = arr[0];

  for (let i = 1; i < arr.length; i++) {
    maxActual = Math.max(
      arr[i], 
      maxActual + arr[i]
    );
    
    maxGlobal = Math.max(
      maxGlobal, 
      maxActual
    );
  }
  return maxGlobal;
}
`.trim();

interface SubArrayInfo {
  array: number[];
  ganancia: number;
}

/**
 * Calcula todos los subarrays
 */
function calcularTodosSubarrays(parcelas: number[]): SubArrayInfo[] {
  const resultados: SubArrayInfo[] = [];
  if (!parcelas || parcelas.length === 0) {
    return resultados;
  }

  for (let i = 0; i < parcelas.length; i++) {
    let gananciaActual = 0;
    const arrayActual: number[] = [];
    for (let j = i; j < parcelas.length; j++) {
      gananciaActual += parcelas[j];
      arrayActual.push(parcelas[j]);
      resultados.push({
        array: [...arrayActual],
        ganancia: gananciaActual,
      });
    }
  }
  resultados.sort((a, b) => b.ganancia - a.ganancia);
  return resultados;
}

/**
 * Genera un número aleatorio entre min y max (incluidos)
 */
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Genera un array aleatorio de parcelas.
 */
function generarHuertoAleatorio(
  longitud: number,
  minValor: number,
  maxValor: number
): number[] {
  const huerto: number[] = [];
  for (let i = 0; i < longitud; i++) {
    // Aseguramos que no haya un 0 para que sea positivo o negativo
    let valor = 0;
    while (valor === 0) {
      valor = getRandomInt(minValor, maxValor);
    }
    huerto.push(valor);
  }
  return huerto;
}

// --- COMPONENTE PRINCIPAL DE REACT ---

export default function AppHuerto(): JSX.Element {
  const [inputStr, setInputStr] = useState<string>(
    "2, -5, 8, -2, 4, -10, 3, 1"
  );

  const [isVisualMode, setIsVisualMode] = useState<boolean>(true);

  // Parsea el input string a un array de números
  const huerto: number[] = useMemo(() => {
    return inputStr
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => parseInt(s, 10))
      .filter((n) => !isNaN(n));
  }, [inputStr]);

  // Calcula el resultado para el MODO VISUAL (solo cuando isVisualMode === true)
  const { resultado: resultadoVisual, tiempo: tiempoVisual } = useMemo(() => {
    if (!isVisualMode) {
      return {
        resultado: { ganancia: 0, inicio: 0, fin: -1 } as ResultadoGanancia,
        tiempo: 0,
      };
    }
    const t0 = performance.now();
    const resultado = encontrarMaximaGananciaVisual(huerto);
    const t1 = performance.now();
    return { resultado, tiempo: t1 - t0 };
  }, [huerto, isVisualMode]);

  // Calcula el resultado para el MODO CLÁSICO (se puede mantener siempre)
  const { ganancia: gananciaClasica, tiempo: tiempoClasico } = useMemo(() => {
    const t0 = performance.now();
    const ganancia = encontrarMaximaGanancia(huerto);
    const t1 = performance.now();
    return { ganancia, tiempo: t1 - t0 };
  }, [huerto]);

  // Extrae el sub-array ganador (solo para modo visual)
  const subArrayGanador =
    resultadoVisual.fin >= 0
      ? huerto.slice(resultadoVisual.inicio, resultadoVisual.fin + 1)
      : [];

  // Calcula todos los subarrays (solo cuando isVisualMode === true)
  const { todosLosSubarrays, tiempo: tiempoSubarrays } = useMemo(() => {
    if (!isVisualMode) {
      return { todosLosSubarrays: [] as SubArrayInfo[], tiempo: 0 };
    }
    const t0 = performance.now();
    const todos = calcularTodosSubarrays(huerto);
    const t1 = performance.now();
    return { todosLosSubarrays: todos, tiempo: t1 - t0 };
  }, [huerto, isVisualMode]);

  // Genera un huerto de 50 parcelas, con valores entre -20 y 20
  const handleGenerarHuerto = () => {
    const nuevoHuerto = generarHuertoAleatorio(150, -20, 20);
    setInputStr(nuevoHuerto.join(", "));
  };

  // --- RENDERIZADO ---
  return (
    <div className="container">
      <h1>🎃 El Huerto de Calabazas 🎃</h1>
      <div className="explanation-text">
        <h2>
          <strong>El Escenario 🎃</strong>
        </h2>
        <p>
          Eres el administrador de un huerto de calabazas que va a ser vendido
          por el precio total de las calabazas cosechadas. Sin embargo, en el
          huerto hay calabazas malvadas (puntos negativos) y calabazas
          deliciosas (puntos positivos). Se ha descubierto que debido a una
          maldición, si se empieza a cosechar en una zona, es obligatorio
          cosechar todas las parcelas contiguas hasta que se decide parar. El
        </p>
        <h2>
          <strong>Desafío 🕸️</strong>
        </h2>
        <p>
          Debes crear una función en JavaScript llamada maximaGanancia(parcelas)
          que reciba un array de números enteros (parcelas) y devuelva la máxima
          ganancia que se puede obtener seleccionando un sub-array contiguo de
          parcelas (es decir, seleccionando un bloque de calabazas sin saltarse
          ninguna).
        </p>
        <h2>
          <strong>Solución 🪄</strong>
        </h2>
        <p>
          Solución en <strong>React + TypeScript + Vite</strong> por Gonzalo
          Muñoz Quintero.
        </p>
        <p>
          (Framework no habitual: Vengo de <strong>Angular</strong>)
        </p>
      </div>

      {/* --- TOGGLE SWITCH --- */}

      <div>
        <div className="toggle-container">
          <span>Modo Clásico (Solo Suma)</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isVisualMode}
              onChange={() => setIsVisualMode(!isVisualMode)}
            />
            <span className="slider"></span>
          </label>
          <span>
            Modo Visual (Suma + Sub-array ganador + Sub-arrays posibles)
          </span>
        </div>
        <div>
          <span className="disclaimer-warning">
            <span className="dw-icon">⚠️</span>
            <span className="dw-title">
              <strong> ATENCIÓN: </strong>
            </span>
            <span className="dw-text">
              En <strong>modo visual</strong> se generan y procesan todos los
              sub-arrays (complejidad O(n²)).
              <br />
              Evita usar arrays grandes (más de 200 elementos), ya que puede
              congelar la aplicación.
            </span>
          </span>
        </div>
      </div>

      {/* -- Sección de Input -- */}
      <div className="input-section">
        <label htmlFor="huertoInput">
          Define tu huerto introducciendo números separados por comas o genera
          un huerto aleatorio pulsando el botón:
        </label>
        <input
          id="huertoInput"
          type="text"
          value={inputStr}
          onChange={(e) => setInputStr(e.target.value)}
          placeholder="Ej: 1, 2, -5, 10, -2"
        />
        <button className="generar-btn" onClick={handleGenerarHuerto}>
          🌱 Generar Huerto Aleatorio (150 parcelas) 🌱
        </button>
      </div>

      {/* --- RENDERIZADO CONDICIONAL --- */}

      {isVisualMode ? (
        // --- MODO VISUAL ---
        <>
          {/* --- Sección de Resultados --- */}
          {huerto.length > 0 && (
            <>
              <div className="info-panel">
                <h3>Máxima Ganancia: {resultadoVisual.ganancia}</h3>
                <p>
                  Sub-array ganador:{" "}
                  <strong>[{subArrayGanador.join(", ")}]</strong>
                </p>
                <p>
                  Índices: (del {resultadoVisual.inicio} al{" "}
                  {resultadoVisual.fin})
                </p>
                <code>Tiempo de ejecución: {tiempoVisual.toFixed(16)} ms</code>
              </div>

              <h3>Visualización del Huerto:</h3>
              <div
                className="huerto-container"
                style={
                  {
                    // Variables CSS para :before y :after
                    "--start-index": resultadoVisual.inicio,
                    "--end-index": resultadoVisual.fin,
                    "--parcel-width": "60px",
                    "--parcel-gap": "10px",
                  } as React.CSSProperties
                }
              >
                <div className="parcelas-container">
                  {/* --- Array del huerto y subarray ganador --- */}
                  {huerto.map((valor: number, i: number) => {
                    const estaEnSubArray =
                      i >= resultadoVisual.inicio && i <= resultadoVisual.fin;
                    const claseParcela = `parcela ${
                      estaEnSubArray ? "highlighted" : ""
                    } ${valor < 0 ? "negativa" : "positiva"}`;

                    return (
                      <div
                        key={i}
                        className={claseParcela}
                        title={`Índice ${i}`}
                      >
                        {valor}
                      </div>
                    );
                  })}
                </div>

                {/* --- Texto de Máxima Ganancia --- */}
                {resultadoVisual.fin >= 0 && huerto.length > 0 && (
                  <div className="max-gain-text">
                    <span
                      className={
                        resultadoVisual.ganancia >= 0
                          ? "ganancia-positiva"
                          : "ganancia-negativa"
                      }
                    >
                      {resultadoVisual.ganancia >= 0 ? "📈" : "📉"} Máx.
                      Ganancia: {resultadoVisual.ganancia}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
          {/* --- SECCIÓN: TODOS LOS SUBARRAYS --- */}
          {huerto.length > 0 && (
            <div className="subarray-panel">
              <h3>
                Todos los Sub-arrays Posibles ({todosLosSubarrays.length})
              </h3>

              <div className="subarray-list-header">
                <span className="subarray-header-ganancia">Ganancia</span>
                <span className="subarray-header-array">Sub-array</span>
              </div>

              <div className="subarray-list-container">
                {todosLosSubarrays.map((item, index) => (
                  <div
                    key={index}
                    className={`subarray-item ${
                      // Resalta si la ganancia o el contenido coinciden (para casos de ganancias iguales)
                      item.ganancia === resultadoVisual.ganancia ||
                      item.array.join(",") === subArrayGanador.join(",")
                        ? "is-max"
                        : ""
                    } ${item.ganancia < 0 ? "is-negative" : ""}`}
                  >
                    <span className="subarray-item-ganancia">
                      {item.ganancia}
                    </span>
                    <span className="subarray-item-array">
                      [{item.array.join(", ")}]
                    </span>
                  </div>
                ))}
              </div>
              <code>Tiempo de ejecución: {tiempoSubarrays.toFixed(16)} ms</code>
            </div>
          )}
        </>
      ) : (
        // --- MODO CLÁSICO (Solo la ganancia) ---
        <>
          {huerto.length > 0 && (
            <div className="info-panel info-panel-clasico">
              <h3>Máxima Ganancia: {gananciaClasica}</h3>
              <code>Tiempo de ejecución: {tiempoClasico.toFixed(16)} ms</code>
              <p>
                (Solución calculada usando el Algoritmo de Kadane original, solo
                devuelve la ganancia máxima)
              </p>
            </div>
          )}
        </>
      )}

      {/* -- Sección de Explicación -- */}
      <div className="explanation-panel">
        <div className="explanation-text">
          <h3>El Algoritmo de Kadane</h3>
          <p>
            Esta solución utiliza el <strong>Algoritmo de Kadane</strong>. Es el
            método preferido para resolver el problema del "máximo sub-array
            contiguo" por su eficiencia. Funciona aplicando una{" "}
            <strong>estrategia greedy (voraz)</strong>: en cada paso, toma la
            decisión localmente óptima (continuar la suma actual o empezar una
            nueva) para llegar a la solución global.
          </p>
          <ul>
            <li>
              <strong>Rendimiento:</strong> Tiene una complejidad temporal de{" "}
              <strong>O(n)</strong> (tiempo lineal). Esto significa que recorre
              el array una sola vez, sin importar su tamaño.
            </li>
          </ul>
          <p>
            La lógica mantiene dos contadores: la "ganancia máxima actual" (la
            cosecha en progreso) y la "ganancia máxima global" (el récord
            histórico). Si la cosecha actual se vuelve negativa, es mejor
            "abandonarla" y empezar una nueva desde la siguiente parcela.
          </p>
        </div>
        <div className="explanation-code">
          <h4>Versión Original (Solo Suma):</h4>
          <pre>
            <code>{kadaneOriginalCodigo}</code>
          </pre>
        </div>
      </div>
      {/* --- FOOTER: copyright y licencia --- */}
      <footer className="app-footer" role="contentinfo">
        <div className="container-footer">
          <span>
            © 2025{" "}
            <a
              href="https://github.com/gmqdev/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gonzalo Muñoz Quintero
            </a>
          </span>
          <span className="footer-sep">•</span>
          <a
            href="https://creativecommons.org/licenses/by-nc/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY‑NC 4.0
          </a>
        </div>
      </footer>
    </div>
  );
}
