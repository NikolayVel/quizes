const settings = {
    host: ''
}

export {
    get,
    post,
    put,
    del,
    login,
    register,
    logout,
    settings,
}

async function request(url, options) {
    try {
        const response = await fetch(url, options);
        if (response.ok == false) {
            const err = await response.json();
            //alert(err.message);
            throw new Error(err.message); // sends the error to the module that have invoked this function, otherwise will receive undefined 
        }
        
        try {
            return await response.json();
        } catch (err) {
            return response
        }
    } catch(err) {
        alert(err.message);
        throw err;
    }
}

function createOptions(method = 'get', data) {
    const result = {
        method,
        headers: {
            'X-Parse-Application-Id': 'J4G9L0nGcLZ2ni3tinj2yCREdNCCR5jxXi3dsDp4',
            'X-Parse-REST-API-Key': 'CRbkGMw8ItHQTSUX9TNFB7OstoONM1T30tMLrYBZ'
        }
    };

    if (data != null) {
        result.headers['Content-Type'] = 'application/json';
        result['body'] = JSON.stringify(data);
    }
    
    const token = sessionStorage.getItem('authToken');

    if (token) {
        result.headers['X-Parse-Session-Token'] = token;
    }
    

    return result;
}

async function get(url) {
    return await request(settings.host + url, createOptions());
}

async function post(url, data) {
    return await request(settings.host + url, createOptions('post', data))
}

async function put(url, data) {
    return await request(settings.host + url, createOptions('put', data))
}

async function del(url, data) {
    return await request(settings.host + url, createOptions('delete', data))
}

async function login(username, password) {
    const response = await post('/login', { username, password });

    sessionStorage.setItem('authToken', response.sessionToken);
    sessionStorage.setItem('username', username);
    //sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('userId', response.objectId);

    return response
}
async function register(email, username, password) {
    const response = await post('/users', { email, username, password });

    sessionStorage.setItem('authToken', response.sessionToken);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('userId', response.objectId);

    return response
}

async function logout() {
    const response = await post('/logout', {})
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userId');

    return response;
}
