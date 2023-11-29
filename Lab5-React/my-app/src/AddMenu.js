import React, { useState } from 'react';
import './general.css';
import './AddMenu.css'

const AddMenu = ({ confirm }) => {
    const [itemName, setItemName] = useState("...");
    const [itemDesc, setItemDesc] = useState("...");
    const [itemValue, setItemValue] = useState(0);
    const [itemUrl, setItemUrl] = useState("no_img.png");

    const nameChange = (e) =>{
        setItemName(e.target.value);
    };
    const ratingChange = (e) =>{
        setItemValue(e.target.value);
    };
    const imgChange = (e) =>{
        setItemUrl(e.target.value);
        console.log(itemUrl)
    };
    const descChange = (e) =>{
        setItemDesc(e.target.value);
    };

    return(
        <div className='column'>
            <img src={itemUrl} width="128" height="128" alt="img"></img>    
            <div>Name:</div>
            <input type="text" onChange = {nameChange}></input>  
            <div>Image url:</div>
            <input type="text" value = {itemUrl} onChange = {imgChange}></input>
            <div>Rating:</div>
            <input type="number" onChange = {ratingChange}></input>
            <div>Description:</div>
            <input className='desc' type="text" onChange = {descChange}></input>  
            <button onClick={() => {confirm({"id":0,"image":itemUrl,"name":itemName,"description":itemDesc,"rating":itemValue})}}>Confirm</button>
        </div>
    );
};

export default AddMenu;