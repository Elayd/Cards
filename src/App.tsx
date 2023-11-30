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
    const canvasRect = backgroundRef.current?.getBoundingClientRect();

    if (creatingCard && canvasRect) {
      const canvasX = (event.clientX - canvasRect.left) / canvasPosition.scale - canvasPosition.x / canvasPosition.scale;
      const canvasY = (event.clientY - canvasRect.top) / canvasPosition.scale - canvasPosition.y / canvasPosition.scale;

      createCard({ x: canvasX, y: canvasY }, 'Text');
    }
  };

  const createCardMode = creatingCard ? 'creating-card-mode' : '';

  const backgroundRef = useRef<HTMLDivElement>(null);
  const [canvasPosition, setCanvasPosition] = useState<CanvasPosition>({
    x: 0,
    y: 0,
    scale: 1
  });

  const handleZoom = (event: React.WheelEvent<HTMLDivElement>) => {
    const zoomFactor = 1 - event.deltaY / ZOOM_SENSITIVITY;

    const rect = backgroundRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const originX = (mouseX - canvasPosition.x) / canvasPosition.scale;
    const originY = (mouseY - canvasPosition.y) / canvasPosition.scale;

    const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, canvasPosition.scale * zoomFactor));

    setCanvasPosition((prevCanvasPos) => ({
      ...prevCanvasPos,
      scale: newScale,
      x: mouseX - originX * newScale,
      y: mouseY - originY * newScale
    }));
  };

  const prevCordsRef = useRef<ICoords>({ x: 0, y: 0 });
  const [grab, setGrab] = useState(false);

  const grabMode = grab ? 'grab-card-mode' : '';

  const mouseMove = useCallback((event: MouseEvent) => {
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
  }, []);

  const mouseUp = useCallback(
    (event: MouseEvent) => {
      if (event.button !== 0) {
        return;
      }
      setGrab(false);
      document.removeEventListener('mousemove', mouseMove);
    },
    [mouseMove]
  );

  const mouseDown = useCallback(
    (event: MouseEvent) => {
      if (event.button !== 0) {
        return;
      }
      setGrab(true);
      prevCordsRef.current = { x: event.clientX, y: event.clientY };

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    },
    [mouseMove, mouseUp]
  );

  useEffect(() => {
    const background = backgroundRef.current;

    if (!background) return;

    background.addEventListener('mousedown', mouseDown);

    return () => {
      background.removeEventListener('mousedown', mouseDown);
      document.removeEventListener('mouseup', mouseUp);
      document.removeEventListener('mousemove', mouseMove);
    };
  }, [mouseDown, mouseMove, mouseUp]);

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

      <div style={{ position: 'relative' }} onWheel={handleZoom}>
        <div
          className={`${grabMode} ${createCardMode}`}
          onClick={handlePageClick}
          ref={backgroundRef}
          style={{
            transform: `scale(${canvasPosition.scale})`,
            position: 'fixed',
            inset: inset,
            backgroundPosition: `${canvasPosition.x / canvasPosition.scale}px ${canvasPosition.y / canvasPosition.scale}px`,
            backgroundImage: 'url("https://svgshare.com/i/eGa.svg")',
            zIndex: 0
          }}
        />
        <div
          style={{
            width: 0,
            height: 0,
            position: 'absolute',
            overflow: 'visible',
            transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${canvasPosition.scale})`
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
