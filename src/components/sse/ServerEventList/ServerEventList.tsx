'use client';

import { useServerEventsStore } from '@/stores/serverEvents';

export function ServerEventList() {
  const messages = useServerEventsStore((s) => s.messages);

  return (
    <ul className='flex flex-col gap-4'>
      {messages.map((m, index) => (
        <li key={index} className='flex items-center gap-4'>
          <h5 className='rounded border border-emerald-900 bg-emerald-700 px-4 py-1'>{m.event}</h5>
          <code>{m.data}</code>
        </li>
      ))}
    </ul>
  );
}
