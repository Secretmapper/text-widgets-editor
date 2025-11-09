export type WidgetType = Widget['type'];

export interface BaseWidget {
  id: string;
  position: number;
}

export interface TextWidget extends BaseWidget {
  type: 'text';
  position: number;
  data: {
    content: string;
  };
}

export type Widget = TextWidget; // Union type for extending widget types
