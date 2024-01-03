import type { ActionFunctionArgs } from "@remix-run/node";
import { Outlet, redirect } from "@remix-run/react";
import { deleteTranslationById, deleteConceptBySlug } from "~/db/concept.server";
import { deleteFileByPath } from "~/utils/file-upload";

export async function action({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData()
    const conceptId = Number(formData.get('id'))
    console.log('conceptid delte', conceptId)
    const lang = new URL(request.url).searchParams.get('lang');
    if (lang) {
        console.log('im here')
        const deletedTranslation = await deleteTranslationById(conceptId)
        const isDeleted = await deleteFileByPath('public/uploads', deletedTranslation.conceptPhotoPath)
        if (isDeleted.error) throw new Error("Error deleting a translation", isDeleted.error)
        else return redirect(`/dashboard/concepts/${params.slug}`)
    }
    else {
        console.log('and here')
        const deletedConcept = await (await deleteConceptBySlug(params.slug)).TranslatedConcept
        for (const i in deletedConcept) {
            const isDeleted = await deleteFileByPath('public/uploads', deletedConcept[i].conceptPhotoPath)
            if (isDeleted.error) throw new Error("Error deleting a translation", isDeleted.error)
        }
        return redirect('/dashboard/concepts')

    }
}

export default function ConceptLayoutPage() {
    return (
        <div>
            <Outlet />
        </div>
    )
}