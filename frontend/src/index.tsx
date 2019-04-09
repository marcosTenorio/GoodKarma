import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Links } from "./pages/links";
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Profile } from './pages/profile';
import { Header } from './components/header/header';
import {SearchBar } from './components/searchBar/searchBar';



ReactDOM.render(
    // This is the router component
    <BrowserRouter>
    
        <div>
            <div>
            
            <Header>
              
            </Header>
                {
                    /*
                        Links are rendered as HTML <a/> elements and
                        can be used to navigate from a page to another
                    */
                }
             
                
                <Link className="links" style={{ color: "#ffffff" }} to="/">Home</Link>
            
                {
                    (() => {
                        const token: string | undefined = (window as any).__token;
                        if (typeof token === "string") {
                            return <div className="btns">        
                                        <Link style={{ color: "#black" }} to="/profile">Profile</Link>
                                    </div>
                        } else {
                            return <div className="btns">
                                <Link style={{ color: "black", border:"2px solid black" }} to="/login">Login</Link>
                                &nbsp;
                                <Link style={{ color: "black", border:"2px solid black" }} to="/register">Register</Link>
                                </div>
                        }
                    })()
                }
            </div>
            <div className='searchBox'>
                <SearchBar>
                
                </SearchBar> 
            </div>  
            {
                /*
                    The Switch component will render one of the components
                    The rendered component will be the one in the Route with
                    the matching path
                */
            }
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

