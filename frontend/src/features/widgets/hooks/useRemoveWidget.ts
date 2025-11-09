import { trpc } from '../../../utils/trpc';

/**
 * Hook for removing widgets with optimistic updates
 * Handles position shifting and cache cleanup
 */
export const useRemoveWidget = () => {
  const utils = trpc.useUtils();

  const mutation = trpc.deleteWidget.useMutation({
    onMutate: async (variables) => {
      await utils.getWidgets.cancel();
      const previousWidgets = utils.getWidgets.getData();

      utils.getWidgets.setData(undefined, (old) => {
        const widgets = old || [];
        const deletedWidget = widgets.find((w) => w.id === variables.id);
        if (!deletedWidget) return old;

        return widgets
          .filter((w) => w.id !== variables.id)
          .map((w) =>
            w.position > deletedWidget.position ? { ...w, position: w.position - 1 } : w
          );
      });

      return { previousWidgets };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousWidgets) {
        utils.getWidgets.setData(undefined, context.previousWidgets);
      }
    },
    onSettled: () => {
      utils.getWidgets.invalidate();
    },
  });

  return mutation;
};
