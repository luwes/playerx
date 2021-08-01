---
permalink: docs/schema/
title: "Playerx - Schema element"
eleventyNavigation:
  key: <plx-schema>
  parent: Elements
  order: 3
tags:
  - docs
layout: layouts/docs.njk
---

# Schema Element (SEO)

The `<plx-schema>` element makes a request to an endpoint with oEmbed format and populates the `.data` property with the response. By default it will use the [Playerx oEmbed API](https://github.com/playerxo/oembed) which adds some additional structured data like duration, description and upload date.

By adding the `seo` attribute it will render the [structured data](https://schema.org/VideoObject) for the embedded media in [JSON-LD](https://json-ld.org/) format.

The element can be used independently by defining a `src` attribute or it can be nested in a `<player-x>` element where it will use the current source.

## Nested

Here your Vimeo video has SEO added just by dropping in the schema element with the `seo` attribute.

<div class="md:w-4/5 relative bg-black">
  <player-x src="https://vimeo.com/357274789" controls>
    <plx-schema seo oembedurl="{{ site.oEmbedUrl }}/oembed"></plx-schema>
  </player-x>
</div>

```html
<player-x src="https://vimeo.com/357274789" controls>
  <plx-schema seo></plx-schema>
</player-x>
```

## Independent 

Use the element independently with a regular Vimeo iframe embed to improve search engine optimization for your Vimeo videos.

<div class="md:w-4/5 relative bg-black">
  <div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/357274789" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>
  <plx-schema seo src="https://vimeo.com/357274789" oembedurl="{{ site.oEmbedUrl }}/oembed"></plx-schema>
</div>

```html
<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/357274789" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>
<plx-schema seo src="https://vimeo.com/357274789"></plx-schema>
```

## Initial structured data

It's possible to pre-populate the structured data by manually adding a script element on page load. Using progressive enhancement the `<plx-schema>` element will add any undefined properties it gets from the oEmbed response.

```html
<plx-schema seo src="https://vimeo.com/357274789">
  <script type="application/ld+json">{"musicBy": "Neil Young"}</script>
</plx-schema>
```

## Supported platforms

Most of the major media platforms are supported, see the [Playerx oEmbed API](https://github.com/playerxo/oembed) for more details.

- Vimeo
- YouTube
- Dailymotion
- Wistia
- Vidyard
- Streamable
- Facebook
- JW Player

## Load from the CDN

```html
<plx-script loading="player" src="{% getCdnUrl '@playerx/schema' %}"></plx-script>
```

The `<plx-script loading="player">` element waits until the player is loaded and then loads the Schema element script, beneficial if the player itself is lazy loaded and works great with the [`<player-x loading>`](../loading/) attribute.

## Install via yarn or npm

The `<plx-schema>` element can also be added via a package manager like yarn or npm and then imported in your JS bundle of choice.

```bash
yarn add @playerx/schema
```
