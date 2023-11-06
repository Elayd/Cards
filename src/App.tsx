import React, { useState } from 'react';
import './App.css';
import Button from "./components/shared/Button/Button.tsx";
import Card, {CardProps} from "./components/shared/Card/Card.tsx";
import { v4 as uuidv4 } from 'uuid';
const App = () => {
    const [creatingCard, setCreatingCard] = useState(false);
    const [cards, setCards] = useState<Record<string, CardProps>>({})
    const handleButtonClick = () => {
        setCreatingCard(!creatingCard);
    };

    const createCard = (x: number, y: number) => {
        const cardId = uuidv4();
        const newCardData: CardProps = { id: cardId, x, y };
        setCards({ ...cards, [cardId]: newCardData });
        setCreatingCard(false);
    };

    const handlePageClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (creatingCard) {
            createCard(event.clientX, event.clientY);
        }
    };


    const createCardMode = creatingCard ? 'creating-card-mode' : '';

    return (
        <>
            <div className={'header'}>
            <Button width={200} height={100} handleClick={handleButtonClick}>
                + Создать карточку
            </Button>
            </div>
            <div onClick={handlePageClick} style={{ height: '100vh' }} className={createCardMode}>
                {Object.values(cards).map((cardData) => (
                    <Card key={cardData.id} id={cardData.id} x={cardData.x} y={cardData.y} />
                ))}
            </div>
        </>
    );
};

export default App;
