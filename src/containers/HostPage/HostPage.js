import React from 'react';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl, intlShape } from '../../util/reactIntl';
import { isScrollingDisabled } from '../../ducks/UI.duck';
import config from '../../config';
import { twitterPageURL } from '../../util/urlHelpers';
import { StaticPage, TopbarContainer } from '../../containers';
import { updateProfile } from '../../containers/ProfileSettingsPage/ProfileSettingsPage.duck';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  ExternalLink,
  SectionHostHero,
} from '../../components';
import MultiColumnSection from './MultiColumnSection';
import TextAndImageSection from './TextAndImageSection';

import css from './HostPage.css';
import hostInfoPic1 from './HostInfoPic1.jpg';
import hostInfoPic2 from './HostInfoPic2.jpg';

const HostPageComponent = props => {
  const {
    history,
    location,
    isAuthenticated,
    currentUser,
    currentUserIsHost,
    currentUserHasListings,
    becomeHost,
  } = props;
  console.log(props);
const isHost = isAuthenticated && currentUser?.attribute?.profile?.publicData?.isHost
  // prettier-ignore
  return (
    <StaticPage
      title="About Hosting"
      schema={{
        '@context': 'http://schema.org',
        '@type': 'HostPage',
        description: 'About Hosting',
        name: 'About Hosting',
      }}
    >
      <LayoutSingleColumn>
        <LayoutWrapperTopbar>
          <TopbarContainer />
        </LayoutWrapperTopbar>

        <LayoutWrapperMain className={css.s}>
          <div className={css.heroContainer}>

          <SectionHostHero
            className={css.hero}
            history={history}
            location={location}
            isAuthenticated={isAuthenticated}
            currentUser={currentUser}
            isHost={currentUserIsHost}
            currentUserHasListings={currentUserHasListings}
            becomeHost={becomeHost}
          />
          </div>
          <div className={css.staticPageWrapper}>
            <MultiColumnSection
              showGraphics={true}
              title={'How Do I Become a Host?'}
              content={[
                {
                  title: '1. Sign Up For Free',
                  content: `Click the "+Become a Host" button above to create your free account.`,
                },
                {
                  title: '2. Create Your Listing',
                  content: `Our easy to use listing form will then guide you through the process of adding your first space.`,
                },
                {
                  title: '3. Start Renting!',
                  content: `The BubbleLink users can then search for properties like yours, book them, and the money goes straight to you!`,
                },
              ]}
            />
            <TextAndImageSection
              title={'What are the benefits of becoming a host?'}
              subtitle={null}
              content={
                <ul className={css.heroList}>
                  <li> Unlock the earning potential in your space</li>
                  <li>Easily manage your profile and listings from your personal account</li>
                  <li>Adjust the availability of your space to suit your schedule</li>
                  <li>Set your own prices</li>
                  <li>Choose whether to offer your space for daily or hourly bookings</li>
                  <li>
                    Use the built in chat function to arrange handover of the space with your guest
                  </li>
                </ul>
              }
              image={hostInfoPic1}
              smallImage
            />
            <MultiColumnSection
              showGraphics={false}
              title={'Are there any costs to signing up?'}
              content={[
                {
                  title: 'Answer: No!',
                  content: `There is no subscription cost when you sign-up to BubbleLink. You only pay a fee once your space has been booked.
Why not sign-up and test out the site to see if it's for you?`,
                },
              ]}
            />
            <MultiColumnSection
              showGraphics={false}
              title={'Well then, what fees do BubbleLink take on each booking?'}
              content={[
                {
                  content: `We strive to be as transparent as possible, so we let you know, right up front about our 10% fee. It's used to help BubbleLink grow so that we can continue helping connect people with unique spaces.`,
                },
                {
                  content: `Once a guest has successfully completed their experience we will deduct the commision from the booking cost to cover our expenses and pass the remainder on to you.`,
                },
              ]}
            />
            <TextAndImageSection
              title={'What type of space can I offer?'}
              subtitle={'The only limit is your creativity!'}
              content={
                <>
                  <p>
                    From renting out an unused home office, to a cozy sitting room, to a large open
                    plan living space suitable for multiple people to work or have meetings, to a
                    garden space, home gym or home cinema, to a plain ol' empty room, the choices
                    are endless.
                  </p>
                  <br />
                  <p>
                    {' '}
                    If it's a space you love why not list it and find out if others love it too.
                  </p>
                </>
              }
              image={hostInfoPic2}
              imageLeft
            />
            <MultiColumnSection
              showGraphics={false}
              title={'Who will rent be renting my space?'}
              subtitle={'Your renters could be anyone!'}
              content={[
                {
                  content: (
                    <ul className={css.heroList}>
                      <li>
                        Remote workers stuck in unsuitable conditions are looking for inspiring
                        places to work and network
                      </li>
                      <li>
                        Professionals like physios and therapists are looking for spaces close to
                        their clients so that they can increase the numbers they see in a day
                      </li>
                      <li>Students are looking for quiet spaces to prepare for exams</li>
                      <li>
                        Teams are looking for spaces where they can meet outside of the normal
                        stuffy boardroom
                      </li>
                      <li>
                        Those planning events are looking for that unique space to make it a day,
                        evening or night to remember
                      </li>
                      <li>
                        Fitness instructors such as yoga teachers and personal trainers are looking
                        for spaces where they can hold classes in locations that suit their clients
                      </li>
                      <li>Interviews, photoshoots, and anything else you can think of!</li>
                    </ul>
                  ),
                },
              ]}
            />
            {/* <div className={css.contentWrapper}>
              <div className={css.contentSide}>
                <p>How do I become a Host?</p>
              </div>

              <div className={css.contentMain}>
                <h4>
                  Click the "+Become a Host" button above to create your free account. Our easy to
                  use listing form will then guide you through the process of adding your first
                  space.
                </h4>
              </div>
            </div>

            <div className={css.contentWrapper}>
              <div className={css.contentSide}>
                <p>What are the benefits to becoming a Host?</p>
              </div>
              <div className={css.contentMain}>
                <ul>
                  <li> Unlock the earning potential in your space</li>
                  <li>Easily manage your profile and listings from your personal account</li>
                  <li>Adjust the availability of your space to suit your schedule</li>
                  <li>Set your own prices</li>
                  <li>Choose whether to offer your space for daily or hourly bookings</li>
                  <li>
                    Use the built in chat function to arrange handover of the space with your guest
                  </li>
                </ul>
              </div>
            </div>
            <div className={css.contentWrapper}>
              <div className={css.contentSide}>
                <p>Are there any costs to signing up?</p>
              </div>
              <div className={css.contentMain}>
                <h4>
                  There is no subscription cost when you sign-up to BubbleLink. You only pay a fee
                  once your space has been booked.
                </h4>
                <h4> Why not sign-up and test out the site to see if it's for you? </h4>
              </div>
            </div>

            <div className={css.contentWrapper}>
              <div className={css.contentSide}>
                <p>What fees do BubbleLink take on each booking?</p>
              </div>
              <div className={css.contentMain}>
                <h4>
                  Once a guest has successfully completed their experience we will deduct 10% from
                  the booking cost to cover our expenses incurred in providing the platform and the
                  payment system and pass the remainder on to you.
                </h4>
              </div>
            </div>

            <div className={css.contentWrapper}>
              <div className={css.contentSide}>
                <p>What type of space can I offer?</p>
              </div>
              <div className={css.contentMain}>
                <h4>The choices are limited only by your imagination! </h4>
                <h4>
                  {' '}
                  From renting out an unused home office, to a cozy sitting room, to a large open
                  plan living space suitable for multiple people to work or have meetings, to a
                  garden space, home gym or home cinema, to a plain ol' empty room, the choices are
                  endless.{' '}
                </h4>
                <h4>
                  If it's a space you love why not list it and find out if others love it too.{' '}
                </h4>
              </div>
            </div>

            <div className={css.contentWrapper}>
              <div className={css.contentSide}>
                <p>Who will rent my space?</p>
              </div>
              <div className={css.contentMain}>
                <ul>
                  <li>
                    Remote workers stuck in unsuitable conditions are looking for inspiring places
                    to work and network
                  </li>
                  <li>
                    Professionals like physios and therapists are looking for spaces close to their
                    clients so that they can increase the numbers they see in a day
                  </li>
                  <li>Students are looking for quiet spaces to prepare for exams</li>
                  <li>
                    Teams are looking for spaces where they can meet outside of the normal stuffy
                    boardroom
                  </li>
                  <li>
                    Those planning events are looking for that unique space to make it a day,
                    evening or night to remember
                  </li>
                  <li>
                    Fitness instructors such as yoga teachers and personal trainers are looking for
                    spaces where they can hold classes in locations that suit their clients
                  </li>
                  <li>Interviews, photoshoots,</li>
                </ul>
              </div>
            </div> */}
          </div>
        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </StaticPage>
  );
};

const mapDispatchToProps = dispatch => ({
  becomeHost: data => dispatch(updateProfile(data)),
});
const mapStateToProps = state => {
  const { currentUser, currentUserHasListings, currentUserIsHost } = state.user;
  console.log(state.user)
  const {isAuthenticated} = state.Auth
  return {
    scrollingDisabled: isScrollingDisabled(state),
    currentUser,
    currentUserIsHost,
    currentUserHasListings,
    isAuthenticated,
  };
};

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671

const HostPage = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(HostPageComponent);

export default HostPage;
