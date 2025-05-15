import React from 'react'
import ReactMarkdown from 'react-markdown'

const Markdown = ({ markdown }: { markdown: string }) => {
    return (
        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none prose-headings:font-bold prose-a:text-blue-600">
            <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
    )
}

export default Markdown
