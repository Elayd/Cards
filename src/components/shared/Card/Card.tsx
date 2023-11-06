import styles from './Card.module.css';
import {useState, MouseEvent, ChangeEvent, useRef} from 'react';

export interface CardProps {
    id: string;
    x: number;
    y: number;
}

const Card = (props: CardProps) => {

    const {x, y} = props

    const [text, setText] = useState<string>('Text')
    const inputRef = useRef<HTMLInputElement>(null)
    const handleChangeText = (event: ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };


    const [position, setPosition] = useState({x: x, y: y });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (event: MouseEvent) => {
        const offsetX = event.clientX - position.x;
        const offsetY = event.clientY - position.y;

        setDragOffset({
            x: offsetX,
            y: offsetY,
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (event: MouseEvent) => {
            const newX = event.clientX - dragOffset.x;
            const newY = event.clientY - dragOffset.y;
            setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };

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
            style={{ position: 'absolute', transform: `translate(${position.x}px, ${position.y}px)` }}
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
