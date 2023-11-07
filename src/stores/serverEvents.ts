import { create } from 'zustand';
import { Observable, Subscription } from 'rxjs';
import { immer } from 'zustand/middleware/immer';

interface ServerEvent {
  event: string;
  data: string;
}

interface ServerEventsState {
  subscription: Subscription | undefined;
  messages: ServerEvent[];

  connect(): void;
  disconnect(): void;
}

export const useServerEventsStore = create<ServerEventsState>()(
  immer((set, get) => ({
    subscription: undefined,
    messages: [],
    connect() {
      const source = observableFromEventSource(new EventSource('http://localhost:3000/api/sse'));

      const source$$ = source.subscribe({
        next: (event) => {
          set((state) => {
            state.messages.push({
              event: event.event,
              data: event.data,
            });

            return state;
          });
        },
      });

      set((state) => {
        state.subscription = source$$;

        return state;
      });
    },
    disconnect() {
      get().subscription?.unsubscribe();

      set((state) => {
        state.subscription = undefined;

        return state;
      });
    },
  })),
);

function observableFromEventSource(eventSource: EventSource) {
  return new Observable<ServerEvent>((observer) => {
    eventSource.addEventListener('message', (event) => {
      observer.next({
        event: 'message',
        data: event.data,
      });
    });
    eventSource.addEventListener('ping', (event) => {
      observer.next({
        event: 'ping',
        data: event.data,
      });
    });

    eventSource.onerror = observer.error;

    return () => {
      eventSource.close();
    };
  });
}
