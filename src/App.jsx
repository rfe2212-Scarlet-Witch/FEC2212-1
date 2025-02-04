import React, {useEffect, useState} from 'react';
import './index.scss';
import Overview from './Components/Overview.jsx';
import QnA from './Components/QnA/QandA.jsx'
import RnR from './Components/RnR/RnR.jsx'
//import for reviews
const axios = require('axios');

function App() {

  const [currProducts, changeProducts] = useState([]);//current array
  const [currProd, changeProd] = useState([]);//current product that is displayed
  const [currStyles, changeStyles] = useState([]); //all styles for the currently rendered product
  const [displayedStyle, changeDisplayedStyle] = useState({photos: [{}]});//currently displayed style inside the image gallery
  const [displayedPhoto, changeDisplayedPhoto] = useState();
  const [currReviews, setCurrReviews] = useState([]);
  const [currQuestions, setCurrQuestions] = useState([]);

  useEffect(() => {
    axios.post('', {
      term: '/products',
    })
    .then((data) => {
      console.log('current products', data.data);

      changeProducts(data.data);//update the current products
      changeProd(data.data[0]);//update the currently displayed product, defaults to first on page load.

      //communicate with server, fetch api data for styles
      axios.post('', {
        term: `/products/${data.data[0].id}/styles`,
      })
      .then((data) => {
        console.log('current styles for the selected product', data.data.results);
        changeStyles(data.data.results); //update the current styles for the currently displayed product
        changeDisplayedStyle(data.data.results[0]); //update the currently displayed style, defaults to first on page load.
        changeDisplayedPhoto(data.data.results[0].photos[0].thumbnail_url);
      })
      .catch((err) => {
        console.log('axios post for product data failed', err);
      });

      axios.post('/revs', {
        term: '/reviews/',
        product_id: data.data[0].id
      })
      .then((data) => {
        // console.log('this is the REVIEWS data', data.data);
        setCurrReviews(data.data.results)
      })
      .catch((err) => {
        throw err;
      });

      //this is the array of products received upon page render
      // console.log('this is the data', data.data);
    })
    .catch((err) => {
      // console.log('axios post for product data failed', err);
    });



  }, []);

  useEffect(() => {
    if(!Array.isArray(currProd)){
      axios.post('/questions', {
        term: '/qa/questions',
        product_id: currProd.id
      })
      .then((data) => {setCurrQuestions(data.data.results)})
      .catch((err) => console.log(err))
    }
  }, [currProd])


  return (
    <div className="app">
      <Overview displayedPhoto={displayedPhoto} changeDisplayedPhoto={changeDisplayedPhoto} displayedStyle={displayedStyle} changeDisplayedStyle={changeDisplayedStyle} currStyles={currStyles} changeStyles={changeStyles} currProd={currProd} changeProd={changeProd} currProducts={currProducts} changeProducts={changeProducts}/>
      <QnA currProd={currProd} changeProd={changeProd} currProducts={currProducts} changeQuestion={setCurrQuestions} currQuestions={currQuestions} changeProducts={changeProducts}/>
      <div className="review-comp">To be used by review component</div>
      <RnR currProd={currProd} changeProd={changeProd} currProducts={currProducts} changeProducts={changeProducts} currReviews={currReviews}/>
    </div>
  );
}

export default App;