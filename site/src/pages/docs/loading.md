---
permalink: docs/loading/
title: "Playerx - Loading Attribute"
eleventyNavigation:
  key: Loading
  parent: concepts
  order: 1
tags:
  - docs
layout: layouts/docs.njk
---

# Loading Attribute

The `loading` attribute can be configured to delay the loading of the provided media source. Media players are generally very big in size and <a href="https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading" target="_blank">lazy loading</a> this JS resource is the best strategy to improve page load times. The `loading` attribute can have a value `user` or `lazy`.

## Example with `loading="user"`

As the `user` attribute value implies the loading is done by the user. By manually calling the `load()` method on the playerx instance the resource is loaded. In this example after the user clicks the preview the Vimeo player is loaded.

<div class="md:w-4/5 relative bg-black">
  <player-x loading="user" src="{{ site.defaultPlayerSrc }}" controls muted autoplay playsinline>
    <plx-media></plx-media>
    <div class="plx-preview bg-yellow-300 w-full h-full absolute">
      <button class="plx-playbtn hover:bg-green-500"></button>
    </div>
  </player-x>
</div>

```html
<player-x loading="user" src="{{ site.defaultPlayerSrc }}" controls muted autoplay playsinline>
  <plx-media></plx-media>
  <div class="plx-preview">
    <button class="plx-playbtn"></button>
  </div>
</player-x>
```

## Example with `loading="lazy"`

When the value is `lazy` playerx behaves much like <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading" target="_blank">`<img loading="lazy">`</a>. It defers loading the resource until it reaches a calculated distance from the viewport.

Scroll down to see for it for yourself...

<div class="h-64"></div>

<div class="md:w-4/5 relative">
  <player-x loading="lazy" src="{{ site.defaultPlayerSrc }}" controls></player-x>
</div>

```html
<player-x loading="lazy" src="{{ site.defaultPlayerSrc }}" controls></player-x>
```
