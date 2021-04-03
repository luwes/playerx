---
permalink: docs/controls/
title: "Playerx - Controls"
eleventyNavigation:
  key: <plx-controls>
  parent: Elements
  order: 2
tags:
  - docs
layout: layouts/docs.njk
---

# Controls

The `<plx-controls>` element 

<div class="w-4/5 relative bg-black">
  <player-x loading="user" controls autoplay>
    <plx-media></plx-media>
    <plx-controls>
      <button is="plx-play-button"></button>
      <plx-seek-bar></plx-seek-bar>
    </plx-controls>
  </player-x>
</div>

```html
<player-x loading="user" src="https://vimeo.com/357274789" controls autoplay>
  <plx-media></plx-media>
  <plx-controls>
    <button is="plx-play-button"></button>
    <plx-seek-bar></plx-seek-bar>
  </plx-controls>
</player-x>
```
