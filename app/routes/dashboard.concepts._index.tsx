import { PlusIcon } from "@heroicons/react/16/solid"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { Link, useLoaderData } from "@remix-run/react"
import { Button } from "~/components/button"
import ConceptCard from "~/components/concept"
import { fetchConcepts } from "~/db/concept.server"

export async function loader() {
    return await fetchConcepts()
}
export default function DashboardUsers() {
    const concepts = useLoaderData<typeof loader>();
    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">List of concepts</h2>
                    <Link to={`/dashboard/concepts/add`}>
                        <Button>
                            Add
                            <PlusIcon className="h-5 md:ml-2" />
                        </Button>
                    </Link>
                </div>
                {concepts.length != 0 ? (
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {concepts.map((concept) => <ConceptCard
                            name={concept.name}
                            slug={concept.concept.slug}
                            description={concept.description}
                            imagePath={concept.conceptPhotoPath}
                            key={concept.name}
                        />
                        )}
                    </div>

                ) : (
                    <div className="flex items-center flex-col sm:mt-16">
                        <ExclamationTriangleIcon width={250} />
                        <p className="text-gray-900">There are no concepts to show, please add some so that they appear here.</p>
                    </div>
                )}
            </div>
        </div>

    )
}