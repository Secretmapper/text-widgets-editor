import { v4 as uuidv4 } from 'uuid';
import { trpc } from '../../../utils/trpc';
import { useCreateWidget } from './useCreateWidget';
import { useRemoveWidget } from './useRemoveWidget';

export const useWidgets = () => {
  const { data: widgets = [], isLoading } = trpc.getWidgets.useQuery();

  const createMutation = useCreateWidget();
  const removeMutation = useRemoveWidget();

  const addWidget = (position: number) => {
    const id = uuidv4();
    createMutation.mutate({
      id,
      type: 'text',
      data: {
        content: '',
      },
      position,
    });
  };

  const removeWidget = (id: string) => {
    removeMutation.mutate({ id });
  };

  return {
    list: widgets,
    add: addWidget,
    remove: removeWidget,
    isAdding: false,
    isLoading,
  };
};
