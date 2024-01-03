import type { USER_ROLE } from "@prisma/client";

export type User = {
    id: number;
    username: string
    role: USER_ROLE
}

export type LoginError = {
    error: boolean,
    type: string,
    message: string
}

export interface IConceptPayload {
    name: string;
    description: string;
    components: string[];
    domain: string; // could be an enum of a selected few domains.
    default_lang: string;
    conceptPhotoPath: string
    author: string;
}