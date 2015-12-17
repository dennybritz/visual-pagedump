An API to create a visual-semantic mapping between HTML pages and DOM nodes.


### Output and Data Format

For each page we create:

- A screenshot of the page, named `screenshot.png`
- A dump of all HTML element with their coordinates and sizes in a file called `data.json`.

The goal is to generate a visual mapping from DOM nodes to the rendered screen. We can map each element to its position in the screenshot and also reconstruct the DOM tree.

```json
{
  "id": 1805,
  "parentId": 1801  
  "html": "<span class=\"el-weather__footer-temperature\"><span data-temptype=\"celsius\" celsius=\"15\" class=\"js-temp\">15</span>°</span>",
  "location": {
    "right": 303,
    "top": 5907.0166015625,
    "left": 264,
    "bottom": 5945.0166015625
  },
  "size": {
    "width": 39,
    "height": 38
  }
}
```


### Using with Docker

```bash
docker-compose up
```

This will start the API server and a (Firefox) Selenium node.


### API

Here, I'm using `192.168.99.100` as the server IP. Adjust as needed.


#### `POST /api/v1/dumpPage`

Dumps data about a single page.

```bash
curl -X POST http://192.168.99.100:3000/api/v1/dumpPage -H 'Content-Type: application/json' -d '
{
  "url": "https://www.google.com",
  "options": {
    "outputDir": "out/"
  }
}'

```

```json
{
  "screenshotFile": "/usr/src/app/out/19Q6CfkO4Qvp3y/screenshot.png",
  "dataFile": "/usr/src/app/out/19Q6CfkO4Qvp3y/data.json"
}
```


#### `POST /api/v1/crawl`

TODO
