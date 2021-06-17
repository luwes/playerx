---
permalink: docs/mux/
title: "Playerx - MUX Data"
eleventyNavigation:
  key: <plx-mux>
  parent: Elements
  order: 4
tags:
  - docs
layout: layouts/docs.njk
---

# MUX Data

The `<plx-mux>` element makes it a breeze to start using <a href="https://mux.com/data" target="_blank">MUX Data</a>.<br> One of the best tools available to measure video performance and gain better insight into your viewer's behavior. 

Playerx's uniform video API easily pipes the video data over to MUX no matter which player is running; YouTube, Vimeo, Facebook, Vidyard, HTML5, it doesn't matter.

<div class="md:w-4/5 relative bg-black">
  <player-x src="https://www.youtube.com/watch?v=BK1JIjLPwaA" controls>
    <plx-script loading="player" src="{% getCdnUrl '@playerx/mux' %}"></plx-script>
    <plx-mux debug data-env-key="ilc02s65tkrc2mk69b7q2qdkf" data-video-content-type="clip"></plx-mux>
  </player-x>
</div>

```html
<player-x src="https://www.youtube.com/watch?v=BK1JIjLPwaA" controls>
  <plx-script loading="player" src="{% getCdnUrl '@playerx/mux' %}"></plx-script>
  <plx-mux debug data-env-key="ilc02s65tkrc2mk69b7q2qdkf" data-video-content-type="clip"></plx-mux>
</player-x>
```

## Attributes

Configure the MUX add-on by setting these attributes on `<plx-mux>`.

Attributes | Description
------ | -----------
`data-env-key` (required) | Your Env Key found for each environment on <a href="https://dashboard.mux.com/environments" target="_blank">https://dashboard.mux.com/environments</a>.
`debug` | Controls whether debug log statements are logged to the console.
`data-video-id` | Your internal ID for the video.
`data-video-title` | Title of the video player (e.g.: 'Awesome Show: Pilot')

See the <a href="https://docs.mux.com/guides/data/make-your-data-actionable-with-metadata#optional-configurable-metadata" target="_blank">MUX data docs</a> for all supported configurable metadata. Make sure to prefix the metadata attributes with `data-` and make them kebab case instead of snake case.

## Alternative for metadata

Playerx has a `meta` property that can be populated with metadata that will be read by the MUX add-on. The `meta` property is a plain object and can be set the same way in JS. 

For some video platforms like Vimeo, YouTube, Wistia, etc. the `video_id` and `video_title` will be automatically populated but can be overridden by setting your own.

The `meta` property can also be set in HTML via an attribute.

```html
<player-x meta='{"video_title": "Travis Scott", "video_content_type": "clip"}'></player-x>
```


## Load from the CDN

```html
<plx-script loading="player" src="{% getCdnUrl '@playerx/mux' %}"></plx-script>
```

The `<plx-script loading="player">` element waits until the player is loaded and then loads the MUX element script, beneficial if the player itself is lazy loaded and works great with the [`<player-x loading>`](../loading/) attribute.

## Install via yarn or npm

The `<plx-mux>` element can also be added via a package manager like yarn or npm and then imported in your JS bundle of choice.

```bash
yarn add @playerx/mux
```
