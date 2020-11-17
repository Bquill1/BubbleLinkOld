import React from 'react';
import { formatMoney } from '../../util/currency';
import { FormattedMessage, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import css from './BookingBreakdown.css';


const LineItemBasePriceMaybe = props => {
  const { transaction, unitType, intl, isEntireSpace, isDaily, seatsSelected } = props;
  const translationKey =
    isDaily && isEntireSpace
      ? 'BookingBreakdown.dailyEntireSpace'
      : !isDaily && isEntireSpace
      ? 'BookingBreakdown.hourlyEntireSpace'
      : isDaily && !isEntireSpace
      ? 'BookingBreakdown.dailyIndividual'
      : 'BookingBreakdown.hourlyIndividual';

  // Find correct line-item for given unitType prop.
  // It should be one of the following: 'line-item/night, 'line-item/day', 'line-item/units', or 'line-item/time'
  // These are defined in '../../util/types';
  const unitPurchase = transaction.attributes.lineItems.find(
    item => item.code === unitType && !item.reversal
  );
  const quantity = isEntireSpace
    ? unitPurchase.quantity.toString()
    : (unitPurchase.quantity / seatsSelected || 1).toString();
  const unitPrice = unitPurchase ? formatMoney(intl, unitPurchase.unitPrice) : null;
  const total = unitPurchase ? formatMoney(intl, unitPurchase.lineTotal) : null;

  return quantity && total ? (
    <div className={css.lineItem}>
      <span className={css.itemLabel}>
        {isEntireSpace ? (

          <FormattedMessage
          id={translationKey}
          values={{ unitPrice, quantity, seats: seatsSelected }}
          />
          ): (
          <FormattedMessage
          id={translationKey}
          values={{ unitPrice, quantity, seats: seatsSelected }}
          />  
          ) }
      </span>
      <span className={css.itemValue}>{total}</span>
    </div>
  ) : null;
};

LineItemBasePriceMaybe.propTypes = {
  transaction: propTypes.transaction.isRequired,
  unitType: propTypes.bookingUnitType.isRequired,
  intl: intlShape.isRequired,
};

export default LineItemBasePriceMaybe;
