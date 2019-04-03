import { getConnection } from "typeorm";
import { Reply } from "../entities/reply";

export function getReplyRepository() {
    const connection = getConnection();
    const replyRepository = connection.getRepository(Reply);
    return replyRepository;
}
