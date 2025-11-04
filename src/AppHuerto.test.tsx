import { describe, expect, test } from "vitest";
import { encontrarMaximaGanancia, encontrarMaximaGananciaVisual } from "./AppHuerto.tsx";

const testCases = [
  {
    case: "Todos positivos",
    parcelas: [1, 2, 3, 4],
    subarrayMaximaGanancia: [1, 2, 3, 4],
    gananciaEsperada: 10,
  },
  {
    case: "Ejemplo clásico de Kadane",
    parcelas: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    subarrayMaximaGanancia: [4, -1, 2, 1],
    gananciaEsperada: 6,
  },
  {
    case: "Todos negativos (menos mala)",
    parcelas: [-1, -2, -3, -4],
    subarrayMaximaGanancia: "[-1] o [-2] o [-3] o [-4]",
    gananciaEsperada: -1,
  },
  {
    case: "Caso con reinicio en el medio",
    parcelas: [8, 1, -100, 2, 5],
    subarrayMaximaGanancia: [8, 1],
    gananciaEsperada: 9,
  },
  {
    case: "Caso con dos posibles soluciones",
    parcelas: [8, 1, -100, 4, 5],
    subarrayMaximaGanancia: '[8,1] o [4,5]',
    gananciaEsperada: 9,
  },
  {
    case: "Array vacío",
    parcelas: [],
    subarrayMaximaGanancia: [],
    gananciaEsperada: 0,
  },
  {
    case: "Un solo elemento (positivo)",
    parcelas: [5],
    subarrayMaximaGanancia: [5],
    gananciaEsperada: 5,
  },
  {
    case: "Un solo elemento (negativo)",
    parcelas: [-5],
    subarrayMaximaGanancia: [-5],
    gananciaEsperada: -5,
  },
];

describe("Huerto de Calabazas: Hallar la máxima suma posible de un sub-arrays contiguo (Algoritmo de Kadane)", () => {
  test.each(testCases)(
    "Entrada (parcelas): $parcelas \n\tSub-array ganador: $subarrayMaximaGanancia \n\tSalida esperada (máximaGanancia): $gananciaEsperada",
    ({ parcelas, gananciaEsperada, subarrayMaximaGanancia }) => {
      const resultadoClasico = encontrarMaximaGanancia(parcelas);
      expect(resultadoClasico).toBe(gananciaEsperada);

      const resultadoVisual = encontrarMaximaGananciaVisual(parcelas);
      expect(resultadoVisual.ganancia).toBe(gananciaEsperada);

      const inicio = resultadoVisual.inicio;
      const fin = resultadoVisual.fin;
      const subArrayEsperado = parcelas.slice(inicio, fin + 1);
      if (Array.isArray(subarrayMaximaGanancia)) {
        expect(subArrayEsperado).toEqual(subarrayMaximaGanancia);
      } else if (typeof subarrayMaximaGanancia === "string") {
        expect(subarrayMaximaGanancia).toContain(
          JSON.stringify(subArrayEsperado)
        );
      } else {
        expect(subArrayEsperado).toEqual(subarrayMaximaGanancia);
      }
    }
  );
});
