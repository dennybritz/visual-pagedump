A crawling API that generates visual sitemaps of target pages. It saves page screenshots and mappings from DOM nodes to bounding boxes in the screenshot.

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

#### Using with Docker

```bash
docker-compose up
```

This will start the API server and a (Firefox) Selenium node.

#### API

Here, I'm using `192.168.99.100` as the server IP. Adjust as needed.

```bash
curl -X POST http://192.168.99.100:3000/api/v1/dumpPage -H 'Content-Type: application/json' -d '
{
  "url": "https://www.google.com",
  "options": {
    "outputDir": "out/"
  }
}'

```