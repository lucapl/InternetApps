import React,{ useState,useEffect } from 'react';
import './Item.css';
import './general.css';

const Item = React.forwardRef(({ item, onDelete, onRateChange },ref) => {
  const [isEditing , setEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(0);


  const startEditing = () =>{
    setEditedValue(item.value);
    setEditing(true);
  };
  const finishEditing = () =>{
    onRateChange(item.id, editedValue)
    setEditing(false);
  };
  const handleEdition = (e) =>{
    const value = e.target.value;
    console.log(value); 
    if (value){
      setEditedValue(value);
    } else{
      setEditedValue(item.value);
    }
  }

  return (
    <div className="item" ref={ref}>
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <div className='row edit'>
        <p>
          { !isEditing &&
          (<span>Rating: {item.rating}</span>)
          }
          { isEditing && (
          <input
            type="number"
            value={editedValue}
            //onChange={(e) => onRateChange(item.id, e.target.value)}
            onChange={handleEdition}
          />)}
        </p>
        {!isEditing && (<button className='clear' onClick={startEditing}>✏️</button>)}
        {isEditing && (<button className='clear' onClick={finishEditing}>💾</button>)}
      </div>
      
      <button className='delete clear' onClick={() => onDelete(item.id)}>X</button>
    </div>
  );
});

export default Item;