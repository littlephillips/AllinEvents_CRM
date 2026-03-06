


import { db } from '../firebase';
import {
  collection, addDoc, getDocs, doc,
  updateDoc, deleteDoc, query, orderBy, serverTimestamp,
} from 'firebase/firestore';

export const Col = {
  clients:     'clients',
  bookings:    'bookings',
  events:      'events',
  engagements: 'engagements',
  reviews:     'reviews',
  notes:       'notes',
};

export async function getAll(colName, orderField = 'createdAt') {
  try {
    const q = query(collection(db, colName), orderBy(orderField, 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error(`getAll(${colName}) error:`, e);
    return [];
  }
}

export async function addRecord(colName, data) {
  const docRef = await addDoc(collection(db, colName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id; // return the new document ID, not the full reference
}

export async function updateRecord(colName, id, data) {
  return updateDoc(doc(db, colName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteRecord(colName, id) {
  return deleteDoc(doc(db, colName, id));
}