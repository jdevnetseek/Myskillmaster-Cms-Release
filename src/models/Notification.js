import Model from './Model'
import Avatar from './Avatar'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
dayjs.extend(utc)

export default class Notification extends Model {
  resource() {
    return 'admin/notifications'
  }

  avatar() {
    return this.hasMany(Avatar)
  }

  get avatarText() {
    return this.first_name.charAt(0) + this.last_name.charAt(0)
  }

  get addedDate() {
    return dayjs.utc(this.created_at).local().format('MMM DD, YYYY hh:mm A')
  }

  get diffForHuman() {
    return dayjs.utc(this.created_at).local().from()
  }
}
