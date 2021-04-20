const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.initializeApp().database();
const {Storage} = require("@google-cloud/storage");
const gcs = new Storage();

exports.checkSecurity = functions.https.onCall((data, context) => {
  try {
    // check password
    const {id, password} = data;
    return db.ref(`security/${id}`).get().then((res) => {
      return res === null || res.val() === password;
    });
  } catch (ex) {
    functions.logger.log("FAILED* "+JSON.stringify(ex));
    return ex;
  }
});

exports.expireGatherings = functions.pubsub
    .schedule("every 120 minutes").onRun((context) => {
      try {
        functions.logger.log("Removing empty gatherings...");
        db.ref("gatherings").once("value", (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            if (!childData.users || childData.users.length < 1) {
              db.ref("gatherings/" + childKey).remove();
              if (childData.password) {
                db.ref("security/" + childKey).remove();
              }
              gcs.bucket(childKey).delete();
            }
          });
        });
        return null;
      } catch (ex) {
        functions.logger.log(ex);
        return null;
      }
    });

exports.gatheringOnDelete = functions.database
    .ref("/gatherings/{gId}").onDelete(
        (change, context) => {
          return false;
        }
    );

exports.gatheringOnUpdate = functions.database
    .ref("/gatherings/{gId}").onUpdate(
        (change, context) => {
          try {
            const oldSnap = change.before.val();
            const snap = change.after;
            const ref = change.after.ref;
            // functions.logger.log("^after", snap);
            // functions.logger.log("^context", context);

            const main = () => {
            // unique user
              const userExists = Object.keys(oldSnap.users || {})
                  .find((u) => snap.val().user === u);

              // enforce attendee size and circle size & depth
              const gatheringSize = oldSnap.users ? oldSnap.users.length : 0;
              let circleMaxSize = false;
              let circleMaxDepth = false;

              const recurseCount = (circle, _count = 0, depth = 1) => {
                // eslint-disable-next-line max-len
                const count = Object.keys(circle.attendees || {}).length + _count;
                if (count > 25) {
                  circleMaxSize = true;
                  return;
                }
                if (depth > 3) {
                  circleMaxDepth = true;
                  return;
                }

                if (circle.circles) {
                  Object.values(circle.circles).forEach((cc) => {
                    recurseCount(cc, count, depth + 1);
                  });
                }
              };

              Object.values(snap.val().circles).forEach((c) => {
                recurseCount(c);
              });

              // console.error("gatheringSize > oldSnap.maxSize:" +
              //   gatheringSize > oldSnap.maxSize);
              // console.error("userExists:" + userExists);
              // console.error("circleMaxSize" + circleMaxSize);
              // console.error("circleMaxDepth" + circleMaxDepth);

              if (gatheringSize > oldSnap.maxSize ||
              userExists ||
              circleMaxSize ||
              circleMaxDepth) {
                return false;
              }

              // sanitize data
              delete snap.val().name;
              delete snap.val().user;
              delete snap.val().description;
              delete snap.val().maxSize;
              delete snap.val().password;

              return ref.update(snap.val());
            };

            if (oldSnap.password) {
              // check password
              const password = snap.val().password;
              db.ref(`security/${snap.key}`).get().then((res) => {
                if (!res || res.val() !== password) return false;
                return main();
              });
            } else {
              return main();
            }
          } catch (ex) {
            functions.logger.log(ex);
            return ex;
          }
        });
