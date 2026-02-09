import { RequestForm } from "@/components/request/request-form"

export default function CreateRequestPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Υποβολή Αίτησης Μετάθεσης
            </h1>
            <RequestForm />
        </div>
    )
}
