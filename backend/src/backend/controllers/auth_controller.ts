import * as express from "express";
import * as joi from "joi";
import jwt from "jsonwebtoken";
import { Repository } from "typeorm";
import { getUserRepository } from "../repositories/user_repository";
import { User } from "../entities/user";
import { AuthTokenContent, AuthenticatedRequest } from "../config/middleware";
import { userDetailsSchema } from "./users_controller";

// We pass the repository instance as an argument
// We use this pattern so we can unit test the handlers with ease
export function getHandlers(AUTH_SECRET: string, userRepository: Repository<User>) {

    // Returns a JWT when the user credentials are valid
    const login =  (req: express.Request, res: express.Response) => {
        (async () => {
            try {
                // Read and validate the user details from the request body
                const userDetails = req.body;
                const result = joi.validate(userDetails, userDetailsSchema);

                if (result.error) {
                    res.status(400).send();
                } else {

                    // Try to find the user with the given credentials
                    const user = await userRepository.findOne({
                        where: {
                            email: userDetails.email,
                            password: userDetails.password
                        }
                    });

                    // Return error HTTP 404 not found if not found
                    if (user === undefined) {
                        res.status(401).send();
                    } else {

                        // Create JWT token
                        if (AUTH_SECRET === undefined) {
                            throw new Error("Missing environment variable AUTH_SECRET");
                        } else {
                            const tokenContent: AuthTokenContent = { id: user.id };
                            const token = jwt.sign(tokenContent, AUTH_SECRET);
                            res.json({ token: token }).send();
                        }
                    }
                }
            } catch(err) {
                // Handle unexpected errors
                console.error(err);
                res.status(500)
                   .json({ error: "Internal server error"})
                   .send();
            }
        })();
    }

    const getProfile = (req: express.Request, res: express.Response) => {
        (async () => {
            try {
                const userId = (req as AuthenticatedRequest).userId;
                const user = await userRepository.findOne(userId);
                res.json(user).send();
            } catch(err) {
                // Handle unexpected errors
                console.error(err);
                res.status(500)
                   .json({ error: "Internal server error"})
                   .send();
            }
        })();
    }

    return {
        login,
        getProfile
    };

}

export function getAuthController() {

    const AUTH_SECRET = process.env.AUTH_SECRET;

    if (AUTH_SECRET === undefined) {
        throw new Error("Missing environment variable AUTH_SECRET");
    }

    const repository = getUserRepository();
    const handlers = getHandlers(AUTH_SECRET, repository);
    const router = express.Router();

    // Public
    router.post("/login", handlers.login);
    router.post("/profile", handlers.getProfile);

    return router;
}
