import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import superjson from 'superjson';
import { storage } from './storage.js';
import type { WidgetType } from './types.js';

const createWidgetSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['text'] as [WidgetType]),
  data: z.object({
    content: z.string().max(10000), // Support large text up to 10k chars
  }),
  position: z.number().int().min(0),
});

const updateWidgetSchema = createWidgetSchema.partial().required({ id: true });

const t = initTRPC.create({
  transformer: superjson,
});

export const appRouter = t.router({
  getWidgets: t.procedure.query(() => storage.getAllWidgets()),

  getWidget: t.procedure.input(createWidgetSchema.pick({ id: true })).query(({ input }) => {
    const widget = storage.getWidget(input.id);
    if (!widget) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Widget not found',
      });
    }
    return widget;
  }),

  createWidget: t.procedure.input(createWidgetSchema).mutation(({ input }) => {
    // Shift positions of existing widgets if inserting in the middle
    // TODO: In prod you would want:
    //   to use a transaction for atomicity
    //   to use fractional indexing so we don't need to shift positions
    const allWidgets = storage.getAllWidgets();
    allWidgets
      .filter((w) => w.position >= input.position)
      .forEach((w) => {
        storage.updateWidget(w.id, { position: w.position + 1 });
      });

    return storage.createWidget({
      id: input.id,
      type: input.type as 'text',
      data: input.data,
      position: input.position,
    } as any);
  }),

  updateWidget: t.procedure.input(updateWidgetSchema).mutation(({ input }) => {
    const { id, data } = input;

    const updatedWidget = storage.updateWidget(id, { data });
    if (!updatedWidget) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Widget not found',
      });
    }
    return updatedWidget;
  }),

  deleteWidget: t.procedure.input(createWidgetSchema.pick({ id: true })).mutation(({ input }) => {
    const widget = storage.getWidget(input.id);
    if (!widget) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Widget not found',
      });
    }

    const deleted = storage.deleteWidget(input.id);

    // Shift positions of widgets after the deleted one
    // TODO: In prod you would want:
    //   to use a transaction for atomicity
    //   to use fractional indexing so we don't need to shift positions
    if (deleted) {
      const allWidgets = storage.getAllWidgets();
      allWidgets
        .filter((w) => w.position > widget.position)
        .forEach((w) => {
          storage.updateWidget(w.id, { position: w.position - 1 });
        });
    }

    return { success: deleted };
  }),

  // Clear all widgets (only for testing/development)
  ...(process.env.NODE_ENV !== 'production' && {
    clearDatabase: t.procedure.mutation(() => {
      storage.clear();
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
