import slugify from "slugify"
import type { IConceptPayload } from "~/utils/types"
import prisma from "./db.server"

export const createConcept = async (data: IConceptPayload) => {
    const slug = slugify(data.name)
    const record = await prisma.concept.create({
        data: {
            slug,

            TranslatedConcept: {
                create: {
                    name: data.name,
                    description: data.description,
                    conceptPhotoPath: data.conceptPhotoPath,
                    original: true,
                    author: {
                        connect: {
                            username: data.author
                        }
                    },
                    lang: {
                        connect: {
                            code: data.default_lang
                        }
                    },

                }
            },
            components: {
                create:
                    data.components.map((name: string) => ({
                        TranslatedComponent: {
                            create: {
                                name
                            }
                        }
                    })
                    )

            },
            domain: {
                create: {
                    name: data.domain
                }
            },
        }

    })
    return { ...record, slug }
}

// components: {
//     create:
//         )
// }

export const createTranslation = async (slug: string | undefined, data: IConceptPayload) => {
    const record = await prisma.translatedConcept.create(
        {
            data: {
                concept: {
                    connect: {
                        slug
                    }
                },
                name: data.name,
                description: data.description,
                lang: {
                    connect: {
                        code: data.default_lang
                    }
                },
                author: {
                    connect: {
                        username: data.author
                    }
                },
                conceptPhotoPath: data.conceptPhotoPath
            },
            include: {
                concept: true
            }

        }
    )
    return record
}

export const fetchConcepts = async () => {
    return await prisma.translatedConcept.findMany({
        where: { original: true }, include: { lang: true, concept: { include: { domain: true } } }
    })
}

export const fetchTranslationBySlugAndLang = async (slug: string | undefined, lang: string) => {
    const concepts = await prisma.translatedConcept.findFirstOrThrow({
        where: {
            concept: {
                slug
            },
            lang: {
                code: lang
            }
        },
        include: {
            lang: true,
            concept: {
                include: {
                    components: {
                        include: {
                            TranslatedComponent: true
                        }
                    },
                    domain: true
                }
            }
        }
    });
    return concepts
}

export const deleteConceptBySlug = async (slug: string | undefined) => {
    return await prisma.concept.delete({
        where: {
            slug
        },
        include: {
            TranslatedConcept: true,
        }

    })
}

export const deleteTranslationById = async (id: number) => {
    return await prisma.translatedConcept.delete({
        where: {
            id
        }
    })
}

export const fetchLangsBySlug = async (slug: string | undefined) => {
    const langs = await prisma.concept.findUniqueOrThrow({
        where: {
            slug
        },
        select: {
            TranslatedConcept: {
                select: {
                    lang: true
                }
            }
        }
    })
    return langs
}

export const fetchConceptBySlug = async (slug: string | undefined) => {
    const concepts = await prisma.translatedConcept.findFirstOrThrow({
        where: {
            concept: {
                slug
            },
        },
        include: {
            lang: true,
            concept: {
                include: {
                    TranslatedConcept: {
                        where: {
                            original: false
                        },
                        include: {
                            lang: true
                        }
                    },
                    components: {
                        include: {
                            TranslatedComponent: true
                        }
                    },
                    domain: true
                }
            }
        }
    });
    return concepts
}

export const fetchConceptsByUser = async (username: string) => {
    return await prisma.translatedConcept.findMany({
        where: {
            author: { username },
            original: true
        },
        include: { lang: true, concept: { include: { domain: true } } }
    })
}


export const fetchTranslationsCountByUser = async (username: string) => {
    return await prisma.translatedConcept.count({ where: { author: { username }, original: false } })
}

export const fetchConceptsByUserCount = async (username: string) => {
    return await prisma.translatedConcept.count({ where: { author: { username }, original: true } })
}

export const fetchDefaultLangByUser = async (username: string) => {
    return (await prisma.user.findUniqueOrThrow({ where: { username }, include: { defaultLang: true } })).defaultLang
}

export const fetchUserStats = async (username: string) => {
    return await Promise.all([fetchConceptsByUserCount(username), fetchTranslationsCountByUser(username), fetchDefaultLangByUser(username)])
}