import { useState } from 'react';
import { Trash2, X, Check } from 'lucide-react';

interface WidgetControlBarProps {
  widgetId: string;
  onDelete: (id: string) => void;
}

export const WidgetControlBar: React.FC<WidgetControlBarProps> = ({ widgetId, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    if (showDeleteConfirm) {
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleConfirmDelete = () => {
    onDelete(widgetId);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex justify-end items-center">
      <div className="flex gap-1 items-center">
        {showDeleteConfirm ? (
          <div className="flex items-center gap-2 px-2 py-1 bg-[#fef2f2] rounded-md">
            <span className="text-xs text-[#2c2c2c]">Are you sure?</span>
            <button
              onClick={handleConfirmDelete}
              className="p-1 text-[#4a9c6d] hover:bg-[#4a9c6d] hover:text-white rounded transition-colors"
              title="Confirm delete"
              type="button"
            >
              <Check size={14} />
            </button>
            <button
              onClick={handleCancelDelete}
              className="p-1 text-[#d14343] hover:bg-[#d14343] hover:text-white rounded transition-colors"
              title="Cancel"
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleDeleteClick}
            className="p-1.5 text-[#999] hover:text-[#d14343] hover:bg-[#fef2f2] rounded transition-colors"
            title="Delete"
            type="button"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
