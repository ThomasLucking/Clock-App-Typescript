import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import type { Entry, EntryPayload } from '../api/entries'
import ErrorMessage from './ErrorMessage'
import { Temporal } from '@js-temporal/polyfill';


type EntryFormProps = {
    title: string
    defaultValues?: Pick<Entry, 'description' | 'project_id' | 'start_time' | 'end_time'>
    onSubmit: (payload: EntryPayload) => Promise<Response>
}

type FormErrors = {
    start_time?: string
    end_time?: string
    form?: string
}


const toDatetimeLocal = (iso: string) => {
  const result = Temporal.Instant.from(iso)
    .toZonedDateTimeISO(Temporal.Now.timeZoneId())
    .toPlainDateTime()
    .toString()
    .slice(0, 16)
    return result

}

export default function EntryForm({ title, defaultValues, onSubmit }: EntryFormProps) {
    const navigate = useNavigate()
    const [errors, setErrors] = useState<FormErrors>({})

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const startTime = formData.get('start_time') as string
        const endTime = formData.get('end_time') as string

        const next: FormErrors = {}

        if (!startTime) {
            next.start_time = 'Start time is required'
        } else {
            try { Temporal.PlainDateTime.from(startTime) }
            catch { next.start_time = 'Start time is not a valid date' }
        }

        if (!endTime) {
            next.end_time = 'End time is required'
        } else {
            try { Temporal.PlainDateTime.from(endTime) }
            catch { next.end_time = 'End time is not a valid date' }
        }

        if (!next.start_time && !next.end_time && startTime && endTime &&
            Temporal.PlainDateTime.compare(endTime, startTime) <= 0) {
            next.end_time = 'End time must be after start time'
        }

        if (Object.keys(next).length > 0) {
            setErrors(next)
            return
        }

        setErrors({})

        const payload: EntryPayload = {
            project_id: Number(formData.get('project_id')),
            description: String(formData.get('description')),
            start_time: Temporal.PlainDateTime.from(startTime).toString(),
            end_time: Temporal.PlainDateTime.from(endTime).toString(),

        }
        console.log('payload:', payload.start_time, payload.end_time);
        console.log(Temporal.Now.timeZoneId());
        console.log(payload);


        try {
            const response = await onSubmit(payload)
            if (response.ok) {
                navigate({ to: '/entries/$page', params: { page: '1' } })
            } else {
                setErrors({ form: 'Failed to save entry. Please try again.' })
            }
        } catch {
            setErrors({ form: 'An unexpected error occurred. Please try again.' })
        }
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="mb-8">
                <p className="island-kicker mb-2">Time Tracker</p>
                <h1 className="text-3xl font-bold text-(--text)">{title}</h1>
            </div>

            <form onSubmit={handleSubmit} className="island-shell rounded-2xl p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="description" className="text-sm font-semibold text-(--text)">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        defaultValue={defaultValues?.description}
                        placeholder="What did you work on?"
                        className="rounded-xl border px-3 py-2.5 text-sm text-(--text) bg-(--bg-base) placeholder:text-(--text-soft) focus:outline-none focus:ring-2 focus:ring-(--accent) resize-none"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="project_id" className="text-sm font-semibold text-(--text)">
                        Project
                    </label>
                    <input
                        id="project_id"
                        name="project_id"
                        type="number"
                        min={1}
                        defaultValue={defaultValues?.project_id}
                        placeholder="Project ID"
                        className="rounded-xl border border-(--line) px-3 py-2.5 text-sm text-(--text) bg-(--bg-base) placeholder:text-(--text-soft) focus:outline-none focus:ring-2 focus:ring-(--accent) [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="start_time" className="text-sm font-semibold text-(--text)">
                        Start Time
                    </label>
                    <input
                        id="start_time"
                        name="start_time"
                        type="datetime-local"
                        defaultValue={defaultValues ? toDatetimeLocal(defaultValues.start_time) : undefined}
                        className="rounded-xl border border-(--line) px-3 py-2.5 text-sm text-(--text) bg-(--bg-base) focus:outline-none focus:ring-2 focus:ring-(--accent)"
                    />
                    <ErrorMessage message={errors.start_time} />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="end_time" className="text-sm font-semibold text-(--text)">
                        End Time
                    </label>
                    <input
                        id="end_time"
                        name="end_time"
                        type="datetime-local"
                        defaultValue={defaultValues ? toDatetimeLocal(defaultValues.end_time) : undefined}
                        className="rounded-xl border border-(--line) px-3 py-2.5 text-sm text-(--text) bg-(--bg-base) focus:outline-none focus:ring-2 focus:ring-(--accent)"
                    />
                    <ErrorMessage message={errors.end_time} />
                </div>

                <ErrorMessage message={errors.form} />

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-(--line)">
                    <Link
                        to="/entries/$page"
                        params={{ page: '1' }}
                        className="rounded-xl border border-(--line) bg-(--surface) px-4 py-2 text-sm font-semibold text-(--text) hover:bg-(--bg-base)"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="rounded-xl bg-(--text) px-4 py-2 text-sm font-semibold text-(--bg-base) hover:opacity-90"
                    >
                        Save entry
                    </button>
                </div>
            </form>
        </div>
    )
}
