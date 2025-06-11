import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../lib/firebase';

interface IssueTracking {
  userId: string;
  issueId: string;
  issueTitle: string;
  issueUrl: string;
  prUrl?: string;
  prStatus: 'open' | 'merged' | 'closed';
  solvedAt: Date;
}

export const trackIssue = async (issueData: Omit<IssueTracking, 'userId' | 'solvedAt'>) => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to track issues');
  }

  const trackingData: IssueTracking = {
    ...issueData,
    userId: auth.currentUser.uid,
    solvedAt: new Date(),
  };

  try {
    const docRef = await addDoc(collection(db, 'issueHistory'), trackingData);
    return docRef.id;
  } catch (error) {
    console.error('Error tracking issue:', error);
    throw error;
  }
};

export const updatePRStatus = async (trackingId: string, prUrl: string, prStatus: 'open' | 'merged' | 'closed') => {
  try {
    const trackingRef = doc(db, 'issueHistory', trackingId);
    await updateDoc(trackingRef, {
      prUrl,
      prStatus,
    });
  } catch (error) {
    console.error('Error updating PR status:', error);
    throw error;
  }
};

export const getUserIssueHistory = async () => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to fetch issue history');
  }

  try {
    const historyRef = collection(db, 'issueHistory');
    const q = query(historyRef, where('userId', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        issueId: data.issueId,
        issueTitle: data.issueTitle,
        issueUrl: data.issueUrl,
        prUrl: data.prUrl,
        prStatus: data.prStatus,
        solvedAt: data.solvedAt.toDate()
      } as IssueTracking;
    });
  } catch (error) {
    console.error('Error fetching issue history:', error);
    throw error;
  }
}; 