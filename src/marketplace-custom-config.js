/*
 * Marketplace specific configuration.
 *
 * Every filter needs to have following keys:
 * - id:     Unique id of the filter.
 * - label:  The default label of the filter.
 * - type:   String that represents one of the existing filter components:
 *           BookingDateRangeFilter, KeywordFilter, PriceFilter,
 *           SelectSingleFilter, SelectMultipleFilter.
 * - group:  Is this 'primary' or 'secondary' filter?
 *           Primary filters are visible on desktop layout by default.
 *           Secondary filters are behind "More filters" button.
 *           Read more from src/containers/SearchPage/README.md
 * - queryParamNames: Describes parameters to be used with queries
 *                    (e.g. 'price' or 'pub_amenities'). Most of these are
 *                    the same between webapp URLs and API query params.
 *                    You can't change 'dates', 'price', or 'keywords'
 *                    since those filters are fixed to a specific attribute.
 * - config: Extra configuration that the filter component needs.
 *
 * Note 1: Labels could be tied to translation file
 *         by importing FormattedMessage:
 *         <FormattedMessage id="some.translation.key.here" />
 *
 * Note 2: If you need to add new custom filter components,
 *         you need to take those into use in:
 *         src/containers/SearchPage/FilterComponent.js
 *
 * Note 3: If you just want to create more enum filters
 *         (i.e. SelectSingleFilter, SelectMultipleFilter),
 *         you can just add more configurations with those filter types
 *         and tie them with correct extended data key
 *         (i.e. pub_<key> or meta_<key>).
 */

export const filters = [
         {
           id: 'category',
           label: 'Category',
           type: 'SelectMultipleFilter',
           group: 'primary',
           queryParamNames: ['pub_category'],
           config: {
             // "key" is the option you see in Flex Console.
             // "label" is set here for the UI only.
             // Note: label is not added through the translation files
             // to make filter customizations a bit easier.
             options: [
               { key: 'work', label: 'Work' },
               { key: 'event', label: 'Event' },
               { key: 'meeting', label: 'Meeting' },
               { key: 'study', label: 'Study' },
               { key: 'other', label: 'Other' },
             ],
           },
         },
         {
           id: 'dates-length',
           label: 'Dates',
           type: 'BookingDateRangeLengthFilter',
           group: 'primary',
           // Note: BookingDateRangeFilter is fixed filter,
           // you can't change "queryParamNames: ['dates'],"
           queryParamNames: ['dates', 'pub_bookingTypes'],
           config: {
             // A global time zone to use in availability searches. As listings
             // can be in various time zones, we must decide what time zone we
             // use in search when looking for available listings within a
             // certain time interval.
             //
             // If you have all/most listings in a certain time zone, change this
             // config value to that.
             //
             // See: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
             searchTimeZone: 'Etc/UTC',

             // Options for the minimum duration of the booking
             options: [
               { key: null, label: 'Any length' },
               { key: 'hourly', label: 'A couple of hours', shortLabel: 'Hourly' },
               { key: 'daily', label: 'A full day', shortLabel: 'Daily' },
             ],
           },
         },
         {
           id: 'capacity',
           label: 'Guests',
           type: 'SelectNumberFilter',
           group: 'primary',
           // Note: PriceFilter is fixed filter,
           // you can't change "queryParamNames: ['price'],"
           queryParamNames: ['seats', 'pub_capacity'],

           // Price filter configuration
           // Note: unlike most prices this is not handled in subunits
           config: {},
         },
         {
           id: 'spaceRentalAvailability',
           label: 'Amount',
           type: 'SelectMultipleFilter',
           group: 'primary',
           queryParamNames: ['pub_spaceRentalAvailability'],
           config: {
             // "key" is the option you see in Flex Console.
             // "label" is set here for the UI only.
             // Note: label is not added through the translation files
             // to make filter customizations a bit easier.
             options: [
               { key: 'entireSpace', label: 'The entire place' },
               { key: 'individual', label: 'Individual spaces' },
             ],
           },
         },
         //  {
         //    id: 'dates',
         //    label: 'Dates',
         //    type: 'BookingDateRangeFilter',
         //    group: 'primary',
         //    // Note: BookingDateRangeFilter is fixed filter,
         //    // you can't change "queryParamNames: ['dates'],"
         //    queryParamNames: ['dates'],
         //    config: {},
         //  },
         //   // {
         //   //   id: 'price',
         //   //   label: 'Price',
         //   //   type: 'PriceFilter',
         //   //   group: 'primary',
         //   //   // Note: PriceFilter is fixed filter,
         //   //   // you can't change "queryParamNames: ['price'],"
         //   //   queryParamNames: ['price'],
         //   //   // Price filter configuration
         //   //   // Note: unlike most prices this is not handled in subunits
         //   //   config: {
         //   //     min: 0,
         //   //     max: 1000,
         //   //     step: 5,
         //   //   },
         //   // },
         {
           id: 'priceMulti',
           label: 'Price',
           type: 'PriceFilterMulti',
           group: 'primary',
           // Note: PriceFilter is fixed filter,
           // you can't change "queryParamNames: ['price'],"
           queryParamNames: [
             'pub_price_entireSpace_daily',
             'pub_price_entireSpace_hourly',
             'pub_price_individual_daily',
             'pub_price_individual_hourly',
           ],

           // Price filter configuration
           // Note: unlike most prices this is not handled in subunits
           config: {
             searchMode: 'has_any',
             min: 0,
             max: 1000,
             step: 5,
           },
         },

         {
           id: 'keyword',
           label: 'Keyword',
           type: 'KeywordFilter',
           group: 'secondary',
           // Note: KeywordFilter is fixed filter,
           // you can't change "queryParamNames: ['keywords'],"
           queryParamNames: ['keywords'],
           // NOTE: If you are ordering search results by distance
           // the keyword search can't be used at the same time.
           // You can turn on/off ordering by distance from config.js file.
           config: {},
         },

         {
           id: 'spaceType',
           label: 'Privacy',
           type: 'SelectSingleFilter',
           group: 'secondary',
           queryParamNames: ['pub_spaceType'],
           config: {
             // "key" is the option you see in Flex Console.
             // "label" is set here for the UI only.
             // Note: label is not added through the translation files
             // to make filter customizations a bit easier.
             options: [
               { key: 'private', label: 'Private space' },
               { key: 'sharedHost', label: 'May be shared with the host' },
               { key: 'sharedGuest', label: 'May be shared with other guests' },
             ],
           },
         },
         {
           id: 'amenities',
           label: 'Amenities',
           type: 'SelectMultipleFilter',
           group: 'secondary',
           queryParamNames: ['pub_amenities'],
           config: {
             // Optional modes: 'has_all', 'has_any'
             // https://www.sharetribe.com/api-reference/marketplace.html#extended-data-filtering
             searchMode: 'has_any',

             // "key" is the option you see in Flex Console.
             // "label" is set here for this web app's UI only.
             // Note: label is not added through the translation files
             // to make filter customizations a bit easier.
             options: [
               {
                 key: 'wifi',
                 label: 'Wi-Fi',
               },
               {
                 key: 'keyboard',
                 label: 'Keyboard',
               },
               {
                 key: 'office_chair',
                 label: 'Office Chair',
               },
               {
                 key: 'pen_paper',
                 label: 'Pens and Paper',
               },
               {
                 key: 'mouse',
                 label: 'Mouse',
               },
               {
                 key: 'power_outlets',
                 label: 'Power Outlets',
               },
               {
                 key: 'monitor',
                 label: 'Monitor',
               },
               {
                 key: 'projector',
                 label: 'Projector',
               },
               {
                 key: 'whiteboard',
                 label: 'Whiteboard',
               },
               {
                 key: 'printer',
                 label: 'Printer',
               },
               {
                 key: 'scanner',
                 label: 'Scanner',
               },
               {
                 key: 'photocopier',
                 label: 'Photocopier',
               },
               {
                 key: 'microwave',
                 label: 'Microwave',
               },
               {
                 key: 'fridge',
                 label: 'Fridge',
               },
               {
                 key: 'kettle',
                 label: 'Kettle',
               },
               {
                 key: 'tea_coffee',
                 label: 'Tea/Coffee',
               },
               {
                 key: 'oven',
                 label: 'Oven',
               },
               {
                 key: 'cutlery',
                 label: 'Cutlery',
               },
               {
                 key: 'dishes',
                 label: 'Dishes',
               },
               {
                 key: 'coffee_machine',
                 label: 'Coffee Machine',
               },
               {
                 key: 'cleaning_supplies',
                 label: 'Cleaning Supplies',
               },
               {
                 key: 'central_heating',
                 label: 'Central Heating',
               },
               {
                 key: 'air_conditioning',
                 label: 'Air Conditioning',
               },
               {
                 key: 'fan',
                 label: 'Fan',
               },
               {
                 key: 'tv',
                 label: 'TV',
               },
               {
                 key: 'sound_system',
                 label: 'Sound System',
               },
               {
                 key: 'chromecast',
                 label: 'Chromecast',
               },
               {
                 key: 'hdmi_cable',
                 label: 'HDMI Cable',
               },
               {
                 key: 'vga_cable',
                 label: 'VGA cable',
               },
               {
                 key: 'ethernet_cable',
                 label: 'Ethernet Cable',
               },
               {
                 key: 'first_aid',
                 label: 'First Aid Kit',
               },
               {
                 key: 'smoke_alarm',
                 label: 'Smoke Alarm',
               },
               {
                 key: 'carbon_monoxide',
                 label: 'Carbon Monoxide Alarm',
               },
             ],
           },
         },
         {
           id: 'propertyType',
           label: 'Property Type',
           type: 'SelectMultipleFilter',
           group: 'secondary',
           queryParamNames: ['pub_propertyType'],
           config: {
             searchMode: 'has_any',
             // "key" is the option you see in Flex Console.
             // "label" is set here for the UI only.
             // Note: label is not added through the translation files
             // to make filter customizations a bit easier.
             options: [
               { key: 'house', label: 'House' },
               { key: 'apartment', label: 'Apartment' },
               { key: 'business', label: 'Business' },
               { key: 'unique', label: 'Unique' },
               { key: 'other', label: 'Other' },
             ],
           },
         },
       ];

export const sortConfig = {
  // Enable/disable the sorting control in the SearchPage
  active: true,

  // Note: queryParamName 'sort' is fixed,
  // you can't change it since Flex API expects it to be named as 'sort'
  queryParamName: 'sort',

  // Internal key for the relevance option, see notes below.
  relevanceKey: 'relevance',

  // Keyword filter is sorting the results already by relevance.
  // If keyword filter is active, we need to disable sorting.
  conflictingFilters: ['keyword'],

  options: [
    { key: 'createdAt', label: 'Newest' },
    { key: '-createdAt', label: 'Oldest' },
    { key: '-price', label: 'Lowest price' },
    { key: 'price', label: 'Highest price' },

    // The relevance is only used for keyword search, but the
    // parameter isn't sent to the Marketplace API. The key is purely
    // for handling the internal state of the sorting dropdown.
    { key: 'relevance', label: 'Relevance', longLabel: 'Relevance (Keyword search)' },
  ],
};
