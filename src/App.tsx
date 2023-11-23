import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import Button from './components/shared/Button/Button.tsx';
import { Card } from './components/shared/Card/Card.tsx';
import { v4 as uuidv4 } from 'uuid';
import { CanvasPosition, ICoords } from './types/types.ts';

const ZOOM_SENSITIVITY = 500;
const MAX_ZOOM = 4;
const MIN_ZOOM = 0.25;
interface Card {
  id: string;
  coords: ICoords;
  text: string;
}

const App = () => {
  const [creatingCard, setCreatingCard] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const handleButtonClick = () => {
    setCreatingCard(!creatingCard);
  };

  const createCard = (coords: ICoords, text: string) => {
    const cardId = uuidv4();
    const newCardData = { id: cardId, coords, text };
    setCards((prevCards) => [...prevCards, newCardData]);
    setCreatingCard(false);
  };

  const handlePageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const coords = { x: event.clientX / canvasPosition.scale, y: event.clientY / canvasPosition.scale };
    if (creatingCard) {
      createCard(coords, 'Text');
    }
  };

  const createCardMode = creatingCard ? 'creating-card-mode' : '';

  const backgroundRef = useRef<HTMLElement | null>(null);
  const [canvasPosition, setCanvasPosition] = useState<CanvasPosition>({
    x: 0,
    y: 0,
    scale: 1
  });

  const handleZoom = (event: React.WheelEvent<HTMLDivElement>) => {
    const zoomFactor = 1 - event.deltaY / ZOOM_SENSITIVITY;
    setCanvasPosition((prevCanvasPos) => ({
      ...prevCanvasPos,
      scale: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevCanvasPos.scale * zoomFactor))
    }));
  };

  const prevCordsRef = useRef<ICoords>({ x: 0, y: 0 });
  const backgroundRefCb = useCallback((el: HTMLElement | null) => {
    backgroundRef.current = el;
  }, []);

  useEffect(() => {
    const background = backgroundRef.current;

    if (!background) return;

    const mouseDown = (event: MouseEvent) => {
      if (event.button !== 0) {
        return;
      }
      prevCordsRef.current = { x: event.clientX, y: event.clientY };

      const mouseMove = (event: MouseEvent) => {
        if (event.button !== 0) {
          return;
        }
        const newCords: ICoords = { x: event.clientX, y: event.clientY };
        const prevCords = prevCordsRef.current;

        const diffX = newCords.x - prevCords.x;
        const diffY = newCords.y - prevCords.y;
        setCanvasPosition((prevCanvasPos) => {
          return {
            ...prevCanvasPos,
            x: prevCanvasPos.x + diffX,
            y: prevCanvasPos.y + diffY
          };
        });
        prevCordsRef.current = newCords;
      };

      const mouseUp = (event: MouseEvent) => {
        if (event.button !== 0) {
          return;
        }
        background.removeEventListener('mousemove', mouseMove);
      };
      background.addEventListener('mousemove', mouseMove);
      background.addEventListener('mouseup', mouseUp);
    };
    background.addEventListener('mousedown', mouseDown);

    return () => {
      background.removeEventListener('mousedown', mouseDown);
    };
  }, []);

  const inset: `${number}%` = `${(100 - 100 / canvasPosition.scale) / 2}%`;

  const handleCordsChange = useCallback((updatedCard: { id: string; coords: ICoords }) => {
    setCards((prev) => {
      return prev.map((card) => {
        if (card.id !== updatedCard.id) {
          return card;
        }
        return {
          ...card,
          coords: {
            ...card.coords,
            x: updatedCard.coords.x,
            y: updatedCard.coords.y
          }
        };
      });
    });
  }, []);

  const handleChangeText = useCallback((id: string, text: string) => {
    setCards((prev) => {
      return prev.map((card) => {
        if (card.id !== id) {
          return card;
        }
        return {
          ...card,
          coords: { ...card.coords },
          text: text
        };
      });
    });
  }, []);

  return (
    <>
      <Button width={200} height={100} handleClick={handleButtonClick}>
        + Create the card
      </Button>

      <div style={{ position: 'relative' }}>
        <div
          className={createCardMode}
          onClick={handlePageClick}
          onWheel={handleZoom}
          ref={backgroundRefCb}
          style={{
            transform: `scale(${canvasPosition.scale})`,
            position: 'fixed',
            inset: inset,
            backgroundImage: 'url("https://svgshare.com/i/eGa.svg")',
            backgroundPosition: `${canvasPosition.x / canvasPosition.scale}px ${canvasPosition.y / canvasPosition.scale}`,
            zIndex: 0
          }}
        />
        <div
          style={{
            width: 0,
            height: 0,
            position: 'relative',
            transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${canvasPosition.scale})`,
            overflow: 'visible',
            zIndex: 1
          }}
        >
          {cards.map((cardData) => (
            <Card
              onChangeText={handleChangeText}
              id={cardData.id}
              text={cardData.text}
              canvasCords={canvasPosition}
              key={cardData.id}
              onChangeCords={handleCordsChange}
              coords={cardData.coords}
            />
          ))}
        </div>
      </div>
    </>
  );
};
export default App;
