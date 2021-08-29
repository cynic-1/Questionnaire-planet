import request from '@/utils/request'

export function fetchTravelerInfo() {
    return request({
        // url: '/site1',
        url: '/api/login_register/loginTraveler',
        method: 'get',
        params: {}
    })
}
