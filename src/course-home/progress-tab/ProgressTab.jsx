import React from 'react';
import { useSelector } from 'react-redux';
import { breakpoints, useWindowSize } from '@edx/paragon';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import CertificateStatus from './certificate-status/CertificateStatus';
import CourseCompletion from './course-completion/CourseCompletion';
import CourseGrade from './grades/course-grade/CourseGrade';
import DetailedGrades from './grades/detailed-grades/DetailedGrades';
import GradeSummary from './grades/grade-summary/GradeSummary';
import ProgressHeader from './ProgressHeader';
import RelatedLinks from './related-links/RelatedLinks';

import { useModel } from '../../generic/model-store';

const ProgressTab = () => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const { certificateData } = useModel('progress', courseId);
  const user = getAuthenticatedUser();

  const {
    gradesFeatureIsFullyLocked,
  } = useModel('progress', courseId);

  const applyLockedOverlay = gradesFeatureIsFullyLocked ? 'locked-overlay' : '';

  let enablecert = true;
  if (
    String(courseId).includes('Physics') &&
    !String(courseId).includes('Eur') &&
    (String(user.email).includes('physics.uoc.gr') ||
      String(user.email).includes('materials.uoc.gr') ||
      String(user.email).includes('tem.uoc.gr'))
  ) {
    enablecert = false;
  }
  // console.log('ENABLE CERT 1: ' + enablecert);

  let NoCertData = true;
  let showprogress = true;

  if (certificateData) {
    // console.log(
    //   '~~~~~~CERT DATA:>' + JSON.stringify(certificateData) + '<~~~~~~'
    // );
    if (certificateData.certWebViewUrl) {
      NoCertData = false;
      showprogress = true;
    } else {
      NoCertData = true;
      // console.log('NO CERT DATA');
      showprogress = false;
    }

    if (
      certificateData.certStatus === 'audit_passing' ||
      certificateData.certStatus === 'honor_passing'
    ) {
      enablecert = false;
    }
  }
  // DAGG ADDITIONS END 1 //

  const windowWidth = useWindowSize().width;
  if (windowWidth === undefined) {
    // Bail because we don't want to load <CertificateStatus/> twice, emitting 'visited' events both times.
    // This is a hacky solution, since the user can resize the screen and still get two visited events.
    // But I'm leaving a larger refactor as an exercise to a future reader.
    return null;
  }

  const divPayStyles = {
    boxShadow: '0 0.0625rem 0.125rem rgba(0, 0, 0, 0.2)',
    margin: '4em',
    padding: '1em',
    borderRadius: '0.375rem',
  };

  const divPayButtonStyles = {
    display: 'block',
    border: '1px solid #d2c9c9',
    borderRadius: '3px',
    boxShadow: 'inset 0 1px 0 0 #fff',
    color: '#333',
    fontWeight: 'bold',
    marginTop: '2em',
    padding: '.6em',
    backgroundColor: '#f1f1f1',
    cursor: 'pointer',
    textAlign: 'center',
  };

  const wideScreen = windowWidth >= breakpoints.large.minWidth;
  return (
    <>
      <ProgressHeader />
      <div className="row w-100 m-0">
        {/* Main body */}
        <div className="col-12 col-md-8 p-0">
          <CourseCompletion />

          {showprogress ? (
            <div>
              {!wideScreen && <CertificateStatus />}
              <CourseGrade />
              <div
                className={`grades my-4 p-4 rounded raised-card ${applyLockedOverlay}`}
                aria-hidden={gradesFeatureIsFullyLocked}
              >
                <GradeSummary />
                <DetailedGrades />
              </div>
            </div>
          ) : (
            <div>
              <div className="msg-content" style={divPayStyles}>
                <h4 className="hd hd-4 title">
                  Συγχαρητήρια, πληροίτε τις προϋποθέσεις για τη λήψη βεβαίωσης
                  επιτυχούς παρακολούθησης!
                </h4>
                <p className="copy">
                  Το σύστημα πληρωμών για την έκδοση βεβαιώσεων έχει
                  ενεργοποιηθεί.
                  <br />
                  Oι τρόποι πληρωμής που προβλέπονται είναι μέσω:
                </p>
                <ol
                  className="copy"
                  style={{ textAlign: 'left', marginTop: '0px' }}
                >
                  <li> χρεωστικής/πιστωτικής κάρτας</li>
                  <li> Paypal</li>
                  <li> τραπεζικής κατάθεσης</li>
                  <li> αντικαταβολής (με επιπλέον κόστος 3 ευρώ) και</li>
                  <li> πληρωμής σε κατάστημα.
                    <br />
                    Παρακαλούμε σημειώστε, ότι η έκδοση βεβαίωσης στα
                    καταστήματα των Πανεπιστημιακών Εκδόσεων Κρήτης σε Αθήνα και
                    Ηράκλειο γίνεται σύμφωνα με τα μέτρα προστασίας κατά του
                    COVID-19, που ισχύουν για το λιανεμπόριο.
                    <br />
                    Κατά την επίσκεψή σας παρακαλούμε τηρήστε όλα τα απαραίτητα
                    μέτρα προστασίας. Σας ευχαριστούμε!
                  </li>
                </ol>
                <p className="copy">
                  Η βεβαίωσή σας θα εκδοθεί εντός 2 εργάσιμων ημερών στην
                  περίπτωση που η πληρωμή σας γίνει μέσω Paypal, με χρήση
                  χρεωστικής/πιστωτικής κάρτας ή με πληρωμή σε κατάστημα. Στην
                  περίπτωση κατάθεσης σε τράπεζα θα χρειαστούν έως 5 εργάσιμες
                  ημέρες για την επιβεβαίωση της πληρωμής σας, ενώ με την μέθοδο
                  της αντικαταβολής μπορεί να χρειαστούν μέχρι και 40 ημέρες από
                  την ημέρα καταχώρησης του αιτήματός σας έως και την ανάρτηση
                  της ηλεκτρονικής σας βεβαίωσης. Μόλις η βεβαίωσή σας εκδοθεί,
                  θα ειδοποιηθείτε μέσω email για την ανάρτησή της.
                </p>

                <p className="copy">
                  Η βεβαίωση επιτυχούς παρακολούθησης εκδίδεται <b>ΔΩΡΕΑΝ</b>{' '}
                  για ανέργους εγγεγραμμένους στον ΟΑΕΔ.
                </p>
                <br />
                <h3 lasscName="hd hd-4 title">
                  Για να ενεργοποιηθεί η σελίδα της προόδου σας θα πρέπει να
                  προχωρήσετε σε έκδοση βεβαίωσης. Η σελίδα θα ενεργοποιηθεί
                  ταυτόχρονα με την ανάρτηση της βεβαίωσής σας.
                </h3>

                <form
                  action="https://pay.mathesis.org/el/payments/pay/"
                  method="POST"
                >
                  <input type="hidden" name="uname" value={user.username} />
                  <input type="hidden" name="email" value={user.email} />
                  <input type="hidden" name="uid" value={user.userId} />
                  <input type="hidden" name="cid" value={courseId} />
                  <input
                    type="submit"
                    value="Έκδοση Βεβαίωσης"
                    style={divPayButtonStyles}
                  />
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Side panel */}
        {showprogress ? (
          <div className="col-12 col-md-4 p-0 px-md-4">
            {wideScreen && <CertificateStatus />}
            <RelatedLinks />
          </div>
        ) : (
          <div className="col-12 col-md-4 p-0 px-md-4">
            <RelatedLinks />
          </div>
        )}
      </div>
    </>
  );
};

export default ProgressTab;
