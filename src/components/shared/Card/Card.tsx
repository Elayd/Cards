import { memo, useCallback, useEffect, useRef, useState } from 'react';
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
  const [grab, setGrab] = useState(false);
  const grabMode = grab ? 'grab' : '';

  const cardRef = useRef<HTMLInputElement | null>(null);

  const offsetRef = useRef<ICoords | null>(null);

  const mouseMove = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (event.button !== 0 || !offsetRef.current) return;

      const newCoords: ICoords = {
        x: (event.clientX - offsetRef.current.x) / canvasCords.scale - canvasCords.x / canvasCords.scale,
        y: (event.clientY - offsetRef.current.y) / canvasCords.scale - canvasCords.y / canvasCords.scale
      };
      onChangeCords({
        id,
        coords: newCoords
      });
    },
    [canvasCords, id, onChangeCords]
  );

  const mouseUp = useCallback(
    (event: MouseEvent) => {
      if (event.button !== 0) return;
      setGrab(false);
      offsetRef.current = null;
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    },
    [mouseMove]
  );

  const mouseDown = useCallback(
    (event: MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      if (event.button !== 0) {
        return;
      }
      setGrab(true);

      offsetRef.current = {
        x: event.clientX - rect.x,
        y: event.clientY - rect.y
      };

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    },
    [mouseMove, mouseUp]
  );

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    card.addEventListener('mousedown', mouseDown);

    return () => {
      card.removeEventListener('mousedown', mouseDown);
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };
  }, [id, canvasCords, onChangeCords, mouseDown, mouseMove, mouseUp]);

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
      style={{ cursor: `${grabMode}`, position: 'absolute', transform: `translate(${coords.x}px, ${coords.y}px)` }}
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
