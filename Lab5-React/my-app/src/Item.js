import React from 'react';
import './Item.css';

const Item = React.forwardRef(({ item, onDelete, onRateChange },ref) => {
  return (
    <div className="item" ref={ref}>
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <p>Rating: {item.rating}</p>
      <input
        type="number"
        value={item.rating}
        onChange={(e) => onRateChange(item.id, e.target.value)}
      />
      <button className='delete' onClick={() => onDelete(item.id)}>X</button>
    </div>
  );
});

export default Item;