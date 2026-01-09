## MapLibre GL Compare

Swipe and sync between two MapLibre maps. This plugin was originally developed for Mapbox (https://github.com/mapbox/mapbox-gl-compare) and was migrated to MapLibre after Mapbox changed its license.

## Code example

### Examples

#### Full Example with a CDN

```js
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Swipe between maps</title>
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <script src="https://unpkg.com/maplibre-gl@5.15.0/dist/maplibre-gl.js"></script>
    <link
      href="https://unpkg.com/maplibre-gl@5.15.0/dist/maplibre-gl.css"
      rel="stylesheet"
    />
    <style>
      body {
        margin: 0;
        padding: 0;
      }

      #map {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
      }
    </style>
  </head>

  <body>
    <style>
      body {
        overflow: hidden;
      }

      body * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      .map {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
      }
    </style>
    <script src="https://unpkg.com/@maplibre/maplibre-gl-compare@0.5.0/dist/maplibre-gl-compare.umd.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/@maplibre/maplibre-gl-compare@0.5.0/dist/maplibre-gl-compare.css" type="text/css" />
    <div id="comparison-container">
      <div id="before" class="map"></div>
      <div id="after" class="map"></div>
    </div>
    <script>
      const beforeMap = new maplibregl.Map({
        container: "before",
        style: "https://demotiles.maplibre.org/style.json",
        center: [7.221275, 50.326111],
        zoom: 5,
      });

      const afterMap = new maplibregl.Map({
        container: "after",
        style:
          "https://raw.githubusercontent.com/lukasmartinelli/naturalearthtiles/gh-pages/maps/natural_earth.vector.json",
        center: [7.221275, 50.326111],
        zoom: 5,
      });

      // A selector or reference to HTML element
      const container = "#comparison-container";

      const map = new maplibregl.Compare(beforeMap, afterMap, container, {
        // Set this to enable comparing two maps by mouse movement:
        // mousemove: true
      });
    </script>
  </body>
</html>
```

### Example with a bundler

```js
import * as maplibre from "maplibre-gl";
import { Compare } from "@maplibre/maplibre-gl-compare";

const beforeMap = new maplibregl.Map({
container: "before",
style: "https://demotiles.maplibre.org/style.json",
center: [7.221275, 50.326111],
zoom: 5,
});

const afterMap = new maplibregl.Map({
container: "after",
style:
    "https://vectortiles.geo.admin.ch/styles/ch.swisstopo.leichte-basiskarte.vt/style.json",
center: [7.221275, 50.326111],
zoom: 5,
});

// A selector or reference to HTML element
const container = '#comparison-container';

const map = new Compare(beforeMap, afterMap, container, {
  mousemove: true, // Optional. Set to true to enable swiping during cursor movement.
  orientation: 'vertical' // Optional. Sets the orientation of swiper to horizontal or vertical, defaults to vertical
});
```

### Methods

```js
compare = new maplibregl.Compare(beforeMap, afterMap, container, {
  mousemove: true, // Optional. Set to true to enable swiping during cursor movement.
  orientation: 'vertical' // Optional. Sets the orientation of swiper to horizontal or vertical, defaults to vertical
});

// Get Current position - this will return the slider's current position, in pixels
compare.currentPosition;

// Set Position - this will set the slider at the specified (x) number of pixels from the left-edge or top-edge of viewport based on swiper orientation
compare.setSlider(x);

//Listen to slider movement - and return current position on each slideend
compare.on('slideend', (e) => {
  console.log(e.currentPosition);
});

//Remove - this will remove the compare control from the DOM and stop synchronizing the two maps.
compare.remove();
```

## Live examples

[Compare hybrid with streets](https://rawcdn.githack.com/astridx/astridx.github.io/a9d7297a4fe1e3a4d7ebeb1e4e662fd1339ef3b5/maplibreexamples/plugins/maplibre-gl-compare-swipe-between-maps.html)

[Compare swisstopo with demotiles](https://rawcdn.githack.com/astridx/astridx.github.io/a9d7297a4fe1e3a4d7ebeb1e4e662fd1339ef3b5/maplibreexamples/plugins/maplibre-gl-compare-swipe-between-maps_.html)

## Installation

### Native

Add tags referencing `maplibre-gl-compare` after adding `maplibre-gl` to your website:

```html
<!-- MapLibre GL -->
<link href="https://unpkg.com/maplibre-gl@5.15.0/dist/maplibre-gl.css" rel='stylesheet' />
<link href="maplibre-gl-compare.css" rel='stylesheet' />

<script src="https://unpkg.com/maplibre-gl@5.15.0/dist/maplibre-gl.js"></script>
<script src="maplibre-gl-compare.js"></script>
```

### Node 



## Motivation

This project makes it possible to easily compare two maps.

## API Reference

[API Reference](API.md)

## Bug Reports & Feature Requests

Please use the [issue tracker](https://github.com/maplibre/maplibre-gl-compare/issues) to report any bugs or file feature requests.

## Licence
ISC © [MapLibre](https://github.com/maplibre) © [Mapbox](https://github.com/mapbox)
