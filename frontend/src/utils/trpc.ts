import { createTRPCReact } from '@trpc/react-query';
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../../../backend/src/router';

export const trpc = createTRPCReact<AppRouter>();

// Type helpers for inferring types from the backend router
export type RouterOutputs = inferRouterOutputs<AppRouter>;
