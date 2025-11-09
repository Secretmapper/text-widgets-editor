import { Widget } from './types.js';

/**
 * In-memory storage for widgets
 * In a production environment, this would be replaced with a database
 */
class WidgetStorage {
  private widgets: Map<string, Widget> = new Map();

  getAllWidgets(): Widget[] {
    return Array.from(this.widgets.values()).sort((a, b) => a.position - b.position);
  }

  getWidget(id: string): Widget | undefined {
    return this.widgets.get(id);
  }

  createWidget(widget: Widget): Widget {
    const newWidget: Widget = {
      ...widget,
    } as Widget;

    this.widgets.set(widget.id, newWidget);
    return newWidget;
  }

  updateWidget(id: string, updates: Partial<Omit<Widget, 'id'>>): Widget | null {
    const widget = this.widgets.get(id);
    if (!widget) return null;

    const updatedWidget: Widget = {
      ...widget,
      ...updates,
      id, // Ensure id doesn't change
    } as Widget;

    this.widgets.set(id, updatedWidget);
    return updatedWidget;
  }

  deleteWidget(id: string): boolean {
    return this.widgets.delete(id);
  }

  // Clear all widgets (useful for testing)
  clear(): void {
    this.widgets.clear();
  }
}

export const storage = new WidgetStorage();
