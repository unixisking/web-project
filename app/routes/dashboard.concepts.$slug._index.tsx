import { Link, useLoaderData, useParams } from "@remix-run/react"

import type { LoaderFunctionArgs } from "@remix-run/node"
import { fetchConceptBySlug, fetchTranslationBySlugAndLang } from "~/db/concept.server"
import { Button } from "~/components/button"



export async function loader({ request, params }: LoaderFunctionArgs) {
    const lang = new URL(request.url).searchParams.get('lang');
    if (lang) return await fetchTranslationBySlugAndLang(params.slug, lang)
    return await fetchConceptBySlug(params.slug)
}

export default function Concept() {
    const concept = useLoaderData<ReturnType<typeof fetchConceptBySlug> | ReturnType<typeof fetchConceptBySlug>>();
    const params = useParams()
    return (
        <div>
            <div className="space-x-4 w-2/3">
                <div className="space-y-2">
                    <h1 className="text-2xl">{concept.name}</h1>
                    <div className="flex justify-between items-center">

                        <div className="flex space-x-2 h-[24px]">
                            <span className="capitalize inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                {concept.concept.domain.name}
                            </span>
                            <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                Language: {concept.lang.name}
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            <Link to={`/dashboard/concepts/${params.slug}/add-translation`}>
                                <Button>Add translation</Button>
                            </Link>
                            <form method="post" name="delete">
                                <input type="hidden" name="id" value={concept.id} />
                                <Button type="submit" className="bg-red-500 hover:bg-red-400 focus-visible:outline-red-500 active:bg-red-600">Delete</Button>
                            </form>
                        </div>
                    </div>
                    {concept.original && (
                        <span className="text-gray-500 text-sm">Translations: {concept.concept.TranslatedConcept.map(t => (
                            <Link to={`/dashboard/concepts/${concept.concept.slug}?lang=${t.lang.code}`} key={t.lang.code} className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                Language: {t.lang.name}
                            </Link>

                        ))}</span>
                    )}
                    <img
                        width={450}
                        src={`/uploads/${concept.conceptPhotoPath}`} alt={concept.name} />
                </div>
                <p className="text-left text-sm text-gray-500">{concept.description}</p>
                <div className="space-y-1 mt-2">

                    <h2>Components:</h2>
                    <ul className="list-decimal ml-4">
                        {concept.concept.components.map(c => (
                            <li className="text-sm text-gray-500" key={c.TranslatedComponent[0].id}>{c.TranslatedComponent[0].name}</li>
                        ))}

                    </ul>
                </div>
            </div>
        </div>
    )
}
