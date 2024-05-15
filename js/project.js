var projectClass = function() {
    var api_url = "https://script.google.com/macros/s/AKfycbw1wAThtRLXq5606G7nbhJk_bpFdF7eHfGDNOL4LpxFdwsmsw5mxykXQBR21ZTD7E00/exec";
    var default_service_id = "mektep";

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
    }
}

const project = new projectClass();