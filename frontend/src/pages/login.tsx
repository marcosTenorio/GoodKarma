import * as React from "react";
import * as joi from "joi";
import { withRouter } from "react-router-dom";
import * as H from 'history';

const credentialSchema = {
    email: joi.string().email().required(),
    password: joi.string().min(3).max(30).required()
};

interface LoginProps {
    history: H.History;
}

interface LoginState {
    email: string;
    password: string;
    error: string | null;
}

export class LoginInternal extends React.Component<LoginProps, LoginState> {
    public constructor(props: LoginProps) {
        super(props);
        this.state = {
            email: "",
            password: "",
            error: null
        };
    }
    public render() {
        return (
            <div>
                {this._renderServerErrors()}
                {this._renderValidationErrors()}
                <input
                    type="text"
                    placeholder="Email"
                    onKeyUp={(e) => this._updateEmail((e as any).target.value)}
                />
                <br></br>
                <input
                    type="password"
                    placeholder="Password"
                    onKeyUp={(e) => this._updatePassword((e as any).target.value)}
                />
                <button onClick={() => this._handleSubmit()}>Submit</button>
            </div>
        );
    }
    private _renderServerErrors() {
        if (this.state.error === null) {
            return <div></div>;
        } else {
            return <div>{this.state.error}</div>;
        }
    }
    // Display errors or OK on screen
    private _renderValidationErrors() {
        const validationResult = joi.validate({
            email: this.state.email,
            password: this.state.password
        }, credentialSchema);
        if (validationResult.error) {
            return <div>
                {validationResult.error.details.map(d => <div>{d.message}</div>)}
            </div>;
        } else {
            return <div>OK!</div>;
        }
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
                const token = await getToken(this.state.email, this.state.password);
                // Reset error
                this.setState({ error: null });
                // Save token in window object
                (window as any).__token = token;
                // Redirect to home page
                this.props.history.push("/");
            } catch(err) {
                this.setState({ error: err.error });
            }
        })();
    }
}

// withRouter pass some props that contain the history to the
// <LoginInternal> component and returns a new component named
// <Login>
export const Login = withRouter(props => <LoginInternal {...props}/>);

async function getToken(email: string, password: string) {
    return new Promise(function (resolve, reject) {
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