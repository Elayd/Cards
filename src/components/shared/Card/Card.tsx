import { memo, useEffect, useRef, useState } from 'react';
import { ICoords, CanvasPosition } from '../../../types/types.ts';
import styles from './Card.module.css';

export interface CardProps {
  id: string;
  coords: ICoords;
  text: string;
  canvasCords: CanvasPosition;
  onChangeCords: (changeCard: { id: string; coords: ICoords }) => void;
  onChangeText: (id: string, text: string) => void;
}

export const Card = memo((props: CardProps) => {
  const { coords, text, canvasCords, id, onChangeCords, onChangeText } = props;

  const cardRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const mouseDown = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      if (event.button !== 0) {
        return;
      }

      const offset: ICoords = {
        x: event.clientX - rect.x,
        y: event.clientY - rect.y
      };

      const mouseMove = (event: MouseEvent) => {
        event.preventDefault();
        if (event.button !== 0) return;
        const newCoords: ICoords = {
          x: (event.clientX - offset.x) / canvasCords.scale - canvasCords.x / canvasCords.scale,
          y: (event.clientY - offset.y) / canvasCords.scale - canvasCords.y / canvasCords.scale
        };
        onChangeCords({
          id,
          coords: newCoords
        });
      };

      const mouseUp = (event: MouseEvent) => {
        if (event.button !== 0) return;
        document.removeEventListener('mousemove', mouseMove);
      };

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    };

    card.addEventListener('mousedown', mouseDown);
    return () => {
      card.removeEventListener('mousedown', mouseDown);
    };
  }, [id, canvasCords, onChangeCords]);

  const [canEdit, setCanEdit] = useState(true);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleBlur = () => {
    setCanEdit(true);
  };
  const handleChangeEdit = () => {
    inputRef.current?.focus();
    if (inputRef.current) {
      inputRef.current.setSelectionRange(text.length, text.length);
    }
    setCanEdit(false);
  };

  return (
    <div
      className={styles.card}
      ref={cardRef}
      onDoubleClick={handleChangeEdit}
      style={{ position: 'absolute', transform: `translate(${coords.x}px, ${coords.y}px)` }}
    >
      <input
        type="text"
        ref={inputRef}
        value={text}
        onChange={(event) => onChangeText(id, event.target.value)}
        readOnly={canEdit}
        onBlur={handleBlur}
        className={styles.input}
      />
    </div>
  );
});
