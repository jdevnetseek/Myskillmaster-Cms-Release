import Model from './Model'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export default class Avatar extends Model {
  resource() {
    return 'avatar'
  }
}
