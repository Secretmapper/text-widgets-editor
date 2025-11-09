import type { Widget } from '../types';
import { useState, useEffect } from 'react';
import { trpc } from '../../../utils/trpc';

const SAVED_MESSAGE_DURATION = 1000; // ms

/**
 * Hook for updating a specific widget with optimistic updates
 * Keeps both individual widget cache and list cache in sync
 */
export const useUpdateWidget = (widgetId: string) => {
  const utils = trpc.useUtils();

  const mutation = trpc.updateWidget.useMutation({
    onMutate: async (variables) => {
      await utils.getWidget.cancel({ id: variables.id });

      const previousWidget = utils.getWidget.getData({ id: variables.id });

      utils.getWidget.setData({ id: variables.id }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: { ...old.data, ...variables.data },
        };
      });

      utils.getWidgets.setData(undefined, (old) => {
        if (!old) return old;
        return old.map((w) =>
          w.id === widgetId ? { ...w, data: { ...w.data, ...variables.data } } : w
        );
      });

      return { previousWidget };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousWidget) {
        utils.getWidget.setData({ id: widgetId }, context.previousWidget);
      }
    },
    onSuccess: (serverWidget) => {
      utils.getWidgets.setData(undefined, (old) =>
        old?.map((w) => (w.id === serverWidget.id ? serverWidget : w))
      );
      utils.getWidget.setData({ id: serverWidget.id }, serverWidget);
    },
  });

  const [showSaved, setShowSaved] = useState(false);

  // Auto-hide "Saved" message after a few seconds
  useEffect(() => {
    if (mutation.isSuccess && !mutation.isPending) {
      setShowSaved(true);
      const timer = setTimeout(() => {
        setShowSaved(false);
      }, SAVED_MESSAGE_DURATION);

      return () => clearTimeout(timer);
    }
  }, [mutation.isSuccess, mutation.isPending]);

  // Scoped update handler that doesn't need widgetId
  const mutate = (data: Widget['data']) => {
    mutation.mutate({
      id: widgetId,
      data,
    });
  };

  return {
    mutate,
    isPending: mutation.isPending,
    showSaved,
    isError: mutation.isError,
  };
};
