import * as Sentry from '@sentry/nextjs';

export function captureServerException(error: unknown, context: { operation: string; userId?: string }) {
  Sentry.withScope((scope) => {
    scope.setTag('operation', context.operation);
    if (context.userId) scope.setUser({ id: context.userId });
    Sentry.captureException(error);
  });
}