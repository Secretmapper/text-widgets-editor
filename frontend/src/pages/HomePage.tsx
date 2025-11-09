import { RichWidget, AddWidgetButton, EmptyState, useWidgets } from '../features/widgets';

export function HomePage() {
  const widgets = useWidgets();

  return (
    <div className="min-h-screen bg-[#f4f4f2]">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-[#2c2c2c] mb-1">Text Widget Application</h1>
          <p className="text-sm text-[#6b6b6b]">
            Click the buttons to add new text widgets. Auto-saves as you type.
          </p>
        </header>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-[#e5e5e5]">
          <div className="p-8 bg-white">
            {widgets.isLoading ? (
              // Skeleton loading state
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="relative p-4 rounded-lg border border-[#e5e5e5] bg-white animate-pulse"
                  >
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : widgets.list.length === 0 ? (
              <EmptyState disabled={widgets.isAdding} onAdd={() => widgets.add(0)} />
            ) : (
              <AddWidgetButton position={0} disabled={widgets.isAdding} onAdd={widgets.add} />
            )}

            {widgets.list.length > 0 &&
              widgets.list.map((widgetListItem, index) => (
                <div key={widgetListItem.id}>
                  <RichWidget widgetId={widgetListItem.id} onDelete={widgets.remove} />

                  <AddWidgetButton
                    position={index + 1}
                    disabled={widgets.isAdding}
                    onAdd={widgets.add}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
