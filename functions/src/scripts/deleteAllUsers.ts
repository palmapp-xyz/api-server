import * as admin from "firebase-admin";
import { UserRecord } from "firebase-admin/auth";
import { DocumentData, DocumentReference } from "firebase-admin/firestore";

/* eslint-disable no-console */
import { firestore } from "../";

export const deleteUser = async (uid: string): Promise<void> => {
  admin
    .auth()
    .deleteUser(uid)
    .then(() => {
      console.log("Successfully deleted user", uid);
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
    });
};

export const deleteCollection = async (path: string): Promise<void> => {
  firestore
    .collection(path)
    .listDocuments()
    .then((docs: DocumentReference<DocumentData>[]) => {
      const chunks: DocumentReference<DocumentData>[][] = [];
      for (let i = 0; i < docs.length; i += 500) {
        chunks.push(docs.slice(i, i + 500));
      }

      for (const chunk of chunks) {
        const batch = firestore.batch();
        chunk.forEach((document) => {
          batch.delete(document);
        });
        batch.commit();
      }
    });
};

export const getAllUsers = async (
  count: number,
  nextPageToken?: string | undefined
): Promise<void> => {
  admin
    .auth()
    .listUsers(100, nextPageToken)
    .then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord: UserRecord) => {
        count++;
        deleteUser(userRecord.uid);
      });
      if (listUsersResult.pageToken) {
        getAllUsers(count, listUsersResult.pageToken);
      } else {
        console.log("Deleting all users finished:", count);
        Promise.all([
          deleteCollection("profiles"),
          deleteCollection("userProfiles"),
        ]);
      }
    })
    .catch((error) => {
      console.error("Error listing users:", error);
    });
};
