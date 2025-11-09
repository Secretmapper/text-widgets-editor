import { Widget } from './types.js';

/**
 * In-memory storage for widgets
 * In prod, we'd replace this with a database
 */
class WidgetStorage {
  private widgets: Map<string, Widget> = new Map();

  getAllWidgets(): Widget[] {
    return Array.from(this.widgets.values()).sort((a, b) => a.position - b.position);
  }

  getWidget(id: string): Widget | null {
    return this.widgets.get(id) ?? null;
  }

  createWidget(widget: Widget): Widget {
    const newWidget: Widget = { ...widget };

    this.widgets.set(widget.id, newWidget);
    return newWidget;
  }

  updateWidget(id: string, updates: Partial<Omit<Widget, 'id'>>): Widget | null {
    const widget = this.widgets.get(id);
    if (!widget) return null;

    const updatedWidget: Widget = {
      ...widget,
      ...updates,
      id,
    };

    this.widgets.set(id, updatedWidget);
    return updatedWidget;
  }

  deleteWidget(id: string): boolean {
    return this.widgets.delete(id);
  }

  clear(): void {
    this.widgets.clear();
  }
}

export const storage = new WidgetStorage();
