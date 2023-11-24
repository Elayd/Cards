import styles from './Card.module.css';
import { useState, useRef, useEffect, memo } from 'react';
import { useLatest } from '../../../hooks/useLatest.ts';
import { CanvasPosition, ICoords } from '../../../types/types.ts';

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

  const [startPosition, setStartPosition] = useState<ICoords | null>(coords);
  const [canEdit, setCanEdit] = useState(true);

  const handleChangeEdit = () => {
    inputRef.current?.focus();
    if (inputRef.current) {
      inputRef.current.setSelectionRange(text.length, text.length);
    }
    setCanEdit(false);
  };

  const handleBlur = () => {
    setCanEdit(true);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const cardRef = useRef<HTMLInputElement | null>(null);

  const latestCanvasCords = useLatest(canvasCords);

  const latestStartCords = useLatest(startPosition);

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
        setStartPosition({
          x: (event.clientX - offset.x) / latestCanvasCords.current.scale - latestCanvasCords.current?.x / latestCanvasCords.current.scale,
          y: (event.clientY - offset.y) / latestCanvasCords.current.scale - latestCanvasCords.current.y / latestCanvasCords.current.scale
        });
      };

      const mouseUp = (event: MouseEvent) => {
        if (event.button !== 0) return;
        document.removeEventListener('mousemove', mouseMove);
        if (latestStartCords.current !== null) {
          onChangeCords({ id, coords: latestStartCords.current });
        }
        setStartPosition(null);
      };

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    };

    document.addEventListener('mousedown', mouseDown);
    return () => {
      document.removeEventListener('mousedown', mouseDown);
    };
  }, [coords, id, latestCanvasCords, latestStartCords, onChangeCords]);
  return (
    <div
      className={`${styles.card} ${canEdit ? '' : styles.canEdit}`}
      ref={cardRef}
      onDoubleClick={handleChangeEdit}
      style={{ position: 'absolute', transform: `translate(${startPosition?.x}px, ${startPosition?.y}px)` }}
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
