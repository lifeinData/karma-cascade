interface GemProps {
  color: string;
  id: string;
  row: number;
  col: number;
  onClick: (row: number, col: number) => void;
  isSelected: boolean;
}

const Gem = ({ color, id, row, col, onClick, isSelected }: GemProps) => {
  const handleClick = () => {
    onClick(row, col);
  };

  const gemClass = isSelected ? 'gem selected' : 'gem';

  return (
    <div className={gemClass} style={{ backgroundColor: color }} onClick={handleClick}>
      {/* Gem content */}
    </div>
  );
};

export default Gem;