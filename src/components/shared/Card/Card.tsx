import styles from './Card.module.css';
import { useState, ChangeEvent, useRef, useEffect, useCallback, MouseEventHandler } from 'react';

export interface CardProps {
  id: string;
  x: number;
  y: number;
  text: string;
  scale: number;
}

const Card = (props: CardProps) => {
  const { x, y, text, scale } = props;
  const [cardText, setCardText] = useState<string>(text);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChangeText = (event: ChangeEvent<HTMLInputElement>) => {
    setCardText(event.target.value);
  };

  const [position, setPosition] = useState({ x: x, y: y });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState(false);

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      setDrag(true);
      const offsetX = event.clientX - position.x * scale;
      const offsetY = event.clientY - position.y * scale;

      setDragOffset({
        x: offsetX,
        y: offsetY
      });
    },
    [position.x, position.y, scale]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (drag) {
        const newX = (event.clientX - dragOffset.x) / scale;
        const newY = (event.clientY - dragOffset.y) / scale;
        setPosition({ x: newX, y: newY });
      }
    },
    [drag, dragOffset, scale]
  );

  const onMouseUp = useCallback(() => {
    if (drag) {
      setDrag(false);
    }
  }, [drag]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [handleMouseMove, onMouseUp, drag, handleMouseDown]);

  const [canEdit, setCanEdit] = useState(true);

  const handleChangeEdit = () => {
    inputRef.current?.focus();
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cardText.length, cardText.length);
    }
    setCanEdit(false);
  };

  const handleBlur = () => {
    setCanEdit(true);
  };

  return (
    <div
      className={`${styles.card} ${canEdit ? '' : styles.canEdit}`}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleChangeEdit}
      style={{ position: 'absolute', transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <input
        type="text"
        ref={inputRef}
        value={cardText}
        onChange={handleChangeText}
        readOnly={canEdit}
        onBlur={handleBlur}
        className={styles.input}
      />
    </div>
  );
};

export default Card;
