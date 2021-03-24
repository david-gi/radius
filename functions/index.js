const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.initializeApp().database();

exports.checkSecurity = functions.https.onCall((data, context) => {
  // check password
  const {id, password} = data;
  return db.ref(`security/${id}`).get().then((res) => {
    return res === null || res.val() === password;
  });
});

exports.gatheringOnUpdate = functions.database
    .ref("/gatherings/{gId}").onUpdate(
        (change, context) => {
          const oldSnap = change.val();
          const snap = change.after;
          const ref = change.after.ref;

          const main = () => {
            // unique user
            const userExists = Object.keys(oldSnap.users)
                .find((u) => snap.val().user === u);

            // enforce attendee size and circle size & depth
            let gatheringSize = 0;
            let circleMaxSize = false;
            let circleMaxDepth = false;
            snap.val().circles.forEach((c) => {
              const recurseCount = (circle, _count = 0, depth = 1) => {
                const count = circle.attendees.numChildren() + _count;
                if (count > 25) {
                  circleMaxSize = true;
                  return;
                }
                if (depth > 3) {
                  circleMaxDepth = true;
                  return;
                }
                gatheringSize += count;

                if (circle.circles) {
                  circle.circles.forEach((cc) => {
                    recurseCount(cc, count, depth + 1);
                  });
                }
              };
              recurseCount(c);
            });

            console.error("gatheringSize > oldSnap.maxSize:" +
              gatheringSize > oldSnap.maxSize);
            console.error("userExists:" + userExists);
            console.error("circleMaxSize" + circleMaxSize);
            console.error("circleMaxDepth" + circleMaxDepth);

            if (gatheringSize > oldSnap.maxSize ||
              userExists ||
              circleMaxSize ||
              circleMaxDepth) {
              return null;
            }

            // sanitize data
            delete snap.name;
            delete snap.user;
            delete snap.description;
            delete snap.maxSize;
            delete snap.password;

            return ref.update(snap);
          };

          if (oldSnap.password) {
            // check password
            const password = snap.val().password;
            db.ref(`security/${snap.key}`).get().then((res) => {
              if (res.val() !== password) return;
              main();
            });
          } else {
            main();
          }
        });
