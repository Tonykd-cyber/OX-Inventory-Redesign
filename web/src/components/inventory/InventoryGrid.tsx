import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory, SlotWithItem } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight, getItemUrl, isSlotWithItem } from '../../helpers';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectItemAmount, setItemAmount } from '../../store/inventory';
import { useIntersection } from '../../hooks/useIntersection';
import { fetchNui } from '../../utils/fetchNui';
import { Locale } from '../../store/locale';
import { Items } from '../../store/items';

const PAGE_SIZE = 30;
const HOTBAR_SLOTS = [1, 2, 3, 4, 5];

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);
  const itemAmount = useAppSelector(selectItemAmount);
  const dispatch = useAppDispatch();
  const isPlayer = inventory.type === 'player';

  const hotbarItems = useMemo(() => {
    return HOTBAR_SLOTS.map((slot) => inventory.items.find((i) => i.slot === slot) ?? { slot });
  }, [inventory.items]);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.valueAsNumber;
    const n = isNaN(v) || v < 0 ? 0 : Math.floor(v);
    dispatch(setItemAmount(n));
  };

  return (
    <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
      <div className="inventory-grid-header-wrapper">
        <p>{inventory.label || 'Your Inventory'}</p>
        {isPlayer && (
          <button
            type="button"
            className="inventory-header-close"
            onClick={() => fetchNui('exit')}
            aria-label={Locale.ui_close || 'Close'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.25rem" height="1.25rem" viewBox="0 0 384 512" fill="currentColor">
              <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
            </svg>
          </button>
        )}
      </div>
      {inventory.maxWeight !== undefined && (
        <div className="inventory-grid-weight-row">
          <div className="inventory-weight-text">
            {(weight / 1000).toFixed(2)} / {(inventory.maxWeight / 1000).toFixed(2)} kg
          </div>
          <div className="inventory-weight-bar-wrap">
            <WeightBar percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0} />
          </div>
          {isPlayer && (
            <input
              type="number"
              min={0}
              value={itemAmount}
              onChange={inputHandler}
              className="inventory-weight-input"
              aria-label="Item amount"
            />
          )}
        </div>
      )}
      <div className={isPlayer ? 'inventory-grid-hotbar-block' : 'inventory-grid-container-standalone'}>
        <div className="inventory-grid-container" ref={containerRef}>
          {inventory.items.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
            <InventorySlot
              key={`${inventory.type}-${inventory.id}-${item.slot}`}
              item={item}
              ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
              inventoryType={inventory.type}
              inventoryGroups={inventory.groups}
              inventoryId={inventory.id}
            />
          ))}
        </div>
        {isPlayer && (
          <div className="inventory-hotbar-inline">
            {hotbarItems.map((item) => (
              <div
                key={`hotbar-inline-${item.slot}`}
                className="hotbar-item-slot"
                style={{
                  backgroundImage: `url(${item?.name ? getItemUrl(item as SlotWithItem) : 'none'})`,
                }}
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
        )}
      </div>
    </div>
  );
};

export default InventoryGrid;
