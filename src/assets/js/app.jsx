import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const reactAppContainer = document.getElementById('react-app');
async function loadOptions(ctx) {
  const objectsList = await ctx.orm.object.findAll({order: [ [ 'id', 'DESC' ]]});
  console.log(objectsList);
  return objectsList;
};
if (reactAppContainer) {
  ReactDOM.render(<App />, reactAppContainer);
}
