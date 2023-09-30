import styles from './Card.module.css';
import {useState, MouseEvent, ChangeEvent} from 'react';

interface CardProps {
    x: number;
    y: number;
}

const Card = (props: CardProps) => {

    const {x, y} = props

    const [text, setText] = useState<string>('Text')

    const handleChangeText = (event: ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };


    const [position, setPosition] = useState({x: x, y: y });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setDragOffset({
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        });
    };

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            const newX = event.clientX - dragOffset.x;
            const newY = event.clientY - dragOffset.y;
            setPosition({ x: newX, y: newY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const [canEdit, setCanEdit] = useState(true);

    const handleChangeEdit = () => {
        setCanEdit(false);
    };

    const handleBlur = () => {
        setCanEdit(true);
    };

    return (
        <div
            className={styles.card}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ position: 'absolute', left: position.x, top: position.y }}
        >
            <input
                type="text"
                value={text}
                onChange={handleChangeText}
                readOnly={canEdit}
                onDoubleClick={handleChangeEdit}
                onBlur={handleBlur}
                className={styles.input}
            />
        </div>
    );
};

export default Card;
