import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface IssueHistory {
  id: string;
  issueTitle: string;
  issueUrl: string;
  prUrl: string;
  prStatus: 'open' | 'merged' | 'closed';
  solvedAt: Date;
}

export const IssueHistory: React.FC = () => {
  const [history, setHistory] = useState<IssueHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!auth.currentUser) return;

      try {
        const historyRef = collection(db, 'issueHistory');
        const q = query(historyRef, where('userId', '==', auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const historyData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          solvedAt: doc.data().solvedAt.toDate()
        })) as IssueHistory[];

        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div>Loading history...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Issue Solving History</h2>
      {history.length === 0 ? (
        <p>No issues solved yet.</p>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold">
                <a href={item.issueUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {item.issueTitle}
                </a>
              </h3>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Solved on: {item.solvedAt.toLocaleDateString()}</p>
                <p>
                  PR Status:{' '}
                  <span className={`font-medium ${
                    item.prStatus === 'merged' ? 'text-green-600 dark:text-green-400' :
                    item.prStatus === 'open' ? 'text-primary' :
                    'text-destructive dark:text-red-400'
                  }`}>
                    {item.prStatus.charAt(0).toUpperCase() + item.prStatus.slice(1)}
                  </span>
                </p>
                {item.prUrl && (
                  <a href={item.prUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    View Pull Request
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 