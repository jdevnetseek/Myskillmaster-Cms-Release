import Model from './Model'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export default class ReportCategory extends Model {
  resource() {
    return 'admin/reports/categories'
  }

  get addedDate() {
    return dayjs.utc(this.created_at).local().format('MMM DD, YYYY hh:mm A')
  }
}
