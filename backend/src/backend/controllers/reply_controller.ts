import * as express from "express";
import * as joi from "joi";
import { authMiddleware, AuthenticatedRequest } from "../config/middleware";
import { Reply } from "../entities/reply";
import { getReplyRepository } from "../repositories/reply_repository";
import { Karma } from "../entities/karma";
import { getKarmaRepository } from "../repositories/karma_repository";
import { Repository } from "typeorm";


export const replyIdSchema = {
    id: joi.number()
};

export const replyUpdateSchema = {
    text: joi.string()
}

export const newReplySchema = {
    linkId: joi.number(),
    text: joi.string()
};


export function getHandlers(replyRepo: Repository<Reply>, karmaRepo: Repository<Karma>) {

    // Create a new reply
    const createReply = (req: express.Request, res: express.Response) => {
        (async () => {
            try {

                // The request userId property is set by the authMiddleware
                // if it is undefined it means that we forgot the authMiddleware
                if ((req as AuthenticatedRequest).userId === undefined) {
                    throw new Error("The request is not authenticated! Please ensure that authMiddleware is used");
                }

                // Validate the comment in the request body
                const newReply = req.body;
                const result = joi.validate(newReply, newReplySchema);

                if (result.error) {
                    res.json({ msg: `Invalid comment details in body!`}).status(400).send();
                } else {

                    // Create new reply
                    const replyToBeSaved = new Reply();
                    replyToBeSaved.userId = (req as AuthenticatedRequest).userId;
                    replyToBeSaved.linkId = newReply.linkId;
                    replyToBeSaved.text = newReply.text;
                    let today = new Date();
                    replyToBeSaved.date = "at " + today.getDate() + "-" +(today.getMonth() +1) + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes(); 
                    const savedReply = await replyRepo.save(replyToBeSaved);
                    res.json(savedReply).send();
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
    
    // Update an existing reply
    const updateReply = (req: express.Request, res: express.Response) => {
        (async () => {
            try {

                // The request userId property is set by the authMiddleware
                // if it is undefined it means that we forgot the authMiddleware
                if ((req as AuthenticatedRequest).userId === undefined) {
                    throw new Error("The request is not authenticated! Please ensure that authMiddleware is used");
                }
                
                const replyId = { id: parseInt(req.params.id) };
                const newReply = req.body;

                // Validate the Id in the URL
                const idValidationResult = joi.validate(replyId, replyIdSchema);

                // Validate the reply update in the request body
                const replyUpdateValidationResult = joi.validate(newReply, replyUpdateSchema);

                if (idValidationResult.error) {
                    // The reply id is invalid
                    res.status(400)
                       .json({ msg: `Invalid parameter id '${replyId.id}' in URL` })
                       .send();
                } else if (replyUpdateValidationResult.error) {
                    // The update is invalid
                    res.status(400)
                       .json({ msg: `Invalid comment update in request body` })
                       .send();
                } else {

                    // Try to read the reply
                    const reply = await replyRepo.findOne(replyId);

                    // The reply is not found
                    if (reply === undefined) {
                        res.status(404)
                           .json({ msg: `Reply with id '${replyId.id}' not found!` })
                           .send();
                    } else {

                        // Validate that the current user is also
                        // the author of the reply to be updated
                        const replyOwnerId = reply.userId;
                        const userId = (req as AuthenticatedRequest).userId;

                        // User is not the author
                        if (replyOwnerId !== userId) {
                            res.status(403)
                               .json({ msg: `The current user is not the author of the reply` })
                               .send();
                        } else {

                            // Update reply content
                            await replyRepo.update(
                                { text: newReply.text },
                                { id: replyId.id }
                            );

                            const where = { id: replyId.id };
                            const set = { text: newReply.text };
                            replyRepo.update(where, set);
                            
                            res.json({ ok: "ok" }).send();
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
    
    // Delete a reply by its Id
    const deleteReplyById = (req: express.Request, res: express.Response) => {
        (async () => {
            try {

                // The request userId property is set by the authMiddleware
                // if it is undefined it means that we forgot the authMiddleware
                if ((req as AuthenticatedRequest).userId === undefined) {
                    throw new Error("The request is not authenticated! Please ensure that authMiddleware is used");
                }

                // Validate the reply ID in the request URL
                const replyId = { id: req.params.id };
                const result = joi.validate(replyId, replyIdSchema);

                // The id is invalid
                if (result.error) {
                    res.status(400)
                    .json({ msg: `Invalid parameter id '${replyId.id}' in URL` })
                    .send();
                } else {

                    // Try to read the reply
                    const replyToBeDeleted = await replyRepo.findOne(replyId.id);

                    // try to find karma points linked to the reply to be deleted
                    const karmaToBeDeleted = await karmaRepo.createQueryBuilder("karma")
                                                             .where("karma.replyId =:id", {id:replyId.id})
                                                             .getMany();
                    
                    // The reply is not found
                    if (replyToBeDeleted === undefined) {
                        res.status(404)
                           .json({ msg: `Comment with id '${replyId.id}' not found!` })
                           .send();
                    } else {

                        // Validate that the current user is also
                        // the author of the reply to be updated
                        const commentOwnerId = replyToBeDeleted.userId;
                        const userId = (req as AuthenticatedRequest).userId;

                        if (commentOwnerId !== userId) {
                            res.status(403)
                                .json({ msg: `The current user is not the author of the reply` })
                                .send();
                        } else {
                            //delete karma points linked to the reply to be deleted
                            if(karmaToBeDeleted !== undefined){
                                await karmaRepo.delete(karmaToBeDeleted);
                            }

                            // Delete reply
                            await replyRepo.delete(replyId);
                            res.json({ ok: "ok" }).send();
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

    const karmaVote = (req: express.Request, res: express.Response) => {
        (async () => {

            try {

                // The request userId property is set by the authMiddleware
                // if it is undefined it means that we forgot the authMiddleware
                if ((req as AuthenticatedRequest).userId === undefined) {
                    throw new Error("The request is not authenticated! Please ensure that authMiddleware is used");
                }

                // Validate Id in URL
                const idStr = req.params.id;
                const replyId = { id: parseInt(idStr) };
                const idValidationresult = joi.validate(replyId, replyIdSchema);
                const userId = (req as AuthenticatedRequest).userId
                
                if (idValidationresult.error) {
                    res.status(400).json({ error: "Bad request" }).send();
                } else {
                    // Try to find previous vote by same user
                    const karma = await karmaRepo.findOne({
                        where: {
                            replyId: replyId.id,
                            userId: userId
                        }
                    });

                    //get the reply owner
                    const replyOwner = await replyRepo.findOne({
                        where: {
                            replyId: replyId.id,
                            userId: userId
                        }
                    });

                    // The user has already voted
                    if(karma !== undefined){
                        // user not allowed to vote twice
                        res.status(401).json({ error: "Forbidden - user not allowed to vote same reply twice" }).send();
                    }else if(replyOwner !== undefined){
                        // user not allowed to vote his own reply
                        res.status(401).json({ error: "Forbidden - user not allowed to vote his own reply" }).send();
                    } else {
                        // If there was no vote we create it
                        const karmaToBeSaved = new Karma();
                        karmaToBeSaved.replyId = replyId.id;
                        karmaToBeSaved.userId = (req as AuthenticatedRequest).userId;
                        await karmaRepo.save(karmaToBeSaved);
                        res.status(200).json({ ok: "ok" }).send();
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
        updateReply,
        createReply,
        deleteReplyById,
        karmaVote
    };
}

export function getReplyController() {

    // Create respository so we can perform database operations
    const replyRepository = getReplyRepository();
    const karmaRepository = getKarmaRepository();

    // Create handlers
    const handlers = getHandlers(replyRepository, karmaRepository);

    // Create router instance so we can declare enpoints
    const router = express.Router();

    // Private
    router.post("/", authMiddleware, handlers.createReply);
    router.patch("/:id", authMiddleware, handlers.updateReply);
    router.delete("/:id", authMiddleware, handlers.deleteReplyById);
    router.post("/:id/karmavote", authMiddleware, handlers.karmaVote);

    return router;
}