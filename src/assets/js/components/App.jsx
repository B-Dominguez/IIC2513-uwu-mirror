import React, { Component } from 'react';

import AsyncSelect from 'react-select/async';

var objectOptions=[];

fetch('https://localhost:3000/objects')
	.then(function(response) {
  	return response.json();
  })
  .then(function(myJson){
  	console.log(myJson);
  	var tempArray = [];
    myJson.forEach(function (element) {
    	objectOptions.push({
      	label: "".concat(element.name),
        value: element.name
      })
    })
  });

const filterObjects = (inputValue) => {
  return objectOptions.filter(i =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const promiseOptions = inputValue =>
  new Promise(resolve => {
  	setTimeout(() => {
    	resolve(filterObjects(inputValue));
  	}, 0);
	});

export default class App extends Component {
  render() {
    return (
      <AsyncSelect name="searchCat"  className="busqueda" placeholder="Busca tus productos para intercambiar..." cacheOptions defaultOptions loadOptions={promiseOptions} />
    );
  }
}
