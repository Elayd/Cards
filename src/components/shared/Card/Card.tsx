import styles from './Card.module.css';
import {useState, MouseEvent, ChangeEvent, useRef, useEffect, useCallback} from 'react';

export interface CardProps {
    id: string;
    x: number;
    y: number;
    scale: number;
}

const Card = (props: CardProps) => {

    const {x, y, scale} = props
    const [text, setText] = useState<string>('Text')

    const inputRef = useRef<HTMLInputElement>(null)

    const handleChangeText = (event: ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    const [position, setPosition] = useState({x: x, y: y });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [drag, setDrag] = useState(false);

    const handleMouseDown = (event: MouseEvent) => {
        setDrag(true)
        const offsetX = event.clientX - position.x;
        const offsetY = event.clientY - position.y;

        setDragOffset({
            x: offsetX,
            y: offsetY,
        });
    };

    const handleMouseMove = useCallback((event: MouseEvent) => {
        if (drag) {
            const newX = event.clientX - dragOffset.x;
            const newY = event.clientY - dragOffset.y;
            setPosition({ x: newX, y: newY });
        }
    }, [drag, dragOffset]);

    const onMouseUp = useCallback(() => {
        if (drag) {
            setDrag(false);
        }
    }, [drag]);

// todo : fix ts, and fixed propagation
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [handleMouseMove, onMouseUp]);


    const [canEdit, setCanEdit] = useState(true);

    const handleChangeEdit = () => {

        inputRef.current?.focus()
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
            style={{ position: 'absolute', transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}
        >
            <input
                type="text"
                ref={inputRef}
                value={text}
                onChange={handleChangeText}
                readOnly={canEdit}
                onBlur={handleBlur}
                className={styles.input}
            />
        </div>
    );
};

export default Card;
