import moment from 'moment'
const date = {}

date.fromNow = (data) => {
    return moment(data).fromNow()
}

export default date