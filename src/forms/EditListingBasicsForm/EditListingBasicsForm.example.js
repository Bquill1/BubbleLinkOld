/* eslint-disable no-console */
import EditListingDescriptionForm from './EditListingBasicsForm';

export const Empty = {
  component: EditListingDescriptionForm,
  props: {
    onSubmit: values => {
      console.log('Submit EditListingDescriptionForm with (unformatted) values:', values);
    },
    saveActionMsg: 'Save description',
    updated: false,
    updateInProgress: false,
    disabled: false,
    ready: false,
  },
  group: 'forms',
};
