import { unstable_composeUploadHandlers, unstable_createFileUploadHandler } from "@remix-run/node";
import fs from 'fs'
import path from 'path'

export const uploadHandler = (directory: string) => unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
        directory,
        // Override same file instead of creating another one
        avoidFileConflicts: false,
        // Limit the upload size to 10MB
        maxPartSize: 10 * 1024 * 1024
    }),
    // unstable_createMemoryUploadHandler()
)

export const deleteFileByPath = async (dir: string, filename: string) => {
    try {
        const filepath = path.join(process.cwd(), dir, filename)
        try {
            await fs.promises.access(filepath)
        }
        catch (error) {
            console.log(`file ${filepath} already deleted, moving on...`)
            return { success: true }
        }
        await fs.promises.unlink(filepath)
        return { success: true }
    } catch (error) {
        console.error('Error when deleting filename', filename, error)
        return { success: false, error }
    }
}