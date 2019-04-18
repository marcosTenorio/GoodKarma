import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Links } from "./pages/links";
import { Login, Register } from './pages/login';
import { Profile } from './pages/profile';
import { TopNavBar } from './components/top_navbar.tsx/top_navbar';
import { LinkDetails } from './pages/linkDetails';




ReactDOM.render(
    <BrowserRouter>
        <div>
            <TopNavBar/>
            <div className="container">
                <Switch>
                    <Route exact path="/" component={Links} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/profile" component={Profile} />
                    <Route exact path="/profile/:id" component={Profile} />
                    <Route exact path="/link_details/:id" component={LinkDetails} />
                </Switch>
            </div>
        </div>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

