import React, { useState } from 'react';
import './App.css';
import Button from "./components/shared/Button/Button.tsx";
import Card from "./components/shared/Card/Card.tsx";
import { v4 as uuidv4 } from 'uuid';
const App = () => {
    const [creatingCard, setCreatingCard] = useState(false);
    const [cards, setCards] = useState<JSX.Element[]>([]);

    const handleButtonClick = () => {
        setCreatingCard(!creatingCard);
    };


    const createCard = (x: number, y: number) => {
        const newCard = <Card key={uuidv4()} x={x} y={y} />;
        setCards([...cards, newCard]);
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
                {cards}
            </div>
        </>
    );
};

export default App;
