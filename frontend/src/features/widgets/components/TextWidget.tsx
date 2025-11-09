import { useState, useEffect, useRef } from 'react';
import type { TextWidget as TextWidgetType, WidgetProps } from '../types';

const DEBOUNCE_DELAY = 500; // ms

export const TextWidget: React.FC<WidgetProps<TextWidgetType>> = ({ data, onUpdate }) => {
  const { content } = data;
  const [value, setValue] = useState(content);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with prop changes (e.g., initial load)
  useEffect(() => {
    setValue(content);
  }, [content]);

  // Debounced auto-save
  useEffect(() => {
    // Don't save if value hasn't changed from the prop
    if (value === content) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to save after user stops typing
    timeoutRef.current = setTimeout(() => {
      onUpdate({ content: value });
    }, DEBOUNCE_DELAY);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, content, onUpdate]);

  return (
    <>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full min-h-[120px] p-4 rounded-md outline-none resize-vertical transition-all font-sans text-[#2c2c2c] leading-relaxed bg-white placeholder-[#999] mb-3"
        placeholder="Start typing your content here..."
        maxLength={10000}
      />

      {/* Status info - will be positioned inline with controls by container */}
      <div className="flex items-center gap-3 text-xs text-[#6b6b6b]">
        <span>{value.length.toLocaleString()} / 10,000 characters</span>
      </div>
    </>
  );
};
