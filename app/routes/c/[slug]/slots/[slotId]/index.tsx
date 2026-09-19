import { createRoute } from 'honox/factory'
import { getPublicFirebaseConfig } from '../../../../../application/auth/firebaseConfig'
import { getSlotDetail } from '../../../../../application/calendar/getSlotDetail'
import { SlotDetailPage } from '../../../../../components/slot-detail/page'
import { getCurrentUser } from '../../../../../infrastructure/auth/currentUser'
import { createDrizzleCalendarRepository } from '../../../../../infrastructure/calendar/repositories/drizzleCalendarRepository'
import { createDb } from '../../../../../infrastructure/providers/db/client'

export default createRoute(async (c) => {
  const slug = c.req.param('slug')
  const slotId = c.req.param('slotId')

  if (!slug || !slotId) {
    c.status(404)
    return c.render('Slot not found')
  }

  if (!c.env.DB) {
    c.status(500)
    return c.render('D1 database binding is not configured')
  }

  const detail = await getSlotDetail(createDrizzleCalendarRepository(createDb(c.env.DB)), {
    calendarSlug: slug,
    slotId,
  })

  if (!detail) {
    c.status(404)
    return c.render('Slot not found')
  }

  const firebaseConfig = getPublicFirebaseConfig(c.env)
  const currentUser = await getCurrentUser(c).catch(() => null)

  return c.render(
    <SlotDetailPage
      articleError={c.req.query('article_error')}
      currentUser={currentUser}
      descriptionError={c.req.query('description_error')}
      descriptionSaved={c.req.query('description_saved')}
      detail={detail}
      firebaseConfig={firebaseConfig}
      slotError={c.req.query('slot_error')}
      urlError={c.req.query('url_error')}
      urlSaved={c.req.query('url_saved')}
    />,
    {
      title: `${detail.calendar.title} / ${detail.slot.scheduledDate ?? `#${detail.slot.position}`} - Reray`,
      description: detail.slot.description ?? `${detail.calendar.title} の ${detail.slot.scheduledDate ?? `#${detail.slot.position}`} の枠です。`,
      url: new URL(`/c/${detail.calendar.slug}/slots/${detail.slot.id}`, c.req.url).toString(),
    },
  )
})
