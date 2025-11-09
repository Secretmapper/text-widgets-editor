import { useWidget } from '../hooks';
import { WidgetControlBar } from './WidgetControlBar';
import { WidgetResolver } from './WidgetResolver';

interface RichWidgetProps {
  widgetId: string;
}

export const RichWidget: React.FC<RichWidgetProps> = ({ widgetId }) => {
  const { data: widget, update, remove } = useWidget(widgetId);
  const { isPending, isError, showSaved } = update;

  return (
    <div className="relative mb-4 p-4 rounded-lg border border-[#e5e5e5] bg-white">
      <WidgetResolver widget={widget} onUpdate={update.mutate} />
      <WidgetControlBar
        onRemove={remove.mutate}
        isSaveError={isError}
        isSavePending={isPending}
        showSaved={showSaved}
      />
    </div>
  );
};
