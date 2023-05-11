import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) admin.initializeApp();

const auth = admin.auth();
const db = admin.firestore();
try {
  db.settings({ ignoreUndefinedProperties: true });
} catch (err) {
  console.log(`db init error!`, { err });
}
const { logger } = functions;
const message = admin.messaging();

const batchSize = 100;

export const copyDoc = async (
  collectionFrom: string,
  docId: string,
  collectionTo: string,
  addData: any = {},
  recursive = false
): Promise<boolean> => {
  // document reference
  const docRef = admin.firestore().collection(collectionFrom).doc(docId);

  // copy the document
  const docData = await docRef
    .get()
    .then((doc) => doc.exists && doc.data())
    .catch((error) => {
      console.error(
        "Error reading document",
        `${collectionFrom}/${docId}`,
        JSON.stringify(error)
      );
      throw new functions.https.HttpsError(
        "not-found",
        "Copying document was not read"
      );
    });

  if (docData) {
    // document exists, create the new item
    await admin
      .firestore()
      .collection(collectionTo)
      .doc(docId)
      .set({ ...docData, ...addData })
      .catch((error) => {
        console.error(
          "Error creating document",
          `${collectionTo}/${docId}`,
          JSON.stringify(error)
        );
        throw new functions.https.HttpsError(
          "data-loss",
          "Data was not copied properly to the target collection, please try again."
        );
      });

    // if copying of the subcollections is needed
    if (recursive) {
      // subcollections
      const subcollections = await docRef.listCollections();
      for await (const subcollectionRef of subcollections) {
        const subcollectionPath = `${collectionFrom}/${docId}/${subcollectionRef.id}`;

        // get all the documents in the collection
        return await subcollectionRef
          .get()
          .then(async (snapshot) => {
            const docs = snapshot.docs;
            for await (const doc of docs) {
              await copyDoc(
                subcollectionPath,
                doc.id,
                `${collectionTo}/${docId}/${subcollectionRef.id}`,
                {},
                true
              );
            }
            return true;
          })
          .catch((error) => {
            console.error(
              "Error reading subcollection",
              subcollectionPath,
              JSON.stringify(error)
            );
            throw new functions.https.HttpsError(
              "data-loss",
              "Data was not copied properly to the target collection, please try again."
            );
          });
      }
    }
    return true;
  }
  return false;
};

async function deleteUser(uid: string) {
  // const user = ""; //await getUserByUid(uid);
  // // delete paid user we need to release vNumber first
  // if (user && user.type === "paid" && user.vNumber) {
  //   logger.info(
  //     `Delete paid account with vNumber ${user.vNumber}, releasing vNumber`
  //   );
  //   // removeUserSubscription(user, "deleted");
  // }

  // // await copyDoc('Users', uid, 'DeletedUsers', {}, true)
  // await db.collection("DeletedUsers").add({
  //   ...user,
  //   deletedAt: new Date().getTime(),
  // });
  // delete user from authenticated users, this will trigger the Delete User Data extension to remove all related user data
  return auth
    .deleteUser(uid)
    .then(() => {
      logger.info(`Successfully deleted user ${uid}`);
    })
    .catch((error) => {
      logger.error("Error deleting user:", error);
    });
}

async function deleteCollection(collectionPath: string) {
  console.log(collectionPath);
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(
  database: admin.firestore.Firestore,
  query: admin.firestore.Query,
  resolve: (value?: unknown) => void
) {
  const snapshot = await query.get();

  const bSize = snapshot.size;
  if (bSize === 0) {
    // When there are no documents left, we are done
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = database.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(database, query, resolve);
  });
}

async function fcmSendMessage(
  tokens: string[],
  title: string,
  text: string,
  data: any = null
) {
  const payload = {
    notification: {
      body: text,
      title: ``,
    },
    data,
  };
  if (!data) {
    delete payload.data;
  }

  const res = await message.sendToDevice(
    tokens, // ['token_1', 'token_2', ...]
    payload,
    {
      // Required for background/quit data-only messages on iOS
      contentAvailable: true,
      // Required for background/quit data-only messages on Android
      priority: "high",
    }
  );
  logger.debug(`fcm send message res`, res);
  return res;
}

async function updateTokens(
  tokens: string[],
  results: admin.messaging.MessagingDevicesResponse,
  userId: string
) {
  logger.info(`Updateting user ${userId} tokens`, tokens, results);
  if (results.failureCount > 0) {
    results.results.forEach((result, index) => {
      if (result.error) {
        logger.debug(
          `Failed to update token index ${index}: ${tokens[index]}`,
          result.error
        );
        tokens.splice(index, 1);
      }
    });
    logger.debug(`Setting new tokens to`, tokens);
    await db.collection("Users").doc(userId).set(
      {
        tokens,
      },
      { merge: true }
    );
  }
}

export {
  auth,
  deleteUser,
  functions,
  logger,
  db,
  message,
  fcmSendMessage,
  updateTokens,
  deleteCollection,
  admin,
};

/*
const rest = {
  successCount: 12,
  failureCount: 3,
  canonicalRegistrationTokenCount: 0,
  multicastId: 955052197873664600,
  results: [
    { messageId: '1642701659970999' },
    {
      error: {
        code: 'messaging/registration-token-not-registered',
        message:
          'The provided registration token is not registered. A previously valid registration token can be unregistered for a variety of reasons. See the error documentation for more details. Remove this registration token and stop using it to send messages.'
      }
    },
    { messageId: '0:1642701659973938%0f97f2410f97f241' },
    { messageId: '0:1642701659972204%0f97f2410f97f241' },
    {
      error: {
        message:
          'The provided registration token is not registered. A previously valid registration token can be unregistered for a variety of reasons. See the error documentation for more details. Remove this registration token and stop using it to send messages.',
        code: 'messaging/registration-token-not-registered'
      }
    },
    { messageId: '0:1642701659975577%0f97f2410f97f241' },
    { messageId: '0:1642701659984748%0f97f2410f97f241' },
    { messageId: '0:1642701660070790%0f97f2410f97f241' },
    { messageId: '0:1642701659972414%0f97f2410f97f241' },
    { messageId: '0:1642701659975073%0f97f2410f97f241' },
    { messageId: '0:1642701659972415%0f97f2410f97f241' },
    { messageId: '0:1642701659972413%0f97f2410f97f241' },
    { messageId: '0:1642701659983150%0f97f2410f97f241' },
    {
      error: {
        message:
          'The provided registration token is not registered. A previously valid registration token can be unregistered for a variety of reasons. See the error documentation for more details. Remove this registration token and stop using it to send messages.',
        code: 'messaging/registration-token-not-registered'
      }
    },
    { messageId: '0:1642701659988955%0f97f2410f97f241' }
  ]
}
*/
