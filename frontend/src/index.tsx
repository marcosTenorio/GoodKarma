import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Links } from "./pages/links";
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Profile } from './pages/profile';
import { LinkById } from './pages/linkById';
import { SearchBar } from './components/searchBar/searchBar';
import { TopNavBar } from './components/top_navbar.tsx/top_navbar';




ReactDOM.render(
    <BrowserRouter>
    
        <div>

            <TopNavBar/>
            
            <Switch>
                {
                    /*
                        The Route component can be used to declare the 
                        pages in our single page web application
                    */
                }
                <Route exact path="/" component={Links} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/:id" component={LinkById} />
            </Switch>
            <div>Footer!</div>
        </div>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

