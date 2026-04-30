const ASSETS = [
  { name: 'House', icon: '🏠', category: 'House' },
  { name: 'Gold', icon: '🥇', category: 'Gold' },
  { name: 'Car', icon: '🚗', category: 'Car' },
  { name: 'Laptop', icon: '💻', category: 'Laptop' },
  { name: 'Phone', icon: '📱', category: 'Phone' },
  { name: 'Watch', icon: '⌚', category: 'Watch' },
  { name: 'Bike', icon: '🚲', category: 'Bike' },
  { name: 'Jewelry', icon: '💎', category: 'Jewelry' },
];

interface AssetGridProps {
  onAssetClick: (name: string, icon: string) => void;
}

export function AssetGrid({ onAssetClick }: AssetGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
      {ASSETS.map(asset => (
        <div
          key={asset.name}
          className="asset-item"
          onClick={() => onAssetClick(asset.name, asset.icon)}
        >
          <div className="text-xl md:text-2xl mb-1">{asset.icon}</div>
          <div className="text-xs font-medium">{asset.name}</div>
        </div>
      ))}
    </div>
  );
}
