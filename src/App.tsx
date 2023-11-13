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

  const handleButtonClick = () => {
    setCreatingCard(!creatingCard);
  };
  const handleZoomIn = () => {
    if (Object.keys(cards).length > 0) {
      setScale(scale * 1.01);
    }
  };

  const handleZoomOut = () => {
    if (Object.keys(cards).length > 0) {
      setScale(scale * 0.99);
    }
  };

  const handleCanvasDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
  // todo: canvas moving from div
  return (
    <>
      <Button width={200} height={100} handleClick={handleButtonClick}>
        + Create the card
      </Button>
      <div
        onMouseMove={handleCanvasDrag}
        onWheel={(e) => {
          if (e.deltaY > 0) {
            handleZoomOut();
          } else {
            handleZoomIn();
          }
        }}
        onClick={handlePageClick}
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          background: 'red',
          transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px)`
        }}
        className={createCardMode}
      >
        {Object.values(cards).map((cardData) => (
          <Card text={cardData.text} scale={scale} key={cardData.id} id={cardData.id} x={cardData.x} y={cardData.y} />
        ))}
      </div>
    </>
  );
};

export default App;
