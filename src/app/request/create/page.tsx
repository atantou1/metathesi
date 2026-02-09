import { RequestForm } from "@/components/request/request-form"
import { getTransferRequest } from "@/actions/request"

export default async function CreateRequestPage() {
    const request = await getTransferRequest()

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Υποβολή Αίτησης Μετάθεσης
            </h1>
            <RequestForm initialRequest={request} />
        </div>
    )
}
