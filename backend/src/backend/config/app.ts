import express from "express";
import bodyParser from "body-parser";
import { createDbConnection } from "./db";
import { getUserController } from "../controllers/users_controller";
import { getAuthController } from "../controllers/auth_controller";
import { getCommentController } from "../controllers/comment_controller";
import { getLinkController } from "../controllers/links_controller";
import { getReplyController } from "../controllers/reply_controller";
import { Connection } from "typeorm";

export async function createApp(conn?: Connection) {

   // Create db connection if a connection is not passed
    if (conn === undefined) {
        await createDbConnection();
    }

    // Creates app
    const app = express();

    // Server config to be able to send JSON
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Declare main path
    app.get("/", (req, res) => {
        res.send("This is the home page!");
    });

    // Declare controllers
    const userController = getUserController();
    const authController = getAuthController();
    const commentsController = getCommentController();
    const linkController = getLinkController();
    const replyController = getReplyController();

    // Declare routes
    app.use("/auth", authController);
    app.use("/users", userController);
    app.use("/comments", commentsController);
    app.use("/links", linkController);
    app.use("/replies", replyController);

    return app;
}
