import { SectionNumber } from '../shared/section-number'
import { CreateCalendarForm } from './create-calendar-form'

export function CreateCalendarSection() {
  return (
    <section class="grid gap-10">
      <SectionNumber number="01 /" label="Create Relay" large />
      <CreateCalendarForm />
    </section>
  )
}
