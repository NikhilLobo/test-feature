import React, { useEffect, useState } from "react";


const EpisodeList = (props) => {
  const {show} = props.show;
  const [episodes, setEpisodes] = useState([]);
  useEffect(()=>{
    const fetchData = async ()=> {
      const result = await fetch(`https://api.tvmaze.com/shows/${show.id}/episodes`);
      const resultData = await result.json();
      setEpisodes(resultData);
    }
    fetchData();
  },[]);
  return(
    <div className="popup-box">
    <div className="box">
      <span className="close-icon" onClick={props.handleClose}>x</span>
      {
        episodes.map((item)=>
          <div key={item.id} className="div__layout">
            <div className="text_layout">
             <p>Season: {item.season}</p>
              <p>Episode Number: {item.number}</p>
              <p>Name: {item.name}</p>
              <p>time: {item.airtime}</p>
            </div>
          </div>
        )
      }
    </div>
  </div>
  )

}
/** @type {React.FC} */
export const Home = ({}) => {
  const [date, setDate] = useState(()=>{
    var date = new Date();
    return date.toISOString().slice(0,10);
  });
  const [count, setCount]= useState(1);
  const [shows, setShows] = useState([]);
  const [showEpisodes, setShowEpisodes] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }
  useEffect(()=>{
    const fetchData = async ()=> {
      const result = await fetch(`https://api.tvmaze.com/schedule?country=GB&date=${date}`);
      const resultData = await result.json();
      setShows(resultData);

    }
    fetchData();
  },[date]);
  const mapDates = {
    1: '2022-02-23',
    2: '2022-02-24',
    3: '2022-02-25',
    4: '2022-02-26',
    5: '2022-02-27',
    6: '2022-02-28',
  }

  const handleNextDate = () => {
    setCount((count)=> {
      if(count<=6)
        return count+1;
      return count;
    });
    setDate(mapDates[count]);
  }
  const handlePreDate = () => {
    setDate(mapDates[1]);
    setCount(1);
  }
  

  return (
    <>
    <button  className="current" onClick={handlePreDate}>Current Day</button>
    <button className="next" disabled={count >6} onClick={handleNextDate}>Next Day</button>
    <div className='container'>
      {
        shows.map((item)=>
          <div key={item.id} onClick={()=> {togglePopup(); setShowEpisodes(item);}} className="div__layout">
            <img src={item?.show.image?.original} alt="Image"/>
            <div className="text_layout">
              <p>{item.show.name}</p>
              <p>Date : {item.airdate}</p>
              <p>Time : {item.airtime} on {item.show.network.name}</p>
            </div>
          </div>
        )
      }
    </div>

    {isOpen && (<EpisodeList show={showEpisodes} handleClose={togglePopup}/>)}
  </>
  );
};
