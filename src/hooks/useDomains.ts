import { useEffect, useState } from 'react';
import type { Domain } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function useDomains() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDomains() {
      try {
        const res = await fetch(`${API_BASE}/domains`);
        const data = await res.json();
        setDomains(data || []);
      } catch (err) {
        console.error('Failed to fetch domains:', err);
        setDomains([]);
      } finally {
        setLoading(false);
      }
    }
    fetchDomains();
  }, []);

  return { domains, loading };
}
