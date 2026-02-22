import { useState, useMemo } from 'react';
import type { CleverTapReport } from '../types/clevertap';

export const useJsonParser = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const parsedData = useMemo(() => {
    if (!jsonInput.trim()) {
      setError(null);
      return null;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const dataArray = Array.isArray(parsed) ? parsed : [parsed];
      
      const sorted = dataArray.sort((a, b) => {
        const aDate = a.campaigninfo?.createddatetime?.from || 0;
        const bDate = b.campaigninfo?.createddatetime?.from || 0;
        return aDate - bDate;
      });
      
      setError(null);
      return sorted as CleverTapReport[];
    } catch (e) {
      setError("Invalid JSON format. Please check your syntax.");
      return null;
    }
  }, [jsonInput]);

  return { jsonInput, setJsonInput, parsedData, error };
};