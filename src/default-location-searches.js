import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
export default [
  {/* {
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
    },
  },*/}
];
