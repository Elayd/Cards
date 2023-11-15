import React, { useState } from 'react';
import './App.css';
import Button from './components/shared/Button/Button.tsx';
import Card, { CardProps } from './components/shared/Card/Card.tsx';
import { v4 as uuidv4 } from 'uuid';
const App = () => {
  const [creatingCard, setCreatingCard] = useState(false);
  const [cards, setCards] = useState<Record<string, CardProps>>({});
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const ZOOM_SENSITIVITY = 500;

  const handleButtonClick = () => {
    setCreatingCard(!creatingCard);
  };
  const handleZoom = (event: React.WheelEvent<HTMLDivElement>) => {
    const zoomFactor = 1 - event.deltaY / ZOOM_SENSITIVITY;
    if (Object.keys(cards).length > 0) {
      setScale(scale * zoomFactor);
    }
  };

  const handleCanvasDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(event.type);
    if (event.buttons === 1) {
      const newX = canvasPosition.x + event.movementX;
      const newY = canvasPosition.y + event.movementY;
      setCanvasPosition({ x: newX, y: newY });
    }
  };

  const createCard = (x: number, y: number, text: string) => {
    const cardId = uuidv4();
    setCards((prevCards) => {
      const newCardData: CardProps = { id: cardId, x, y, scale: 1, text };
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
  return (
    <>
      <Button width={200} height={100} handleClick={handleButtonClick}>
        + Create the card
      </Button>
      <div
        className={createCardMode}
        onClick={handlePageClick}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%'
        }}
      >
        <div
          onMouseMove={handleCanvasDrag}
          onWheel={handleZoom}
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            background: 'red',
            opacity: '0.4',
            transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px)`
          }}
        />
        <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
          {Object.values(cards).map((cardData) => (
            <Card text={cardData.text} scale={scale} key={cardData.id} id={cardData.id} x={cardData.x} y={cardData.y} />
          ))}
        </div>
      </div>
    </>
  );
};

export default App;
