import { useEffect, useRef, useState } from 'react';
import type { TasksData } from '../types';

type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'error';

export function useTasksSSE() {
  const [data, setData] = useState<TasksData | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCount = useRef(0);

  function connect() {
    if (esRef.current) esRef.current.close();

    const es = new EventSource('/events');
    esRef.current = es;
    setStatus('connecting');

    es.addEventListener('init', (e) => {
      const parsed: TasksData = JSON.parse(e.data);
      setData(parsed);
      setStatus('connected');
      setLastUpdate(new Date());
      retryCount.current = 0;
    });

    es.addEventListener('update', (e) => {
      const parsed: TasksData = JSON.parse(e.data);
      setData(parsed);
      setLastUpdate(new Date());
    });

    es.onerror = () => {
      es.close();
      setStatus('reconnecting');
      retryCount.current += 1;
      const delay = Math.min(1000 * 2 ** retryCount.current, 30000);
      retryRef.current = setTimeout(connect, delay);
    };
  }

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, []);

  async function updateTaskStatus(id: string, status: string) {
    await fetch(`/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  return { data, status, lastUpdate, updateTaskStatus };
}
