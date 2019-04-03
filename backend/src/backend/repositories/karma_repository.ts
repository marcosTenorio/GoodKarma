import { getConnection } from "typeorm";
import { Karma } from "../entities/karma";

export function getKarmaRepository() {
    const connection = getConnection();
    const karmaRepository = connection.getRepository(Karma);
    return karmaRepository;
}
