import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import  SignIn  from './Components/SignIn';
import { Route , Routes} from 'react-router-dom';
import  {Home}  from './Components/Home';
import AddPost from './Components/AddPost';
import Camera from './Components/Camera';
import ProfilePage from './Components/ProfilePage';

import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'


TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/TechX' Component={SignIn}/>
      <Route path='/SignIn' Component={SignIn}/>
      <Route path='/Home' Component={Home}/>
      <Route path='/AddPost' Component={AddPost}/>
      <Route path='/Camera' Component={Camera}/>
      <Route path='/edit/:id' Component={AddPost}/>
      <Route path='/ProfilePage' Component={ProfilePage}/>
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
