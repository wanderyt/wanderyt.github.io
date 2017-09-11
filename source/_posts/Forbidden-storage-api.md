title: Forbidden storage api
date: 2017-09-11 10:28:16
categories:
- UI Development
tags:
- Javascript
---

Recently when I tried to debug in safari incognito mode, an error always occurs:

    [Error] QuotaExceededError (DOM Exception 22): The quota has been exceeded.

The root cause is that: storage api, like `localStorage` / `sessionStorage` is not supported in safari incognito mode.

According to the [MDN wiki](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Testing_for_availability), the localStorage is set as an object with a quota of zero, which will make it unusable.

A way is required to detect whether the storage api is available under current browser session.

```javascript
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

if (storageAvailable('localStorage')) { // or storageAvailable('sessionStorage')
    // use local storage
}
else {
    // Too bad, no localStorage for us
}
```