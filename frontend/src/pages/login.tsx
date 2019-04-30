import * as React from "react";
import * as joi from "joi";
import { withRouter } from "react-router-dom";
import * as H from 'history';
import { setAuthToken } from "../components/with_auth/with_auth";

const credentialSchema = {
    email: joi.string().email().required(),
    password: joi.string().min(3).max(30).required()
};

interface LoginOrRegisterProps {
    history: H.History;
    isLogin: boolean;
}

interface LoginOrRegisterState {
    name: string;
    email: string;
    password: string;
    error: string | null;
}

export class LoginOrRegisterInternal extends React.Component<LoginOrRegisterProps, LoginOrRegisterState> {
    public constructor(props: LoginOrRegisterProps) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            error: null
        };
    }
    public render() {
        return (
           <div className="login-container">
                <h1>{this.props.isLogin ? "Log In" : "Register"}</h1>
                <div>
                    {this._renderServerErrors()}
                    {this._renderValidationErrors()}
                </div>
                {
                    !this.props.isLogin ? this._renderRegister() : ""
                    
                }             
                <div>
                    <input
                        className="input-text"
                        style={{ width: "80%"}}
                        type="text"
                        placeholder="e-mail"
                        onKeyUp={(e) => this._updateEmail((e as any).target.value)}
                    />
                </div>
                <div>
                    <input
                        className="input-text"
                        style={{ width: "80%"}}
                        type="password"
                        placeholder="password"
                        onKeyUp={(e) => this._updatePassword((e as any).target.value)}
                    />
                </div>
                <div>
                    <button
                        onClick={() => this._handleSubmit()}
                        className="btn"
                        style={{ width: "30%"}}
                    >
                    Submit
                    </button>
                </div>
           </div>
        );
    }
    private _renderServerErrors() {
        if (this.state.error === null) {
            return <div></div>;
        } else {
            return <div className="error-msg">{this.state.error}</div>;
        }
    }

    // Display errors or OK on screen
    private _renderValidationErrors() {
        const validationResult = joi.validate({
            email: this.state.email,
            password: this.state.password
        }, credentialSchema);
        if (validationResult.error) {
            return <div className="error-msg">
                {validationResult.error.details.map((d, i) => <div key={i}>{d.message}</div>)}
            </div>;
        } else {
            return <div className="success-msg">OK!</div>;
        }
    }

    private _renderRegister(){
        return <div>
            <input
                className="input-text"
                style={{ width: "80%"}}
                type="text"
                placeholder="name"
                onKeyUp={(e) => this._updateName((e as any).target.value)}
            />
        </div>
        
    }
    // Update the state (name) on keyup
    private _updateName(name: string) {
        this.setState({ name: name });
    }
    // Update the state (email) on keyup
    private _updateEmail(email: string) {
        this.setState({ email: email });
    }
    // Update the state (password) on keyup
    private _updatePassword(password: string) {
        this.setState({ password: password });
    }
    // Send HTTP request on click
    private _handleSubmit() {
        (async () => {
            try {
                if (this.props.isLogin) {
                    // Reset error
                    this.setState({ error: null });
                    //Call server
                    const token = await getToken(this.state.email, this.state.password);
                    // Save token in window object
                    //(window as any).__token = token;
                    setAuthToken(token);
                    // Redirect to home page
                    this.props.history.push("/");
                } else {
                    // Reset error
                    this.setState({ error: null });
                    // Call server
                    await createUserAccount(this.state.name, this.state.email, this.state.password);
                    // Redirect to sign in page
                    this.props.history.push("/login")
                }
            } catch(err) {
                this.setState({ error: err.error });
            }
        })();
    }
}

// withRouter pass some props that contain the history to the
// <LoginOrRegisterInternal> component and returns a new component named
// <Login>
export const Login = withRouter(props => <LoginOrRegisterInternal isLogin={true} {...props}/>);
export const Register = withRouter(props => <LoginOrRegisterInternal isLogin={false} {...props}/>);

async function getToken(email: string, password: string) {
    return new Promise<string>(function (resolve, reject) {
        (async () => {
            const data = {
                email: email,
                password: password
            };
            const response = await fetch(
                "/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );
            const json = await response.json();
            if (response.status === 200) {
                resolve(json.token);
            } else {
                reject(json);
            }
        })();
    });
}

async function createUserAccount(name: string, email: string, password: string) {
    return new Promise<string>(function (resolve, reject) {
        (async () => {
            const data = {
                name: name,
                email: email,
                password: password
            };
            const response = await fetch(
                "/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );
            const json = await response.json();
            if (response.status === 200) {
                resolve(json.token);
            } else {
                reject(json);
            }
        })();
    });
}