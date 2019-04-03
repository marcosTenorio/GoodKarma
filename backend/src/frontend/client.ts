// creates a new user
(async () => {
    const data = {
        email: "test@demo.com",
        password: "secret1"
    };
    const response = await fetch(
        "http://localhost:8080/users/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const json = await response.json();
    console.log(json);
})();

//Returns a user​ with all its activity (links and comments)
(async () => {
    const response = await fetch(
        "http://localhost:8080/users/1",
        {
            method: "GET"
        }
    );
    const json = await response.json();
    console.log(json);
})();

//to login, if the user is found on database it returns a token
(async () => {
    const data = {
        email: "test@demo.com",
        password: "secret1"
    };
    const response = await fetch(
        "http://localhost:8080/auth/login/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const json = await response.json();
    console.log(json);
})();

//return all links
(async () => {
    const response = await fetch(
        "http://localhost:8080/links",
        {
            method: "GET"
        }
    );
    const json = await response.json();
    console.log(json);
})();

//return a link and its comments
(async () => {
    const response = await fetch(
        "http://localhost:8080/links/1",
        {
            method: "GET"
        }
    );
    const json = await response.json();
    console.log(json);
})();

//creates a new link - you must pass a valid token at the header
(async () => {
    const data = {
        url: "www.something.ie",
        title: "title of something.."
    };
    const response = await fetch(
        "http://localhost:8080/links/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": "INSERT YOUR TOKEN HERE"
            },
            body: JSON.stringify(data)
        }
    );
    const json = await response.json();
    console.log(json);
})();

//deletes a link - you must pass a valid token at the header
(async () => {
    const response = await fetch(
        "http://localhost:8080/links/1",
        {
            method: "DELETE",
            headers: {
                "x-auth-token": "INSERT YOUR TOKEN HERE"
            }
        });
    const json = await response.json();
    console.log(json);
})();

//upvotes a link - you must pass a valid token at the header 
//users are not allow to vote the same link twice
(async () => {
    const response = await fetch(
        "http://localhost:8080/links/1/upvote",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": "INSERT YOUR TOKEN HERE"
            },
        }
    );
    const json = await response.json();
    console.log(json);
})();

//downvote a link - you must pass a valid token at the header 
//users are not allow to vote the same link twice
(async () => {
    const response = await fetch(
        "http://localhost:8080/links/2/downvote",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": "INSERT YOUR TOKEN HERE"
            },
        }
    );
    const json = await response.json();
    console.log(json);
})();

//creates a new comment - you must pass a valid token at the header
(async () => {
    const data = {
        text: "comment something here...",
        link: 2 //inform the link id you want to comment
    };
    const response = await fetch(
        "http://localhost:8080/comments/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": "INSERT YOUR TOKEN HERE"
            },
            body: JSON.stringify(data)
        }
    );
    const json = await response.json();
    console.log(json);
})();

//Updates the content of a comment - you must pass a valid token at the header
(async () => {
    const data = {
        text: "update your comment here..."
    };
    const response = await fetch(
        "http://localhost:8080/comments/4",
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": "INSERT YOUR TOKEN HERE"
            },
            body: JSON.stringify(data)
        }
    );
    const json = await response.json();
    console.log(json);
})();

//deletes a comment - you must pass a valid token at the header
//users are only allow to delete their own comment
(async () => {
    const response = await fetch(
        "http://localhost:8080/comments/6",
        {
            method: "DELETE",
            headers: {
                "x-auth-token": "INSERT YOUR TOKEN HERE"
            }
        });
    const json = await response.json();
    console.log(json);
})();