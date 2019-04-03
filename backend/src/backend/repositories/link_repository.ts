import { getConnection } from "typeorm";
import { Link } from "../entities/link";


export function getLinkRepository() {
    const connection = getConnection();
    const linkRepository = connection.getRepository(Link);
    return linkRepository;
}
