import { PlusIcon } from '@heroicons/react/24/outline'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { Form, Link, json, redirect, useActionData, useLoaderData } from '@remix-run/react'
import { z } from 'zod'
import { useState } from 'react'
import { unstable_parseMultipartFormData } from '@remix-run/node'
import path from 'path'

import { createTranslation } from '~/db/concept.server'
import { uploadHandler } from '~/utils/file-upload'

import type { IConceptPayload } from '~/utils/types'
import type { NodeOnDiskFile, ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server'
import { fetchAvailableLanguages } from '~/db/lang.server'

const ConceptPayloadSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    components: z.string().array().nonempty({ message: 'Please add at least one component to add a concept' }),
    domain: z.string().min(1, 'Domain is required'),
    concept_photo: z.any(), // TODO: better validation for File input (https://github.com/colinhacks/zod/issues/387#issuecomment-1774603011)
    default_lang: z.string().min(1, 'Language is required'),
})

export async function action({ request, params }: ActionFunctionArgs) {
    const clonedRequest = request.clone()
    const formData = await request.formData()
    let concept_photo;
    try {
        const formFileData = await unstable_parseMultipartFormData(clonedRequest, uploadHandler(`public/uploads`))

        concept_photo = formFileData.get('concept_photo') as NodeOnDiskFile

        // Extract and format components from form data
        const components = formData.getAll('components').map(c => c as string);

        const currentUser = await authenticator.isAuthenticated(request)

        const payload = {
            ...Object.fromEntries(formData),
            components,
            conceptPhotoPath: path.basename(concept_photo.getFilePath()),
            author: currentUser?.username
        } as IConceptPayload;

        console.log('payload:', payload)

        // Validate form
        ConceptPayloadSchema.parse(payload)

        const record = await createTranslation(params.slug, payload)
        return redirect(`/dashboard/concepts/${record.concept.slug}`)
    }
    catch (error) {
        console.log('error catched', error)
        // Form validation error
        if (error instanceof z.ZodError) {
            await concept_photo?.remove()
            return json({ success: false, errors: error.format(), errorMessage: 'Please fix the errors listed below' })
        }
        // Internal error
        await concept_photo?.remove()
        return json({ success: false, errorMessage: 'Encountered an error while creating the concept, please contact an admin.' })
    }
}

export async function loader({ params }: LoaderFunctionArgs) {
    return await fetchAvailableLanguages(params.slug)
}

export default function AddConceptPage() {
    const [components, setComponents] = useState<string[]>([]);
    const [componentValue, setComponentValue] = useState('')
    const [fileInputName, setFileInputName] = useState<string | null>(null)
    const actionData = useActionData<typeof action>()
    const langs = useLoaderData<typeof loader>()
    console.log('actionData', actionData)
    console.log('avail langs', langs)
    return (
        <Form
            method="post" encType='multipart/form-data'>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">

                    <h2 className="text-base font-semibold leading-7 text-gray-900">Add a translation</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Please fill the information below to add a translation for this concept
                    </p>
                    <p className='text-red-500 text-xs'>{actionData?.success === false ? actionData?.errorMessage : null}</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="col-span-full">
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    autoComplete="name"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                                {
                                    // @ts-ignore
                                    <span className="text-red-500 text-xs">{actionData?.success === false && actionData.error && actionData.error['name']?._errors[0]}</span>
                                }
                            </div>
                        </div>
                        <div className="col-span-full">
                            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                    defaultValue={''}
                                />
                                {
                                    // @ts-ignore
                                    <span className="text-red-500 text-xs">{actionData?.success === false && actionData.error && actionData.error['description']?._errors[0]}</span>
                                }
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="concept_photo" className="block text-sm font-medium leading-6 text-gray-900">
                                Concept photo
                            </label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                                <div className="text-center">
                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label
                                            htmlFor="concept_photo"
                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500"
                                        >
                                            <span>Upload a file</span>
                                            <input onChange={(e) => {
                                                if (e.target.files != null) {
                                                    setFileInputName(e.target.files[0].name)

                                                }
                                            }} id="concept_photo" name="concept_photo" type="file" className="sr-only" />

                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                            {fileInputName && <p className='text-xs leading-5 text-gray-600'>Uploaded file {fileInputName}</p>}
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="domain" className="block text-sm font-medium leading-6 text-gray-900">
                                Domain
                            </label>
                            <div className="mt-2">
                                <select
                                    id="domain"
                                    name="domain"
                                    autoComplete="domain"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                >
                                    <option>Biology</option>
                                    <option>Math</option>
                                </select>
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="default_lang" className="block text-sm font-medium leading-6 text-gray-900">
                                Language
                            </label>
                            <div className="mt-2">
                                <select
                                    id="default_lang"
                                    name="default_lang"
                                    autoComplete="default_lang"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                >
                                    {langs.map(lang => (
                                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                                    ))}

                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-b border-gray-900/10 mb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Components</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Add components to your concept</p>

                    <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="col-span-full">
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                Component name
                            </label>
                            <div className="mt-2 flex">
                                <input
                                    type="text"
                                    value={componentValue}
                                    onChange={(e) => setComponentValue(e.target.value)}
                                    placeholder='Please enter a name for your component'
                                    className="placeholder:text-sm block w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setComponents(components => [...components, componentValue])
                                        setComponentValue('')
                                    }}
                                    className="flex ml-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                >
                                    Add
                                    <PlusIcon className="h-5 ml-2" />
                                </button>

                            </div>
                            {
                                //@ts-ignore
                                <span className="text-red-500 text-xs">{actionData?.success === false && actionData.error && actionData.error['components']?._errors[0]}</span>
                            }
                            <ol className='space-y-2 mt-2 ml-4 list-decimal'>
                                {components.map((component, i) =>
                                    <div key={`component_${i}`}>
                                        <input type="hidden" name='components' value={component} />
                                        <li className='text-sm text-gray-500' key={component}>{component}</li>
                                    </div>
                                )}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <Link to="/dashboard/concepts" type="button" className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                    Save
                </button>
            </div>
        </Form>
    )
}
