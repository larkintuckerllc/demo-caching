# Demo Caching

## Introduction

This is a demonstration project that illustrates different caching
techniques for different situations. This application displays one of
three PDF files based on the following conditions:

* **Playable**: Successful playable API (*playable.json*) and referenced
PDF (*playable.pdf*).
* **Default**: Playable failure (API or PDF) and sometime successful
default API (*default_playable.json*) and referenced PDF (*default_playable.pdf*).
* **Fallback**: Playable failure (API or PDF) and default never successful
(API or PDF).

## Installation

Download and expand into a directory. From within that direction run:

`npm install`

## Usage

To run the boilerplate, run the following from the installation directory
and open web browser to <http://localhost:8080>.

`npm run start`

## Contact

General questions and comments can be directed to <mailto:john@larkintuckerllc.com>.

## License

This project is licensed under the MIT License.

## Discussion

This projects utilizes different caching techniques.

### Playable and Default Playable API and No Caching ###

The *playable.json* and *default_playable.json* files are not
cached as specified by the server's header:

```
Cache-Control:no-cache, no-store, must-revalidate
```

This means that at each execution, the application will download
them. This allows one to change the playable or default PDF
between executions by providing a different URL.

### Playable PDF and Browser Caching ###

As specified in *playable.json*, the *playable.pdf* file is stored in the
browser's cache virtually indefinitely as specified by the server's
caching header:

```
Cache-Control:public, max-age=31536000
```

This caching is for enhancing the performance of dynamically specified files;
the browser will pull the PDF from the cache if available.  At the same time,
should the cached copy get deleted (say the browser's cache was full and it
was purged) the PDF will be downloaded from the server.

### Default and Local Storage ###

As specified in *default_playable.json*, the *default_playable.pdf* file is stored in
the application's local storage indefinitely using the following JavaScript code:

```
window.localStorage.setItem(DEFAULT_PLAYABLE_FILE, file);
```

**note:** The file is downloaded and converted into a data URL using the
*blob* response type and *FileReader* object.

This caching is for ensuring the availability of dynamically specified files;
the PDF is guaranteed to be available even if the browser is offline.
An application's local storage is limited to 5 MB.

### Fallback and Application Cache ###

The *fallback_playable.pdf* is stored along with the application files in
the application cache as specified in the *index.appcache* file.

This caching is for ensuring the availability of predefined files; the
PDF is guaranteed to be available even if the browser is offline. Like
local storage, the application cache is limited (varies by browser);
it appears that 5 MB is a safe limit.

### Other Caching Techniques ###

One option, only available in Chrome and no longer being standardized
by the W3C, is the FileSystem API.

https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API

A future option, is the service worker API.

https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
