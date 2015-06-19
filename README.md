# iflux-mapbox-viewer

> MapBox visualization for several event sources from iFLUX.

## Development setup

Create a `.env` file in the root directory of the project and put the following content:

```bash
VIEWBOX_ACTION_TYPE=http://localhost:3000/schemas/actionTypes/viewMarker
```

### Mandatory

| Name                       | Description                               |
| -------------------------- | ----------------------------------------- |
| VIEWBOX_ACTION_TYPE        | Define the marker action type. Must be unique. |
