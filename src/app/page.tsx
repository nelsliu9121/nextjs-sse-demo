'use client';

import { useServerEventsStore } from '@/stores/serverEvents';
import { useEffect } from 'react';
import { ServerEventList } from '@/components/sse/ServerEventList/ServerEventList';
import { ServerEventForm } from '@/components/sse/ServerEventForm/ServerEventForm';

export default function HomePage() {
  const connect = useServerEventsStore((s) => s.connect);
  const disconnect = useServerEventsStore((s) => s.disconnect);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return (
    <main className='grid h-screen grid-cols-2 grid-rows-1 gap-12 bg-emerald-500 p-12'>
      <div className='rounded-2xl border p-8'>
        <ServerEventForm />
      </div>

      <div className='overflow-y-auto rounded-2xl border p-8'>
        <ServerEventList />
      </div>
    </main>
  );
}
