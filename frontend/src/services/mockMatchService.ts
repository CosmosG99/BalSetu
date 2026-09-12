import { MissingChildProfile } from '../types';

// High quality synthetic avatar placeholders for prototype demo
export const INITIAL_SYNTHETIC_MISSING_CHILDREN: MissingChildProfile[] = [
  {
    id: 'MC-1028',
    caseRef: 'MC-1028',
    syntheticName: 'Aarav (Synthetic Demo Profile)',
    age: 12,
    gender: 'Male',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    lastKnownLocation: 'Nagpur Junction Station',
    missingSince: '2026-09-08',
    description: 'Wearing blue hoodie, black trousers. Reported missing from central market area.',
    similarityScore: 87
  },
  {
    id: 'MC-0982',
    caseRef: 'MC-0982',
    syntheticName: 'Ananya (Synthetic Demo Profile)',
    age: 13,
    gender: 'Female',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    lastKnownLocation: 'Pune Swargate Bus Terminal',
    missingSince: '2026-09-06',
    description: 'Wearing red sweater, denim jeans. Last seen near departure gate 2.',
    similarityScore: 74
  },
  {
    id: 'MC-1104',
    caseRef: 'MC-1104',
    syntheticName: 'Rohan (Synthetic Demo Profile)',
    age: 10,
    gender: 'Male',
    photoUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=400&q=80',
    lastKnownLocation: 'Mumbai Dadar Central',
    missingSince: '2026-09-10',
    description: 'Wearing yellow t-shirt, dark shorts. Separated during peak hours.',
    similarityScore: 62
  },
  {
    id: 'MC-1055',
    caseRef: 'MC-1055',
    syntheticName: 'Priya (Synthetic Demo Profile)',
    age: 11,
    gender: 'Female',
    photoUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80',
    lastKnownLocation: 'Thane Railway Station',
    missingSince: '2026-09-07',
    description: 'Wearing green dress with white collar.',
    similarityScore: 51
  }
];

export const searchPotentialMatches = async (imageInput?: string): Promise<MissingChildProfile[]> => {
  // Simulate face detection & feature similarity calculation time
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Return synthetic profiles sorted by similarity score
  return INITIAL_SYNTHETIC_MISSING_CHILDREN;
};
