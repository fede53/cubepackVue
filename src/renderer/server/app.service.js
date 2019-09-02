import axios from 'axios'

axios.defaults.baseURL = 'http://cubepack.local/api/'

axios.interceptors.request.use(function (config) {
  const token = window.localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const appService = {

    connectToServer (credentials) {

        var call = null;

        return new Promise((resolve, reject) => {

            var acceptedResponse = { 
                validateStatus : function (status) {
                    return status < 500; // Reject only if the status code is greater than or equal to 500
                }
            }
            
            switch (credentials.methodToConnect) {

                case 'post':
                    call = axios.post(credentials.urlToConnect, credentials, acceptedResponse);
                break;
                case 'patch':
                    call = axios.patch(credentials.urlToConnect, credentials, acceptedResponse);
                break;
                case 'delete':
                    call = axios.delete(credentials.urlToConnect, credentials, acceptedResponse);
                break;
                default:
                    call = axios.get(credentials.urlToConnect, credentials, acceptedResponse);
                break;

            }

            call.then(response => {
                if( response.data.errors ) {
                    response.data.success = false
                }
                resolve(response.data)
            }).catch(error => {
                response.data.message = 'Generic Error'
                response.data.success = false
                reject(response.data)
            })
        })
    }
}

export default appService
