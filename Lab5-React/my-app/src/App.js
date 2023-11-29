import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './general.css'
import Item from './Item';
import AddMenu from './AddMenu';
import skulls from './data/skulls.json'

function imply(a,b){
  return !a | b;
};

function iff(a,b){
  return imply(a,b) & imply(b,a);
};

const App = () => {
  const [items, setItems] = useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [itemId, setItemId] = useState(0);
  const itemRefs = useRef([]);

  useEffect(() => {
    console.log(skulls);
    setItems(skulls.skulls);
    setItemId(skulls.skulls.length);
  },[]);

  const handleDelete = (delItemId) => {
    const updatedItems = items.filter((item) => item.id !== delItemId);
    setItems(updatedItems);
  };

  const handleRateChange = (changedItemId, newRating) => {
    const updatedItems = items.map((item) =>
      item.id === changedItemId ? { ...item, rating: newRating } : item
    );
    setItems(updatedItems);
  };

  const handleSort = (sortBy,flip) => {
    const updatedItems = [...items]
    updatedItems.sort((item_a,item_b) => iff(flip,(item_a[sortBy] > item_b[sortBy])));
    setItems(updatedItems);
  }

  const addItemMenu = () => {
    setIsMenuVisible(true);
  };
  const cancelAdding = () => {
    setIsMenuVisible(false);
  };

  const addItem = (item) => {
    console.log(itemId)
    item.id = itemId;
    setItemId(itemId+1);
    setItems([...items,item]);
    setIsMenuVisible(false);
  };

  const searchItem = (searchName) =>{
    const foundItem = items.find((item) => item.name.toLowerCase() === searchName.toLowerCase());
    var itemToScroll = null;
    if (foundItem){
      const itemId = foundItem.id
      itemToScroll = itemRefs.current[itemId]
    }
    if (itemToScroll) {
      itemToScroll.scrollIntoView({ behavior: 'smooth' });
    }
    //itemRefs.current[searchId].scrollIntoView({ behavior: 'smooth' });
    // for (const item of items){
    //   if (item.id == searchId){
    //     console.log(itemRefs.current)
    //     itemRefs.current[searchId].scrollIntoView({ behavior: 'smooth' });
    //   }
    // }
  };

  return (
    <div className="app column">
      <header className='item-addition row center'>
        <div className='title'>
          <h1>Skull Collection</h1>
        </div>
        <div>
          {!isMenuVisible && (<button onClick = {addItemMenu}>Add Item</button>)}
          {isMenuVisible && (<button onClick={cancelAdding}>Cancel</button>)}
          {isMenuVisible && (
            <AddMenu confirm={addItem}/>
          )}
        </div>  
        <div className='column'>
          <button onClick={() => handleSort("name",false)}>Sort by name</button>
          <button onClick={() => handleSort("id",true)}>Sort by id</button>
          <button onClick={() => handleSort("rating",false)}>Sort by rating</button>
          <button onClick={() => handleSort("description",true)}>Sort by description</button>
        </div>
        <div>
          Search item:
          <input type="text" onBlur={(e) => searchItem(e.target.value)}></input>
        </div>
      </header>
      <section className='main'>
        <div className="item-list column">
          {items.map((item) => (
            <Item key={item.id} item={item} onDelete={handleDelete} onRateChange={handleRateChange} ref={(el) => itemRefs.current[item.id] = el} />
          ))}
        </div>
      </section>
      <footer>
        Designed by Łukasz Andryszewski
      </footer>
    </div>
  );
};

export default App;