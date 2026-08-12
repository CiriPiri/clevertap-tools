import { useState, useMemo } from 'react';
import type { CleverTapReport } from '../types/clevertap';

export interface ParseError {
  message: string;
  /** 1-indexed line of the syntax error, when the engine reports a position. */
  line?: number;
}

/**
 * Turns a browser JSON error ("Unexpected token } in JSON at position 412")
 * into something that points at a line the user can actually find.
 */
const describeError = (err: unknown, source: string): ParseError => {
  const raw = err instanceof Error ? err.message : 'Could not parse JSON.';
  const match = /position (\d+)/i.exec(raw);

  if (match) {
    const pos = Number(match[1]);
    const line = source.slice(0, pos).split('\n').length;
    const cleaned = raw
      .replace(/ in JSON at position \d+.*/i, '')
      .replace(/^JSON\.parse: /, '');
    return { message: `${cleaned} — line ${line}`, line };
  }

  return { message: raw.replace(/^JSON\.parse: /, '') };
};

export const useJsonParser = () => {
  const [jsonInput, setJsonInput] = useState('');

  // Data and error are derived together in a single pass — no error state, so
  // there is no cascading re-render when the input changes.
  const { parsedData, error } = useMemo((): {
    parsedData: CleverTapReport[] | null;
    error: ParseError | null;
  } => {
    if (!jsonInput.trim()) return { parsedData: null, error: null };

    try {
      const parsed = JSON.parse(jsonInput);
      const dataArray = Array.isArray(parsed) ? parsed : [parsed];

      // Copy before sorting — never mutate the parsed source in place.
      const sorted = [...dataArray].sort((a, b) => {
        const aDate = a?.campaigninfo?.createddatetime?.from || 0;
        const bDate = b?.campaigninfo?.createddatetime?.from || 0;
        return aDate - bDate;
      });

      return { parsedData: sorted as CleverTapReport[], error: null };
    } catch (e) {
      return { parsedData: null, error: describeError(e, jsonInput) };
    }
  }, [jsonInput]);

  /** Pretty-print in place — handy after pasting a minified payload. */
  const formatJson = () => {
    try {
      setJsonInput(JSON.stringify(JSON.parse(jsonInput), null, 2));
    } catch {
      /* leave malformed input untouched */
    }
  };

  return {
    jsonInput,
    setJsonInput,
    parsedData,
    error,
    formatJson,
    rowCount: parsedData?.length ?? 0,
  };
};
