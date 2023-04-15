try{
    importScripts('service_worker.js');
    importScripts('content_script.js')
} catch (e) {
    console.log(e);
}