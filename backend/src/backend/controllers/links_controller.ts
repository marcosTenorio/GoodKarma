import * as express from "express";
import { getLinkRepository } from "../repositories/link_repository";
import { authMiddleware, AuthenticatedRequest } from "../config/middleware";
import * as joi from "joi";
import { Repository } from "typeorm";
import { Link } from "../entities/link";


export const linkIdSchema = {
    id: joi.number()
};

export const linkSchema = {
    question: joi.string(),
    title: joi.string(),
    field: joi.string()
};

interface LinkPreviewDetails {
    id: number;
    userId: number;
    email: string;
    name: string;
    title: string;
    question: string;
    field: string;
    date: string;
    replyCount: number | null;
}

export function getHandlers(linkRepo: Repository<Link>) {

    const getAllLinks = (req: express.Request, res: express.Response) => {
        (async () => {
            try {
                const queryResult: LinkPreviewDetails[] = await linkRepo.query(`
                    SELECT
                        "link"."id",
                        "link"."userId",
                        "user"."email",
                        "user"."name",
                        "link"."title",
                        "link"."question",
                        "link"."field",
                        "link"."date",
                        count("reply"."id") "replyCount"
                    FROM "link" "link"
                    LEFT JOIN "user" "user" ON "user"."id" = "link"."userId"
                    LEFT JOIN "reply" "reply" ON "reply"."linkId" = "link"."id"
                    GROUP BY "link"."id", "user"."name", "user"."email"
                `);

                res.json(queryResult);

            } catch (err) {
                // Handle unexpected errors
                console.error(err);
                res.status(500)
                    .json({ error: "Internal server error" })
                    .send();
            }
        })();
    }

    const getLinkById = (req: express.Request, res: express.Response) => {
        (async () => {
            try {

                // Validate Id in URL
                const idStr = req.params.id;
                const linkId = { id: parseInt(idStr) };
                const idValidationresult = joi.validate(linkId, linkIdSchema);

                if (idValidationresult.error) {
                    res.status(400).json({ error: "Bad request" }).send();
                } else {

                    const queryResult = await linkRepo.query(`
                        SELECT
                            "link"."id",
                            "link"."userId",
                            "user"."email",
                            "link"."title",
                            "link"."question",
                            "link"."date",
                            count("reply"."id") "replyCount"
                        FROM "link" "link"
                        LEFT JOIN "user" "user" ON "user"."id" = "link"."userId"
                        LEFT JOIN "reply" "reply" ON "reply"."linkId" = "link"."id"
                        WHERE "link"."id" = $1
                        GROUP BY "link"."id", "user"."name", "user"."email"
                    `, [ linkId.id ]);

                    const linkPreviewDetails: LinkPreviewDetails = queryResult[0];

                    if (linkPreviewDetails === undefined) {
                        res.status(404)
                            .json({ error: "Not found" })
                            .send();
                    } else {

                        const replies = await linkRepo.query(`
                            SELECT
                                "reply"."id",
                                "reply"."userId",
                                "user"."name",
                                "user"."email",
                                "reply","linkId",
                                "reply"."text",
                                "reply"."date",
                                count("karma"."id") "karmaCount"
                            FROM "reply" "reply"
                            LEFT JOIN "user" "user" ON "user"."id" = "reply"."userId"
                            LEFT JOIN "karma" "karma" ON "karma"."replyId" = "reply"."id"
                            WHERE "linkId" = $1
                            GROUP BY "reply"."id", "user"."name", "user"."email"
                        `, [linkId.id]);

                        const link = {
                            id: linkPreviewDetails.id,
                            userId: linkPreviewDetails.userId,
                            name: linkPreviewDetails.name,
                            email: linkPreviewDetails.email,
                            title: linkPreviewDetails.title,
                            question: linkPreviewDetails.question,
                            date: linkPreviewDetails.date,
                            replyCount: linkPreviewDetails.replyCount,
                            replies: replies
                        };

                        res.json(link);
                    }
                }
            } catch (err) {
                // Handle unexpected errors
                console.error(err);
                res.status(500)
                    .json({ error: "Internal server error" })
                    .send();
            }
        })();
    }

    const createLink = (req: express.Request, res: express.Response) => {
        (async () => {
            try {

                // The request userId property is set by the authMiddleware
                // if it is undefined it means that we forgot the authMiddleware
                if ((req as AuthenticatedRequest).userId === undefined) {
                    throw new Error("The request is not authenticated! Please ensure that authMiddleware is used");
                }

                // Read and validate the link from the request body
                const newLink = req.body;
                const result = joi.validate(newLink, linkSchema);

                if (result.error) {
                    res.json({ msg: `Invalid user details in body!` }).status(400).send();
                } else {

                    // Create new link
                    const linkToBeSaved = new Link();
                    linkToBeSaved.userId = (req as AuthenticatedRequest).userId;
                    linkToBeSaved.question = newLink.question;
                    linkToBeSaved.title = newLink.title;
                    linkToBeSaved.field = newLink.field;
                    linkToBeSaved.date = new Date();
                    // let today = new Date();
                    // linkToBeSaved.date = "at " + today.getDate() + "-" +(today.getMonth() +1) + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(); 
                    const savedLink = await linkRepo.save(linkToBeSaved);
                    res.json(savedLink).send();
                }

            } catch (err) {
                // Handle unexpected errors
                console.error(err);
                res.status(500)
                    .json({ error: "Internal server error" })
                    .send();
            }
        })();
    }

    const deleteLinkById = (req: express.Request, res: express.Response) => {
        (async () => {
            try {

                // The request userId property is set by the authMiddleware
                // if it is undefined it means that we forgot the authMiddleware
                if ((req as AuthenticatedRequest).userId === undefined) {
                    throw new Error("The request is not authenticated! Please ensure that authMiddleware is used");
                }

                // Validate Id in URL
                const idStr = req.params.id;
                const linkId = { id: parseInt(idStr) };
                const idValidationresult = joi.validate(linkId, linkIdSchema);

                if (idValidationresult.error) {
                    res.status(400).json({ error: "Bad request" }).send();
                } else {

                    // Try to find link to be deleted
                    const link = await linkRepo.findOne(linkId.id);

                    // If link not found return 404 not found
                    if (link === undefined) {
                        res.status(404)
                            .json({ error: "Not found" })
                            .send();
                    } else {

                        // If link was found, remove it from DB
                        const userId = (req as AuthenticatedRequest).userId;
                        const ownerId = link.userId;

                        if (userId !== ownerId) {
                            res.status(403)
                                .json({ msg: `The current user is not the author of the link` })
                                .send();
                        } else {
                            await linkRepo.remove(link);
                            res.json({ msg: "OK" }).send();
                        }
                    }
                }
            } catch (err) {
                // Handle unexpected errors
                console.error(err);
                res.status(500)
                    .json({ error: "Internal server error" })
                    .send();
            }
        })();
    }

    return {
        getAllLinks,
        getLinkById,
        createLink,
        deleteLinkById
    };
}


export function getLinkController() {

    const linkRepository = getLinkRepository();
    const handlers = getHandlers(linkRepository);
    const router = express.Router();

    // Public
    router.get("/", handlers.getAllLinks);
    router.get("/:id", handlers.getLinkById);

    // Private
    router.post("/", authMiddleware, handlers.createLink);
    router.delete("/:id", authMiddleware, handlers.deleteLinkById);

    return router;
}