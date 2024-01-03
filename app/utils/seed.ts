import fs from 'fs'
import path from 'path'
import prisma from "~/db/db.server";
import { concepts, languages } from "./constants";
import { createUser } from '~/db/user.server';

const sourcePhotosFolder = path.join(process.cwd(), 'seed-data/concept-illustrations');
const destPhotosFolder = path.join(process.cwd(), 'public/uploads')

export const movieFiels = async (sourceFolder: string, destFolder: string) => {
    try {
        const files = await fs.promises.readdir(sourceFolder);
        for (const file of files) {
            const sourceFilePath = path.join(sourceFolder, file)
            const destFilePath = path.join(destFolder, file)

            await fs.promises.copyFile(sourceFilePath, destFilePath)
            console.log(`successfully moved seed files from ${sourceFolder} to ${destFolder}`)
        }
    }
    catch (error) {
        console.error('Error:', error);
        throw new Error(`Error moving files from ${sourceFolder} to ${destFolder}`);
    }

}




(async () => {
    // Languages
    console.log('Adding languages to db...')
    await prisma.language.createMany({ data: languages })
    console.log('Adding languages to db: done')

    // Creating a user

    const user = (await createUser("testuser", "urouen123"))
    if (!user) throw new Error('Error creating seed user')

    // Concepts
    console.log('Adding concept data...')
    // TODO: update this code once prisma.createMany supports nested relations
    // TODO: https://github.com/prisma/prisma/issues/5455
    let createManyConcepts = concepts.map(c => prisma.concept.create({
        data: {
            slug: c.slug,
            domain: {
                create: {
                    name: c.domain
                }
            },
            TranslatedConcept: {
                createMany: {
                    data: c.translations.map(t => ({
                        name: c.name,
                        description: c.description,
                        conceptPhotoPath: c.filename,
                        languageId: 2,
                        userId: user.id,
                        original: c.original
                    }))
                }
            },

            components: {
                create:
                    c.components.map((name: string) => ({
                        TranslatedComponent: {
                            create: {
                                name
                            }
                        }
                    })
                    )
            }
        }

    }))

    let createManyTranslations = concepts.map(c => prisma.translatedConcept.create({
        data: {
            concept: {
                connect: {
                    slug: c.slug
                }
            },
            name: c.translations[0].name,
            description: c.translations[0].description,
            lang: {
                connect: {
                    code: c.translations[0].lang
                }
            },
            author: {
                connect: {
                    username: user.username
                }
            },
            conceptPhotoPath: c.translations[0].filename,
        },
    }))

    await Promise.all(createManyConcepts)
    await Promise.all(createManyTranslations)

    // Move concept photos to public folder 

    await movieFiels(sourcePhotosFolder, destPhotosFolder)

    console.log('Adding concept data: done')
})()



