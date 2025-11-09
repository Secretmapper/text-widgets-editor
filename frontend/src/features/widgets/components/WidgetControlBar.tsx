import { useState } from 'react';
import { Trash2, X, Check, Loader2, AlertCircle } from 'lucide-react';

interface WidgetControlBarProps {
  onRemove: () => void;
  showSaved: boolean;
  isSaveError: boolean;
  isSavePending: boolean;
}

export const WidgetControlBar: React.FC<WidgetControlBarProps> = ({
  onRemove,
  showSaved,
  isSaveError,
  isSavePending,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    if (showDeleteConfirm) {
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleConfirmDelete = () => {
    onRemove();
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex justify-end items-center">
      <div className="flex gap-1 items-center">
        {!showDeleteConfirm && (
          <>
            {/* Mutation state indicators */}
            {isSavePending && (
              <span className="flex items-center gap-1 text-xs text-[#6b6b6b] mr-2">
                <Loader2 size={12} className="animate-spin" />
                Saving...
              </span>
            )}
            {showSaved && (
              <span className="flex items-center gap-1 text-xs text-[#4a9c6d] mr-2">
                <Check size={12} />
                Saved
              </span>
            )}
            {isSaveError && (
              <span className="flex items-center gap-1 text-xs text-[#d14343] mr-2">
                <AlertCircle size={12} />
                Error
              </span>
            )}
          </>
        )}

        {showDeleteConfirm ? (
          <div className="flex items-center gap-2 px-2 py-1 bg-[#fef2f2] rounded-md">
            <span className="text-xs text-[#2c2c2c]">Are you sure?</span>
            <button
              onClick={handleConfirmDelete}
              className="cursor-pointer p-1 text-[#4a9c6d] hover:bg-[#4a9c6d] hover:text-white rounded transition-colors"
              title="Confirm delete"
              type="button"
            >
              <Check size={14} />
            </button>
            <button
              onClick={handleCancelDelete}
              className="cursor-pointer p-1 text-[#d14343] hover:bg-[#d14343] hover:text-white rounded transition-colors"
              title="Cancel"
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleDeleteClick}
            className="cursor-pointer p-1.5 text-[#999] hover:text-[#d14343] hover:bg-[#fef2f2] rounded transition-colors"
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
