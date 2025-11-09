import type { RouterOutputs } from '../../utils/trpc';

export type Widget = RouterOutputs['getWidget'];
export type WidgetType = Widget['type'];

export type TextWidget = Extract<Widget, { type: 'text' }>;

// Minimal widget info for list cache
export type WidgetListItem = {
  id: string;
  type: Widget['type'];
  position: number;
};

// Props that all widget components should receive
export type WidgetProps<T extends Widget = Widget> = {
  id: string;
  data: T['data'];
  onUpdate: (data: T['data']) => void;
};
