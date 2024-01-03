import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { Card } from "~/components/card";

import type { LoaderFunctionArgs } from "@remix-run/node";
import { fetchConceptsByUser, fetchUserStats } from "~/db/concept.server";
import ConceptCard from "~/components/concept";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"

export async function loader({ request }: LoaderFunctionArgs) {
    const currentUser = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });
    const concepts = await fetchConceptsByUser(currentUser.username)
    const [count, translationCount, default_lang] = await fetchUserStats(currentUser.username)
    return { currentUser, concepts, stats: { count, translationCount, default_lang } }
}

export default function Concept() {
    const { currentUser, concepts, stats } = useLoaderData<typeof loader>()
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h2>User stats</h2>
                <div className="flex space-x-4">
                    <Card title="Total concepts created" value={stats.count} type="concepts" />
                    <Card title="Total translations added" value={stats.translationCount} type="translations" />
                    {stats.default_lang && <Card title="Default language" value={stats.default_lang.name} type="lang" />}
                </div>
            </div>
            <h2>List of created concepts by <span className="capitalize">{currentUser.username} </span></h2>
            {concepts.length != 0 ? (
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {concepts.map(concept => <ConceptCard
                        key={concept.name}
                        name={concept.name}
                        description={concept.description}
                        slug={concept.concept.slug}
                        imagePath={concept.conceptPhotoPath}
                    />)}
                </div>

            ) : (

                <div className="flex items-center flex-col sm:mt-16">
                    <ExclamationTriangleIcon width={250} />
                    <p className="text-gray-900">There are no concepts to show, please add some so that they appear here.</p>
                </div>
            )}
        </div>
    )
}