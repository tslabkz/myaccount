var projectClass = function() {
    // var api_url = "https://script.google.com/macros/s/AKfycbw1wAThtRLXq5606G7nbhJk_bpFdF7eHfGDNOL4LpxFdwsmsw5mxykXQBR21ZTD7E00/exec";
    var api_url = "https://script.google.com/macros/s/AKfycbySmaITEMroIEzoE6wwKEW9mchZx9tZ8e3ZLnse0HmL8Hf7ydE5-SwS1s2F5gI2Dca2/exec";
    var default_service_id = "myaccount";

    var tempStorage = new tempDataStorage;
    var auth = new authClass(tempStorage);
    //  project.api_url + '?' + $.param(data);

    function buildUrl(action, data) {
        const url = new URL(api_url);
        url.searchParams.set('action', action);
        url.searchParams.set('service_id', default_service_id);
        Object.keys(data).forEach(function(key){    
            url.searchParams.set(key, data[key]);
        });
        return url.toString();
    }

    return {
        api_url,
        default_service_id,
        buildUrl,
        auth
    }
}


var authClass = function(tempDataStorage) {
    var logKey = 'userInfo';

    function isLogged() {
        return tempDataStorage.isActual(logKey);
    }

    function logOut() {
        tempDataStorage.clear();
    }

    function setData(data) {
        tempDataStorage.setData(logKey, data, 86400);
    }

    function getData() {
        return tempDataStorage.getData(logKey);
    }

    return {
        isLogged,
        getData,
        setData,
        logOut,
    }
}

/**
 * объект для временного хранения данных
 * что бы всякий раз не бегать к серверу
 */
var tempDataStorage = function() {
    var keys = [];
    var tempStorageKey = 'tempStorageKey';
    
    function init() {
        let storageKeysString = window.localStorage.getItem(tempStorageKey);
        if (storageKeysString === null) {
            keys = [];
        } else {
            keys = JSON.parse(storageKeysString);
        }
    }

    init();

    /**
     * очищает все данные
     */
    function clear() {
        keys.forEach(function(key){
            window.localStorage.removeItem(key);
            window.localStorage.removeItem(key + '_expire');
            window.localStorage.removeItem(tempStorageKey);
        });
    }

    /**
     * сохраняет данные во временное хранилище
     * @param {*} key 
     * @param {*} data 
     * @param {*} duration 
     */
    function setData(key, data, duration = 300) {
        let timeObject = new Date();
        let seconds = duration; // 300 - 5 минут
        const milliseconds = seconds * 1000; // 10 seconds = 10000 milliseconds
        timeObject = new Date(timeObject.getTime() + milliseconds);
        let expireTime = timeObject.getTime();
        window.localStorage.setItem(key + '_expire', expireTime);
        window.localStorage.setItem(key, JSON.stringify(data));
        if (!keys.includes(key)) {
            keys.push(key);
            window.localStorage.setItem(tempStorageKey, JSON.stringify(keys));
        }
    }

    /**
     * возвращает данные
     * @param {*} key 
     */
    function getData(key) {
        if (!isActual(key)) {
            return null;
        }
        let savedDataString = window.localStorage.getItem(key); 
        if (!savedDataString == null) {
            return null;
        }
        return JSON.parse(savedDataString);
    }

    /**
     * просрочен ключ или нет
     */
    function isActual(key) {
        if (!keys.includes(key)) {
            return false;
        }
        let keyExpireTime = window.localStorage.getItem(key + '_expire'); 
        if (!keyExpireTime) {
            return false;
        }
        let currentTime = (new Date()).getTime();
        return currentTime <= keyExpireTime; 
    }

    return {
        clear,
        setData,
        getData,
        isActual,
    }
}


const project = new projectClass();