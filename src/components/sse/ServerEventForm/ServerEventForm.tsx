'use client';

import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';

export function ServerEventForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate } = useMutation({
    mutationFn: (message: string) =>
      fetch('/api/sse', {
        method: 'POST',
        body: message,
      }),
  });

  function submitMessage() {
    const message = inputRef.current?.value;

    if (message) {
      mutate(message);
    }
  }

  return (
    <form action='' onSubmit={(e) => e.preventDefault()}>
      <label>Message</label>
      <input ref={inputRef} type='text' name='message' />

      <button onClick={submitMessage} type='submit'>
        Send
      </button>
    </form>
  );
}
