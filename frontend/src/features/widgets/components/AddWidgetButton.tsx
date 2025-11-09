import { Plus } from 'lucide-react';

interface AddWidgetButtonProps {
  position: number;
  disabled?: boolean;
  onAdd: (position: number) => void;
}

export const AddWidgetButton: React.FC<AddWidgetButtonProps> = ({
  position,
  disabled = false,
  onAdd,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onAdd(position);
    }
  };

  return (
    <div className="relative group my-4 flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={disabled}
        className="
          p-2 rounded-full
          text-black border border-[#1a1a1a]
          hover:text-white hover:bg-[#1a1a1a]
          transition-all duration-200
          opacity-40 hover:opacity-100
          disabled:opacity-30 disabled:cursor-not-allowed
        "
        title="Add Text Widget"
      >
        <Plus size={16} />
      </button>
      <span
        onClick={handleClick}
        className="text-xs text-[#999] opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
      >
        Add Text Widget
      </span>
    </div>
  );
};
