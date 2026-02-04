import React, { useState } from 'react';
import UsefulControls from './UsefulControls';

/** 图二风格：仅保留 UsefulControls 弹窗与 (i) 按钮，使用/给予/关闭改为右键菜单与 ESC */
const InventoryControl: React.FC = () => {
  const [infoVisible, setInfoVisible] = useState(false);

  return (
    <>
      <UsefulControls infoVisible={infoVisible} setInfoVisible={setInfoVisible} />
      <button className="useful-controls-button" onClick={() => setInfoVisible(true)} aria-label="Useful controls">
        <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 524 524">
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
        </svg>
      </button>
    </>
  );
};

export default InventoryControl;
