import React, { useMemo } from 'react';
import { BookOpen } from 'lucide-react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

/**
 * Deterministic QR-like 2D Matrix Generator with corner position detection patterns and timing tracks
 * Creates an authentic, high-density SVG visual matching WhatsApp Web QR pairing screen.
 */
export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 220 }) => {
  const matrixSize = 25; // 25x25 grid standard QR version 2

  const grid = useMemo(() => {
    // Generate pseudo-random hash from value for realistic data dots
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }

    const m: boolean[][] = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(false));

    // 1. Draw Corner Finder Patterns (7x7 top-left, top-right, bottom-left)
    const drawFinderPattern = (startX: number, startY: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 ||
            r === 6 ||
            c === 0 ||
            c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            m[startY + r][startX + c] = true;
          }
        }
      }
    };

    drawFinderPattern(0, 0); // Top-Left
    drawFinderPattern(matrixSize - 7, 0); // Top-Right
    drawFinderPattern(0, matrixSize - 7); // Bottom-Left

    // 2. Timing Patterns (Horizontal and Vertical dotted tracks)
    for (let i = 8; i < matrixSize - 8; i++) {
      if (i % 2 === 0) {
        m[6][i] = true;
        m[i][6] = true;
      }
    }

    // 3. Fill Data Matrix deterministically based on input value hash
    let seed = Math.abs(hash) || 1234567;
    const rng = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        // Skip corner finder zones (7x7) and margin
        const isTL = r < 8 && c < 8;
        const isTR = r < 8 && c >= matrixSize - 8;
        const isBL = r >= matrixSize - 8 && c < 8;
        const isTiming = r === 6 || c === 6;
        // Leave center empty for logo
        const isCenter = r >= 9 && r <= 15 && c >= 9 && c <= 15;

        if (!isTL && !isTR && !isBL && !isTiming && !isCenter) {
          m[r][c] = rng() > 0.48;
        }
      }
    }

    return m;
  }, [value]);

  const cellSize = size / matrixSize;

  return (
    <div className="relative inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-md border-2 border-slate-200 dark:border-slate-700">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shape-rendering-crispEdges"
      >
        {grid.map((row, r) =>
          row.map((filled, c) => {
            if (!filled) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize - 0.2}
                height={cellSize - 0.2}
                rx={1}
                className="fill-slate-900"
              />
            );
          })
        )}
      </svg>

      {/* Central NOVI Brand Badge in QR Code (like WhatsApp logo in WA Web QR) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-12 h-12 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-lg border-2 border-white ring-1 ring-purple-400">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};
