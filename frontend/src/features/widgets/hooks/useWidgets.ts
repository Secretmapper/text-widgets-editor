export const useWidgets = () => {
  const widgetList: { id: string }[] = [];

  const addWidget = () => {};
  const removeWidget = () => {};

  return {
    list: widgetList,
    add: addWidget,
    remove: removeWidget,
    isAdding: false,
    isLoading: true,
  };
};
