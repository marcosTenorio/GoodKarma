import * as express from "express";
import * as joi from "joi";
import { authMiddleware, AuthenticatedRequest } from "../config/middleware";
import { getCommentRepository } from "../repositories/comment_repository";
import { Comment } from "../entities/comment";
import { Repository } from "typeorm";


export const commentIdSchema = {
    id: joi.number()
};

export const commentUpdateSchema = {
    text: joi.string()
}

export const commentSchema = {
    replyId: joi.number(),
    text: joi.string()
};


export function getHandlers(commentRepo: Repository<Comment>) {


    const createComment = (req: express.Request, res: express.Response) => {
        (async () => {
            try {

                // The request userId property is set by the authMiddleware
                // if it is undefined it means that we forgot the authMiddleware
                if ((req as AuthenticatedRequest).userId === undefined) {
                    throw new Error("The request is not authenticated! Please ensure that authMiddleware is used");
                }

                // Read and validate the comment from the request body
                const newComment = req.body;
                const result = joi.validate(newComment, commentSchema);

                if (result.error) {
                    res.json({ msg: `Invalid user details in body!` }).status(400).send();
                } else {

                    // Create new comment
                    const commentToBeSaved = new Comment();
                    commentToBeSaved.userId = (req as AuthenticatedRequest).userId;
                    commentToBeSaved.text = newComment.text;
                    commentToBeSaved.replyId = newComment.replyId;
                    const savedLink = await commentRepo.save(commentToBeSaved);
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

    const deleteCommentById = (req: express.Request, res: express.Response) => {
        (async () => {
            try {

                // The request userId property is set by the authMiddleware
                // if it is undefined it means that we forgot the authMiddleware
                if ((req as AuthenticatedRequest).userId === undefined) {
                    throw new Error("The request is not authenticated! Please ensure that authMiddleware is used");
                }

                // Validate Id in URL
                const idStr = req.params.id;
                const commentId = { id: parseInt(idStr) };
                const idValidationresult = joi.validate(commentId, commentIdSchema);

                if (idValidationresult.error) {
                    res.status(400).json({ error: "Bad request" }).send();
                } else {

                    // Try to find comment to be deleted
                    const comment = await commentRepo.findOne(commentId.id);

                    // If link not found return 404 not found
                    if (comment === undefined) {
                        res.status(404)
                            .json({ error: "Not found" })
                            .send();
                    } else {

                        // If lik was found, remove it from DB
                        await commentRepo.remove(comment);
                        res.json({ msg: "OK" }).send();
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

    // Update an existing comment
    const updateComment = (req: express.Request, res: express.Response) => {
        (async () => {
            try {

                // The request userId property is set by the authMiddleware
                // if it is undefined it means that we forgot the authMiddleware
                if ((req as AuthenticatedRequest).userId === undefined) {
                    throw new Error("The request is not authenticated! Please ensure that authMiddleware is used");
                }

                const commentId = { id: parseInt(req.params.id) };
                const newComment = req.body;

                // Validate the Id in the URL
                const idValidationResult = joi.validate(commentId, commentIdSchema);

                // Validate the comment update in the request body
                const replyUpdateValidationResult = joi.validate(newComment, commentUpdateSchema);

                if (idValidationResult.error) {
                    // The comment id is invalid
                    res.status(400)
                        .json({ msg: `Invalid parameter id '${commentId.id}' in URL` })
                        .send();
                } else if (replyUpdateValidationResult.error) {
                    // The update is invalid
                    res.status(400)
                        .json({ msg: `Invalid comment update in request body` })
                        .send();
                } else {

                    // Try to read the comment
                    const comment = await commentRepo.findOne(commentId);

                    // The comment is not found
                    if (comment === undefined) {
                        res.status(404)
                            .json({ msg: `comment with id '${commentId.id}' not found!` })
                            .send();
                    } else {

                        // Validate that the current user is also
                        // the author of the comment to be updated
                        const replyOwnerId = comment.userId;
                        const userId = (req as AuthenticatedRequest).userId;

                        // User is not the author
                        if (replyOwnerId !== userId) {
                            res.status(403)
                                .json({ msg: `The current user is not the author of the comment` })
                                .send();
                        } else {

                            // Update comment content
                            await commentRepo.update(
                                { text: newComment.text },
                                { id: commentId.id }
                            );

                            const where = { id: commentId.id };
                            const set = { text: newComment.text };
                            commentRepo.update(where, set);

                            res.json({ ok: "ok" }).send();
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
        createComment,
        deleteCommentById,
        updateComment
    };
}


export function getCommentController() {

    const commentRepository = getCommentRepository();
    const handlers = getHandlers(commentRepository);
    const router = express.Router();

    // Private
    router.post("/", authMiddleware, handlers.createComment);
    router.patch("/:id", authMiddleware, handlers.updateComment);
    router.delete("/:id", authMiddleware, handlers.deleteCommentById);

    return router;
}