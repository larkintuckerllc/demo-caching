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
cached as specified by the server's caching header:

```
HEADER
```

This means that at each execution, the application will download
them. This allows one to change the playable or default PDF
between executions by providing a different URL.

### Playable PDF and Browser Caching ###

As specified in *playable.json*, the *playable.pdf* file is stored in the
browser's cache virtually indefinitely as specified by the server's
caching header:

```
HEADER
```

This caching is for enhancing the performance of dynamically specified files;
the browser will pull the PDF from the cache if available.  At the same time,
should the cached copy get deleted (say the browser's cache was full and it
was purged) the PDF will be downloaded from the server.

### Default and LocalStorage ###

As specified in *default_playable.json*, the *default_playable.pdf* file is stored in
the application's LocalStorage indefinitely using the following JavaScript code:

```
CODE
```

// TODO: TWO CODE BLOCKS ONE FOR DOWNLOADING

This caching is for ensuring the availability of dynamically specified files;
the PDF is guaranteed to be available even if the browser is offline.
An application's LocalStorage is limited to 5 MB.

### Fallback and Application Cache ###

The *fallback_playable.pdf* is stored along with the application files in
the application cache as specified in the *MANIFEST*.

This caching is for ensuring the availability of predefined files; the
PDF is guaranteed to be available even if the browser is offline.

// TODO: LIMITS ON SIZE

### Other Caching Techniques ###
