import { trpc } from '../../../utils/trpc';

/**
 * Hook for creating widgets with optimistic updates
 * Handles position shifting and cache management
 */
export const useCreateWidget = () => {
  const utils = trpc.useUtils();

  const mutation = trpc.createWidget.useMutation({
    onMutate: async (newWidget) => {
      await utils.getWidgets.cancel();

      const previousWidgets = utils.getWidgets.getData();

      const optimisticWidget = {
        id: newWidget.id,
        type: newWidget.type,
        data: newWidget.data,
        position: newWidget.position,
      };

      // TODO: This is why we want to do fractional indexing
      utils.getWidgets.setData(undefined, (old) => {
        const widgets = old || [];

        const updatedWidgets = widgets.map((w) =>
          w.position >= newWidget.position ? { ...w, position: w.position + 1 } : w
        );

        return [...updatedWidgets, optimisticWidget].sort((a, b) => a.position - b.position);
      });

      return { previousWidgets };
    },
    onError: (_err, _newWidget, context) => {
      // Revert on error
      // TODO: We need to handle this gracefully
      // and also add perhaps toast notifications
      if (context?.previousWidgets) {
        utils.getWidgets.setData(undefined, context.previousWidgets);
      }
    },
    onSuccess: (serverWidget) => {
      utils.getWidgets.setData(undefined, (old) =>
        old?.map((w) => (w.id === serverWidget.id ? serverWidget : w))
      );
    },
    onSettled: () => {
      utils.getWidgets.invalidate();
    },
  });

  return mutation;
};
