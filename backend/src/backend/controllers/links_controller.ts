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

export function getHandlers(linkRepo: Repository <Link>) {

    const getAllLinks = (req: express.Request, res: express.Response) => {
        (async () => {
            try {
                const links = await linkRepo.createQueryBuilder("link")
                    .leftJoinAndSelect("link.user", "user")
                    .getMany();

                // const links = await linkRepo.find();
                res.json(links);
            }catch (err) {
                // Handle unexpected errors
                console.error(err);
                res.status(500)
                   .json({ error: "Internal server error"})
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
                } {
                    const link = await linkRepo.createQueryBuilder("link")
                                                .leftJoinAndSelect("link.reply", "reply")
                                                .where("link.id = :id", { id: linkId.id })
                                                .getOne();
                    if (link === undefined) {
                        res.status(404)
                           .json({ error: "Not found"})
                           .send();
                    } else {
                        res.json(link);
                    }
                }
            } catch (err) {
                // Handle unexpected errors
                console.error(err);
                res.status(500)
                   .json({ error: "Internal server error"})
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
                    res.json({ msg: `Invalid user details in body!`}).status(400).send();
                } else {

                    // Create new link
                    const linkToBeSaved = new Link();
                    linkToBeSaved.userId = (req as AuthenticatedRequest).userId;
                    linkToBeSaved.question = req.body.question;
                    linkToBeSaved.title = newLink.title;
                    linkToBeSaved.field = newLink.field;
                    const savedLink = await linkRepo.save(linkToBeSaved);
                    res.json(savedLink).send();
                }

            } catch (err) {
                // Handle unexpected errors
                console.error(err);
                res.status(500)
                   .json({ error: "Internal server error"})
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
                           .json({ error: "Not found"})
                           .send();
                    } else {

                        // If lik was found, remove it from DB
                        await linkRepo.remove(link);
                        res.json({ msg: "OK" }).send();
                    }
                }
            } catch (err) {
                // Handle unexpected errors
                console.error(err);
                res.status(500)
                   .json({ error: "Internal server error"})
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