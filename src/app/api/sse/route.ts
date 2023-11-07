import { NextRequest, NextResponse } from 'next/server';
import { BehaviorSubject, interval } from 'rxjs';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

const messageSubject = new BehaviorSubject<string>('');

export async function GET() {
  const encoder = new TextEncoder();
  const { writable, readable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();

  const interval$$ = interval(10000).subscribe({
    next: async () => {
      await writer.write(encoder.encode('event: ping\n'));
      await writer.write(encoder.encode('data: ' + Date.now().toString()));
      await writer.write(encoder.encode('\n\n'));
    },
  });

  messageSubject.subscribe({
    next: async (m) => {
      if (m) {
        await writer.write(encoder.encode('event: message\n'));
        await writer.write(encoder.encode('data: ' + m));
        await writer.write(encoder.encode('\n\n'));
      }
    },
    complete: () => {
      interval$$.unsubscribe();
      writer.close();
    },
  });

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
}

export async function POST(request: NextRequest) {
  const data = await request.text();

  messageSubject.next(data);

  return new NextResponse(null, { status: 201 });
}

export async function PUT() {
  messageSubject.complete();

  return new NextResponse(null, { status: 204 });
}
