import { SectionNumber } from '../../shared/section-number/index'
import { CreateCalendarForm } from '../create-calendar-form/index'

export function CreateCalendarSection() {
  return (
    <section class="grid gap-10">
      <SectionNumber number="01 /" label="Create Relay" large />
      <CreateCalendarForm />
    </section>
  )
}
