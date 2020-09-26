import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
export default [
  {
<<<<<<< HEAD
    id: 'default-dublin',
    predictionPlace: {
      address: 'Dublin, Ireland',
      bounds: new LatLngBounds(new LatLng(53.41166, -6.112993), new LatLng(53.298881, -6.386999)),
    },
  },
  {
    id: 'default-cork',
    predictionPlace: {
      address: 'Cork, Ireland',
      bounds: new LatLngBounds(new LatLng(51.937444, -8.389492), new LatLng(51.866048, -8.584363)),
    },
  },
  {
    id: 'default-galway',
    predictionPlace: {
      address: 'Galway, Ireland',
      bounds: new LatLngBounds(new LatLng(53.319252, -8.954801), new LatLng(53.248361, -9.132927)),
    },
  },
  {
    id: 'default-limerick',
    predictionPlace: {
      address: 'Limerick, Ireland',
      bounds: new LatLngBounds(new LatLng(52.689981, -8.573346), new LatLng(52.61291, -8.726285)),
    },
  },
  {
    id: 'default-waterford',
    predictionPlace: {
      address: 'Waterford, Ireland',
      bounds: new LatLngBounds(new LatLng(52.279827, -7.03399), new LatLng(52.210183, -7.187132)),
=======
    id: 'default-new-york',
    predictionPlace: {
      address: 'New York City, New York, USA',
      bounds: new LatLngBounds(
        new LatLng(40.917576401307, -73.7008392055224),
        new LatLng(40.477399, -74.2590879797556)
      ),
    },
  },
  {
    id: 'default-los-angeles',
    predictionPlace: {
      address: 'Los Angeles, California, USA',
      bounds: new LatLngBounds(
        new LatLng(34.161440999758, -118.121305008073),
        new LatLng(33.9018913203336, -118.521456965901)
      ),
    },
  },
  {
    id: 'default-san-francisco',
    predictionPlace: {
      address: 'San Francisco, California, USA',
      bounds: new LatLngBounds(
        new LatLng(37.8324430069081, -122.354995082683),
        new LatLng(37.6044780500533, -122.517910874663)
      ),
    },
  },
  {
    id: 'default-seattle',
    predictionPlace: {
      address: 'Seattle, Washington, USA',
      bounds: new LatLngBounds(
        new LatLng(47.7779392908564, -122.216605992108),
        new LatLng(47.3403950185547, -122.441233019046)
      ),
    },
  },
  {
    id: 'default-portland',
    predictionPlace: {
      address: 'Portland, Oregon, USA',
      bounds: new LatLngBounds(
        new LatLng(45.858099013046, -122.441059986416),
        new LatLng(45.3794799927623, -122.929215816001)
      ),
>>>>>>> upstream/master
    },
  },
];
