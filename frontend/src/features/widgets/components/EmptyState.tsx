import { Plus } from 'lucide-react';

interface EmptyStateProps {
  disabled?: boolean;
  onAdd: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ disabled = false, onAdd }) => {
  return (
    <div className="text-center py-16">
      <button
        onClick={onAdd}
        disabled={disabled}
        className="
          cursor-pointer
          flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-md
          text-white bg-[#1a1a1a]
          hover:bg-[#2c2c2c]
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          mx-auto
        "
      >
        <Plus size={18} />
        Add Text Widget
      </button>
    </div>
  );
};
