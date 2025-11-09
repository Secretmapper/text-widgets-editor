import { describe, it, expect, beforeEach } from 'vitest';
import { v4 as uuidv4 } from 'uuid';

import { storage } from './storage.js';

beforeEach(() => {
  storage.clear();
});

describe('WidgetStorage', () => {
  describe('createWidget', () => {
    it('should create a widget with client-generated UUID', () => {
      const id = uuidv4();
      const widget = storage.createWidget({
        id,
        type: 'text',
        data: { content: 'Hello World' },
        position: 0,
      });

      expect(widget.id).toBe(id);
      expect(widget.type).toBe('text');
      expect(widget.data.content).toBe('Hello World');
      expect(widget.position).toBe(0);
    });

    it('should handle large text content', () => {
      const id = uuidv4();
      const largeText = 'a'.repeat(1000);
      const widget = storage.createWidget({
        id,
        type: 'text',
        data: { content: largeText },
        position: 0,
      });

      expect(widget.data.content).toBe(largeText);
      expect(widget.data.content.length).toBe(1000);
    });

    it('should create multiple widgets with different UUIDs', () => {
      const id1 = uuidv4();
      const id2 = uuidv4();

      storage.createWidget({
        id: id1,
        type: 'text',
        data: { content: 'Widget 1' },
        position: 0,
      });

      storage.createWidget({
        id: id2,
        type: 'text',
        data: { content: 'Widget 2' },
        position: 1,
      });

      const widgets = storage.getAllWidgets();
      expect(widgets).toHaveLength(2);
      expect(widgets[0].id).toBe(id1);
      expect(widgets[1].id).toBe(id2);
    });
  });

  describe('getAllWidgets', () => {
    it('should return empty array when no widgets exist', () => {
      const widgets = storage.getAllWidgets();
      expect(widgets).toEqual([]);
    });

    it('should return widgets sorted by position', () => {
      storage.createWidget({ id: uuidv4(), type: 'text', data: { content: 'Third' }, position: 2 });
      storage.createWidget({ id: uuidv4(), type: 'text', data: { content: 'First' }, position: 0 });
      storage.createWidget({
        id: uuidv4(),
        type: 'text',
        data: { content: 'Second' },
        position: 1,
      });

      const widgets = storage.getAllWidgets();

      expect(widgets).toHaveLength(3);
      expect(widgets[0].data.content).toBe('First');
      expect(widgets[1].data.content).toBe('Second');
      expect(widgets[2].data.content).toBe('Third');
    });
  });

  describe('getWidget', () => {
    it('should retrieve widget by ID', () => {
      const id = uuidv4();
      const created = storage.createWidget({
        id,
        type: 'text',
        data: { content: 'Test' },
        position: 0,
      });

      const retrieved = storage.getWidget(created.id);

      expect(retrieved).toEqual(created);
    });

    it('should return null for non-existent ID', () => {
      const widget = storage.getWidget(uuidv4());
      expect(widget).toBeNull();
    });
  });

  describe('updateWidget', () => {
    it('should update widget content', async () => {
      const id = uuidv4();
      const widget = storage.createWidget({
        id,
        type: 'text',
        data: { content: 'Original' },
        position: 0,
      });

      const updated = storage.updateWidget(widget.id, {
        data: { content: 'Updated' },
      });

      expect(updated?.data.content).toBe('Updated');
      expect(updated?.id).toBe(widget.id);
    });

    it('should return null for non-existent widget', () => {
      const result = storage.updateWidget(uuidv4(), {
        data: { content: 'Test' },
      });

      expect(result).toBeNull();
    });

    it('should preserve id when updating', () => {
      const id = uuidv4();
      storage.createWidget({
        id,
        type: 'text',
        data: { content: 'Original' },
        position: 0,
      });

      const updated = storage.updateWidget(id, { data: { content: 'Updated' } });
      expect(updated?.id).toBe(id);
    });
  });

  describe('deleteWidget', () => {
    it('should delete existing widget', () => {
      const id = uuidv4();
      const widget = storage.createWidget({
        id,
        type: 'text',
        data: { content: 'To Delete' },
        position: 0,
      });

      const deleted = storage.deleteWidget(widget.id);

      expect(deleted).toBe(true);
      expect(storage.getWidget(widget.id)).toBeNull();
    });

    it('should return false for non-existent widget', () => {
      const deleted = storage.deleteWidget(uuidv4());
      expect(deleted).toBe(false);
    });

    it('should only delete specified widget', () => {
      const id1 = uuidv4();
      const id2 = uuidv4();

      storage.createWidget({ id: id1, type: 'text', data: { content: 'Widget 1' }, position: 0 });
      storage.createWidget({ id: id2, type: 'text', data: { content: 'Widget 2' }, position: 1 });

      storage.deleteWidget(id1);

      const widgets = storage.getAllWidgets();
      expect(widgets).toHaveLength(1);
      expect(widgets[0].id).toBe(id2);
    });
  });

  describe('clear', () => {
    it('should clear all widgets', () => {
      const id1 = uuidv4();
      const id2 = uuidv4();

      storage.createWidget({ id: id1, type: 'text', data: { content: 'Widget 1' }, position: 0 });
      storage.createWidget({ id: id2, type: 'text', data: { content: 'Widget 2' }, position: 1 });

      storage.clear();

      const widgets = storage.getAllWidgets();
      expect(widgets).toHaveLength(0);
    });
  });
});
