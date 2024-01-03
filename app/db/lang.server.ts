import { fetchLangsBySlug } from "./concept.server";
import prisma from "./db.server";

export async function fetchLanguages() {
    return await prisma.language.findMany()
}

// Fetch available languages where no user provided a translation for a concept yet.
export async function fetchAvailableLanguages(slug: string | undefined) {
    let availableLanguages = [];
    const allLanguages = await fetchLanguages();
    const concepts = (await fetchLangsBySlug(slug)).TranslatedConcept

    console.log('concepts', concepts)
    console.log('all langs', allLanguages)

    for (const i in allLanguages) {
        const language = allLanguages[i];
        const isLanguageAvailable = concepts.every(concept => concept.lang.code != language.code);

        if (isLanguageAvailable) {
            availableLanguages.push(language);
        }
    }

    return availableLanguages;
}
