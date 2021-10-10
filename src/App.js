import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { v4 as uuidv4 } from 'uuid';
import randomColor from 'randomcolor';

import useMousePosition from './useMousePosition'
import './style.scss';


function App() {
  const [stickers, setStickers] = useState(
    JSON.parse(localStorage.getItem('stickers')) || []
  );
  const [editing, setEditing] = useState(null);
  const { x, y } = useMousePosition();
  const nodeRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('stickers', JSON.stringify(stickers));
  }, [stickers]);

  const newSticker = () => {
    const newSticker = {
      id: uuidv4(),
      text: 'Here is your text... Double-click to modify it',
      color: randomColor({
        luminosity: 'light',
      }),
      defaultPos: { x: x, y: y - 50 },
    };
    setStickers((stickers) => [...stickers, newSticker]);
  };

  const updatePosition = (data, index) => {
    let newArr = [...stickers];
    newArr[index].defaultPos = { x: data.x, y: data.y };
    setStickers(newArr);
  };

  const updateText = (data, index) => {
    let newArr = [...stickers];
    newArr[index].text = data;
    setStickers(newArr);
  };

  const deleteSticket = (id) => {
    setStickers(stickers.filter((item) => item.id !== id));
  };

  return (
    <div onDoubleClick={newSticker}>
      <div className='board'>
        <h1 className='title'>
          {stickers.length > 0
            ? null
            : 'Double-click to create a sticker'}
        </h1>
        {stickers.map((item, index) =>
          <Draggable
            nodeRef={nodeRef}
            key={item.id}
            defaultPosition={item.defaultPos}
            onStop={(e, data) => {
              updatePosition(data, index);
            }}
            bounds={{ left: 0, top: 0 }}
          >
            <div ref={nodeRef} style={{ backgroundColor: item.color }}
              onDoubleClick={(e) => e.stopPropagation(setEditing(item.id === editing
                ? null
                : item.id))}
              onMouseLeave={() => setEditing(null)}
              className='box'>
              {editing === item.id
                ?
                (<textarea
                  value={item.text}
                  type='text'
                  autoFocus
                  onChange={(e) => { updateText(e.target.value, index) }} />)
                :
                (<p>{item.text}</p>)}
              <svg onClick={(e) => deleteSticket(item.id)} className="card__btn" width="17px" height="17px" viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
                <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
                  <g id="24-px-Icons" transform="translate(-364.000000, -124.000000)" stroke="#000000">
                    <g id="ic_cancel" transform="translate(360.000000, 120.000000)">
                      <g id="cross">
                        <g transform="translate(5.000000, 5.000000)" strokeWidth="3">
                          <path d="M0,0 L14.1421356,14.1421356" id="Line"></path>
                          <path d="M14,0 L1.77635684e-15,14" id="Line"></path>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </Draggable>
        )}
      </div>
    </div>
  );
}

export default App;
