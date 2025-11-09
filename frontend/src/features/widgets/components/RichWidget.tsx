interface RichWidgetProps {
  widgetId: string;
  onDelete: (id: string) => void;
}

export const RichWidget: React.FC<RichWidgetProps> = ({ widgetId }) => {
  return (
    <div className="relative mb-4 p-4 rounded-lg border border-[#e5e5e5] bg-white">
      Widget {widgetId}
    </div>
  );
};
