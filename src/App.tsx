import React, { useRef, useState } from 'react';
import './App.css';
import Button from './components/shared/Button/Button.tsx';
import Card from './components/shared/Card/Card.tsx';
import { v4 as uuidv4 } from 'uuid';

const ZOOM_SENSITIVITY = 500;
const MAX_ZOOM = 4;
const MIN_ZOOM = 0.25;
interface Card {
  id: string;
  x: number;
  y: number;
  text: string;
}

const App = () => {
  const [creatingCard, setCreatingCard] = useState(false);
  const [cards, setCards] = useState<Record<string, Card>>({});
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  const isDragginCanvas = useRef(false);
  const [grabMode, setGrabMode] = useState(false);
  const handleButtonClick = () => {
    setCreatingCard(!creatingCard);
  };
  const handleZoom = (event: React.WheelEvent<HTMLDivElement>) => {
    const zoomFactor = 1 - event.deltaY / ZOOM_SENSITIVITY;

    setScale(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, scale * zoomFactor)));
  };

  const handleCanvasDrag = (event: React.MouseEvent) => {
    if (event.buttons === 1 && isDragginCanvas.current) {
      const newX = canvasPosition.x + event.movementX;
      const newY = canvasPosition.y + event.movementY;
      setCanvasPosition({ x: newX, y: newY });
      setGrabMode(true);
    }
  };

  const createCard = (x: number, y: number, text: string) => {
    const cardId = uuidv4();
    setCards((prevCards) => {
      const newCardData = { id: cardId, x, y, text };
      return { ...prevCards, [cardId]: newCardData };
    });
    setCreatingCard(false);
  };

  const handlePageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (creatingCard) {
      createCard(event.clientX, event.clientY, 'Text');
    }
  };

  const createCardMode = creatingCard ? 'creating-card-mode' : '';
  const grabClass = grabMode ? 'grab-card-mode' : '';
  return (
    <>
      <Button width={200} height={100} handleClick={handleButtonClick}>
        + Create the card
      </Button>
      <div
        className={createCardMode}
        onClick={handlePageClick}
        onWheel={handleZoom}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%'
        }}
      >
        <div
          className={grabClass}
          onMouseDown={() => (isDragginCanvas.current = true)}
          onMouseMove={handleCanvasDrag}
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%'
          }}
          onMouseUp={() => {
            isDragginCanvas.current = false;
            setGrabMode(false);
          }}
        ></div>
        <div
          style={{
            width: 0,
            height: 0,
            position: 'absolute',
            transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${scale})`,
            overflow: 'visible'
          }}
        >
          {Object.values(cards).map((cardData) => (
            <Card key={cardData.id} {...cardData} scale={scale} />
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
