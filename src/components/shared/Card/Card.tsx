import { memo, useEffect, useRef, useState } from 'react';
import { ICoords, CanvasPosition } from '../../../types/types.ts';
import styles from './Card.module.css';
import svg from '../../assets/delete.svg';
import { throttle } from '../../../hooks/rafThrottle.ts';
import { useLatest } from '../../../hooks/useLatest.ts';

export interface CardProps {
  id: string;
  coords: ICoords;
  text: string;
  canvasCords: CanvasPosition;
  onChangeCords: (changeCard: { id: string; coords: ICoords }) => void;
  onChangeText: (id: string, text: string) => void;
  onDeleteCard: (id: string) => void;
}

export const Card = memo((props: CardProps) => {
  const { coords, text, canvasCords, id, onChangeCords, onChangeText, onDeleteCard } = props;
  const [grab, setGrab] = useState(false);
  const grabMode = grab ? 'grab' : '';

  const [localCoords, setLocalCoords] = useState<ICoords | null>(null);

  const latestCoords = useLatest(coords);
  const latestLocalCoords = useLatest(localCoords);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const offsetRef = useRef<ICoords | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const mouseMove = throttle((event: MouseEvent) => {
      if (event.button !== 0 || !offsetRef.current) return;

      const newCoords: ICoords = {
        x: (event.clientX - offsetRef.current.x) / canvasCords.scale - canvasCords.x / canvasCords.scale,
        y: (event.clientY - offsetRef.current.y) / canvasCords.scale - canvasCords.y / canvasCords.scale
      };
      setLocalCoords(newCoords);
    });

    const mouseUp = (event: MouseEvent) => {
      if (event.button !== 0) return;
      setGrab(false);
      offsetRef.current = null;
      setLocalCoords(null);
      onChangeCords({
        id,
        coords: latestLocalCoords.current ?? latestCoords.current
      });
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };

    const mouseDown = (event: MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;

      if (event.button !== 0) {
        return;
      }
      setGrab(true);

      setLocalCoords(latestCoords.current);
      offsetRef.current = {
        x: event.offsetX * canvasCords.scale,
        y: event.offsetY * canvasCords.scale
      };

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    };

    card.addEventListener('mousedown', mouseDown);

    return () => {
      card.removeEventListener('mousedown', mouseDown);
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseup', mouseUp);
    };
  }, [id, canvasCords, onChangeCords, latestLocalCoords, latestCoords]);

  const [canEdit, setCanEdit] = useState(true);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
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

  const cardCoords = localCoords ?? coords;
  return (
    <div
      className={styles.card}
      ref={cardRef}
      onDoubleClick={handleChangeEdit}
      style={{ cursor: `${grabMode}`, position: 'absolute', transform: `translate(${cardCoords.x}px, ${cardCoords.y}px)` }}
    >
      <div className={styles.removeIconWrapper}>
        <img src={svg} className={styles.removeIcon} onClick={() => onDeleteCard(id)} alt="Icon" width="20" height="20" />
      </div>
      <textarea
        ref={inputRef}
        value={text}
        onChange={(event) => onChangeText(id, event.target.value)}
        readOnly={canEdit}
        onBlur={handleBlur}
        className={styles.input}
        maxLength={250}
      />
    </div>
  );
});
