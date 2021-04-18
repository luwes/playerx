---
permalink: docs/preview/
title: "Playerx - Preview element"
eleventyNavigation:
  key: <plx-preview>
  parent: Elements
  order: 2
tags:
  - docs
layout: layouts/docs.njk
---

# Preview Element

The `<plx-preview>` element embeds a preview image or video. It's often used with the [`loading=user`](/docs/loading/) set on the `<player-x>` element so when the user clicks the preview the actual media player is loaded.

<div class="md:w-4/5 relative bg-black">
  <player-x loading="user" src="https://vimeo.com/357274789" controls autoplay>
    <plx-media></plx-media>
    <plx-preview src="https://vimeo.com/357274789" oembedurl="{{ site.apiUrl }}/oembed"></plx-preview>
  </player-x>
</div>

```html
<player-x loading="user" src="https://vimeo.com/357274789" controls autoplay>
  <plx-media></plx-media>
  <plx-preview src="https://vimeo.com/357274789"></plx-preview>
</player-x>
```
