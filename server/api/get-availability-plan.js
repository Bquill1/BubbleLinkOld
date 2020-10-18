const flexIntegrationSdk = require('sharetribe-flex-integration-sdk');
const { getSdk,  handleError, serialize } = require('../api-util/sdk');
const integrationSdk =  flexIntegrationSdk.createInstance({
  clientId: process.env.REACT_APP_INTEGRATION_SDK_CLIENT_ID,
  clientSecret: process.env.REACT_APP_INTEGRATION_SDK_CLIENT_SECRET,
});
module.exports = (req, res) => {
  const listingUUID = req.body;
  
  const listingPromise = integrationSdk.listings.show({ id: listingUUID.uuid });

  listingPromise
    .then(apiResponse => {
      const listing = apiResponse.data.data;
      const availabilityPlan = listing.attributes.availabilityPlan;

      res
        .status(200)
        .set('Content-Type', 'application/transit+json')
        .send(serialize({ data: availabilityPlan }))
        .end();
    })
    .catch(e => {
      handleError(res, e);
    });
};
