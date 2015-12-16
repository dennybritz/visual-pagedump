A crawling API that generates visual sitemaps of target pages.

#### Output

For each page, the API outputs in a new directory:

- A full screenshot of the page, named `screenshot.png`
- A full dump of all HTML element with visual mappings in a file called `data.json`.

#### Data format

The goal is to generate a visual mapping from DOM nodes to the rendered screen. Each DOM element is serialized as follows:

```json
{
  "id": "265",
  "parentId": "264",
  "size": {
    "width": 121,
    "height": 17
  },
  "location": {
    "x": 871,
    "y": 512
  },
  "html": "<span class=\"_YFi\">Jetzt ansehen</span>"
}
```

Using the above, we can map each element to its position in the screenshot and reconstruct the DOM tree.