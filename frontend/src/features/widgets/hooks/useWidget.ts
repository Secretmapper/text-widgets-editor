import { trpc } from '../../../utils/trpc';
import { useRemoveWidget } from './useRemoveWidget';
import { useUpdateWidget } from './useUpdateWidget';

export const useWidget = (id: string) => {
  const utils = trpc.useUtils();

  const widget = trpc.getWidget.useQuery(
    { id: id },
    {
      initialData: () => {
        // Use the list cache as initial data
        const widgets = utils.getWidgets.getData();
        return widgets?.find((w) => w.id === id);
      },
    }
  );

  const updateWidget = useUpdateWidget(id);

  const removeMutation = useRemoveWidget();
  const removeWidget = () => {
    removeMutation.mutate({ id });
  };

  return {
    ...widget,
    update: updateWidget,
    remove: {
      ...removeMutation,
      mutate: removeWidget,
    },
  };
};
