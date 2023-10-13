import React, { useState, useEffect } from 'react';
import './App.css';

export const App = () => {
    const [appModes, setAppModes] = useState([]);
    const [selectedMode, setSelectedMode] = useState('');
    const [grid, setGrid] = useState([]);
    const [hoveredSquares, setHoveredSquares] = useState([]);

    useEffect(() => {
        fetch('https://60816d9073292b0017cdd833.mockapi.io/modes')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => setAppModes(data))
            .catch((error) => {
                alert('An error occurred: ' + error.message);
            });
    }, []);

    const renderTable = () => {
        const selectedAppMode = appModes.find((mode) => mode.id === selectedMode);

        if (selectedAppMode) {
            const fieldCount = selectedAppMode.field;
            const newGrid = Array.from({ length: fieldCount }, (_, row) =>
                Array.from({ length: fieldCount }, (_, col) => {
                    return (row === 1 && col >= 0 && col <= 2) || (row === 2 && col === 2);
                })
            );
            setGrid(newGrid);
        }
    };

    const handleSquareHover = (row, col) => {
        const squareInfo = `row ${row+1}, col ${col+1}`;
        setHoveredSquares((prevHoveredSquares) => {
            // Спочатку бачимо нові елементи
            return [squareInfo, ...prevHoveredSquares];
        });
    };

    return (
        <div className="App">
            <h1>Starnavi Test</h1>
            <div>
                <select value={selectedMode} onChange={(event) => setSelectedMode(event.target.value)}>
                    <option value="">Pick mode</option>
                    {appModes.map(({ name, id }) => (
                        <option key={id} value={id}>
                            {name}
                        </option>
                    ))}
                </select>
                <button onClick={renderTable}>START</button>
            </div>
                <div className="game-container">
                    {grid.map((row, rowIndex) => (
                        <div key={rowIndex} className="grid-row">
                            {row.map((isHighlighted, cellIndex) => (
                                <div key={cellIndex} className={row.length > 35 ? 'grid-cell-small': 'grid-cell' }>
                                    <Square
                                        isHighlighted={isHighlighted}
                                        row={rowIndex}
                                        col={cellIndex}
                                        onSquareHover={handleSquareHover}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="hovered-info">
                    <h2>Hover Squares</h2>
                    <ul>
                        {hoveredSquares.map((squareInfo, index) => (
                            <li key={index}>{squareInfo}</li>
                        ))}
                    </ul>
                </div>
        </div>
    );
}

const Square = ({ isHighlighted, row, col, onSquareHover }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
        onSquareHover(row, col);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundColor:
                    isHighlighted === true
                        ? isHovered
                            ? 'white'
                            : 'blue'
                        : isHighlighted === false
                            ? isHovered
                                ? 'blue'
                                : 'white'
                            : 'white',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        ></div>
    );
};

