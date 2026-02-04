import React, { useState } from 'react';
import { getItemUrl, isSlotWithItem } from '../../helpers';
import useNuiEvent from '../../hooks/useNuiEvent';
import { Items } from '../../store/items';
import WeightBar from '../utils/WeightBar';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';
import { SlotWithItem } from '../../typings';
import SlideUp from '../utils/transitions/SlideUp';

interface InventoryHotbarProps {
  inventoryOpen?: boolean;
}

const InventoryHotbar: React.FC<InventoryHotbarProps> = ({ inventoryOpen }) => {
  const [hotbarVisible, setHotbarVisible] = useState(false);
  const items = useAppSelector(selectLeftInventory).items.slice(0, 5);

  const [handle, setHandle] = useState<NodeJS.Timeout>();
  useNuiEvent('toggleHotbar', () => {
    if (inventoryOpen) return;
    if (hotbarVisible) {
      setHotbarVisible(false);
    } else {
      if (handle) clearTimeout(handle);
      setHotbarVisible(true);
      setHandle(setTimeout(() => setHotbarVisible(false), 3000));
    }
  });

  if (inventoryOpen) return null;

  return (
    <SlideUp in={hotbarVisible}>
      <div className={`hotbar-container${hotbarVisible ? ' hotbar-external' : ''}`}>
        {items.map((item) => (
          <div
            className="hotbar-item-slot"
            style={{
              backgroundImage: `url(${item?.name ? getItemUrl(item as SlotWithItem) : 'none'})`,
            }}
            key={`hotbar-${item.slot}`}
          >
            {isSlotWithItem(item) && (
              <div className="item-slot-wrapper">
                <div className="item-hotslot-header-wrapper">
                  <div className="inventory-slot-number">{item.slot}</div>
                  <div className="item-slot-info-wrapper">
                    <p>
                      {item.weight > 0
                        ? item.weight >= 1000
                          ? `${(item.weight / 1000).toLocaleString('en-us', { minimumFractionDigits: 2 })}kg `
                          : `${item.weight.toLocaleString('en-us', { minimumFractionDigits: 0 })}g `
                        : ''}
                    </p>
                    <p>{item.count ? item.count.toLocaleString('en-us') : ''}</p>
                  </div>
                </div>
                <div className="item-slot-spacer" />
                <div className="item-slot-footer">
                  {item?.durability !== undefined && <WeightBar percent={item.durability} durability />}
                  <div className="inventory-slot-label-box">
                    <div className="inventory-slot-label-text">
                      {item.metadata?.label ? item.metadata.label : Items[item.name]?.label || item.name}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </SlideUp>
  );
};

export default InventoryHotbar;
