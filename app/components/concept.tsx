import { Link } from "@remix-run/react";

// type ConceptWithRelationships = {
//     slug: string;
//     domain: {
//         id: number;
//         name: string
//     }
//     TranslatedConcept: {
//         id: number;
//         name: string;
//         description: string;
//         conceptPhotoPath: string;
//         conceptId: number;
//         languageId: number;
//         userId: number;
//     }[];
//     components: {
//         id: number;
//         conceptId: number;
//     }[];
// }

interface ICard {
    imagePath: string;
    name: string;
    slug: string;
    description: string;
    isPublic?: boolean;
}

export default function ConceptCard({ name, slug, imagePath, description, isPublic = false }: ICard) {
    return (
        <div className="group relative">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                    src={`/uploads/${imagePath}`}
                    alt={name}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
            </div>
            <div className="mt-4 flex justify-between">
                <div>
                    <h3 className="text-sm text-gray-700">
                        <Link to={isPublic ? `/concepts/${slug}` : `/dashboard/concepts/${slug}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {name}
                        </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{description}</p>
                </div>
            </div>
        </div>
    )
}