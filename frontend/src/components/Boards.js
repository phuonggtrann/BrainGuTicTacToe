import React from 'react';
import Square from './Square';

const styling = {
    border: '4px solid darkblue',
    borderRadius: '10px',
    width: '450px',
    height: '450px',
    display: 'grid',
    margin: '0 auto',
    gridTemplate: 'repeat(3, 1fr) / repeat(3, 1fr)'
}; 

const Board = ({squares, onClick}) => (
    <div style={styling}>
        {squares.map((square, i) => (
            <Square key={i} value={square} onClick={() => onClick(i)} />
        ))}
    </div>
)

export default Board;