import { bench } from "vitest";
import { encontrarMaximaGanancia, encontrarMaximaGananciaVisual } from "../src/AppHuerto";

function randomArray(n: number, min = -100, max = 100): number[] {
  return Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

bench("Kadane - clásico n=1000", () => {
  const arr = randomArray(1000);
  encontrarMaximaGanancia(arr);
});

bench("Kadane - visual n=1000", () => {
  const arr = randomArray(1000);
  encontrarMaximaGananciaVisual(arr);
});