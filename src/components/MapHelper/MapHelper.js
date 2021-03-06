import classNames from 'classnames';
import { string } from 'prop-types';
import React, { Component } from 'react';
import { Map } from '../../components';
import { FormattedMessage } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import css from './MapHelper.css';


class MapHelper extends Component {
  constructor(props) {
    super(props);
    this.state = { isStatic: true };
  }

  render() {
    const { className, rootClassName, mapClassName, address, geolocation } = this.props;
    console.log(this.props);
    if (!geolocation) {
      return null;
    }
    const showTitle = false;
    const classes = classNames(rootClassName || css.sectionMap, className);

    const mapProps = { address, center: geolocation, mapClassName };
    const map = <Map accurateMap {...mapProps} useStaticMap={this.state.isStatic} />;

    return (
      <div className={classes}>
        {showTitle && (
          <h2 className={css.locationTitle}>
            <FormattedMessage id="ListingPage.locationTitle" />
          </h2>
        )}
          {this.state.isStatic ? (
            <button
              className={css.map}
              onClick={() => {
                // this.setState({ isStatic: true });
              }}
            >
              {map}
            </button>
          ) : (
            <div className={css.map}>{map}</div>
          )}
      </div>
    );
  }
}

MapHelper.defaultProps = {
  rootClassName: null,
  className: null,
  geolocation: null,
  listingId: null,
};

MapHelper.propTypes = {
  rootClassName: string,
  className: string,
  geolocation: propTypes.latlng,
  listingId: propTypes.uuid,
};

export default MapHelper;
