import React from 'react';
import config from '../../config';
import { twitterPageURL } from '../../util/urlHelpers';
import { StaticPage, TopbarContainer } from '../../containers';
import {
  LayoutSingleColumn,
  LayoutWrapperTopbar,
  LayoutWrapperMain,
  LayoutWrapperFooter,
  Footer,
  ExternalLink,
} from '../../components';

import css from './HostPage.css';
import image from './host-welcome-1.jpg';

const HostPage = () => {
const { siteTwitterHandle, siteFacebookPage } = config;
const siteTwitterPage = twitterPageURL(siteTwitterHandle);

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

        <LayoutWrapperMain className={css.staticPageWrapper}>
          <h1 className={css.pageTitle}>Unleash the potential of your space!</h1>
          <img className={css.coverImage} src={image} alt="My first ice cream." />


         <div className={css.contentWrapper}>
           <div className={css.contentSide}>
            <p>How do I become a Host?</p>
           </div>

           <div className={css.contentMain}>
           <h4>
           Click the "+Become a Host" button above to create your free account. Our easy to use
           listing form will then guide you through the process of adding your first space.
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
                <li>Use the built in chat function to arrange handover of the space with your guest</li>
            </ul>

          </div>
          </div>
          <div className={css.contentWrapper}>
          <div className={css.contentSide}>
           <p>Are there any costs to signing up?</p>
            </div>
            <div className={css.contentMain}>
             <h4>There is no subscription cost when you sign-up to BubbleLink. You only pay a fee once your space has been booked.</h4>
             <h4> Why not sign-up and test out the site to see if it's for you? </h4>
            </div>
            </div>

          <div className={css.contentWrapper}>
          <div className={css.contentSide}>
           <p>What fees do BubbleLink take on each booking?</p>
            </div>
            <div className={css.contentMain}>
             <h4>Once a guest has successfully completed their experience we will deduct 10% from the booking cost to cover
             our expenses incurred in providing the platform and the payment system and pass the remainder on to you.</h4>
            </div>
            </div>

              <div className={css.contentWrapper}>
              <div className={css.contentSide}>
              <p>What type of space can I offer?</p>
              </div>
              <div className={css.contentMain}>
              <h4>The choices are limited only by your imagination! </h4>
              <h4> From renting out an unused home office, to a cozy sitting room, to a large open plan living space suitable for multiple people to work or have meetings,
               to a garden space, home gym or home cinema, to a plain ol' empty room, the choices are endless. </h4>
              <h4>If it's a space you love why not list it and find out if others love it too. </h4>
              </div>
              </div>

              <div className={css.contentWrapper}>
              <div className={css.contentSide}>
              <p>Who will rent my space?</p>
              </div>
              <div className={css.contentMain}>
              <ul>
              <li>Remote workers stuck in unsuitable conditions are looking for inspiring places to work and network</li>
              <li>Professionals like physios and therapists are looking for spaces close to their clients so that they can increase the numbers they see in a day</li>
              <li>Students are looking for quiet spaces to prepare for exams</li>
              <li>Teams are looking for spaces where they can meet outside of the normal stuffy boardroom</li>
              <li>Those planning events are looking for that unique space to make it a day, evening or night to remember</li>
              <li>Fitness instructors such as yoga teachers and personal trainers are looking for spaces where they can hold classes in locations
              that suit their clients</li>
              <li>Interviews, photoshoots,</li>
              </ul>
              </div>
              </div>
        </LayoutWrapperMain>

        <LayoutWrapperFooter>
          <Footer />
        </LayoutWrapperFooter>
      </LayoutSingleColumn>
    </StaticPage>
  );
};

export default HostPage;
