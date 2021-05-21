import React from 'react';

const styling = {
    background: 'lightblue',
    borde: '2pc solid darkblue',
    fontSize: '30px',
    fontWeight: '800',
    cursor: 'pointer', 
    outline: 'none'
}

const Square = ({value, onClick}) => (
    <button style={styling} onClick = {onClick}>
        {value}
    </button>
    )

export default Square;