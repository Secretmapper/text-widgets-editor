import type { Widget } from '../types';
import { TextWidget } from './TextWidget';

interface WidgetResolverProps {
  widget: Widget;
  onUpdate: (data: Widget['data']) => void;
}

export const WidgetResolver: React.FC<WidgetResolverProps> = ({ widget, onUpdate }) => {
  switch (widget.type) {
    case 'text':
      return <TextWidget id={widget.id} data={widget.data} onUpdate={onUpdate} />;

    // Future widget types can be added here:
    // case 'image':
    //   return <ImageWidget {...widget} />;
    // case 'video':
    //   return <VideoWidget {...widget} />;

    default:
      return <div>Unknown widget type</div>;
  }
};
