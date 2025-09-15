// Real photo URLs from free stock photo services
// These are actual property and room photos from Unsplash

export const realPropertyPhotos = {
  // Modern apartment photos
  modernApartment: [
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
  ],

  // Student house photos
  studentHouse: [
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1565623833408-d77e39b88af6?w=800&h=600&fit=crop'
  ],

  // Luxury penthouse photos
  luxuryPenthouse: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop'
  ],

  // Shared house Roma Norte
  sharedHouse: [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556909045-f208e5d80bf8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1565623833408-d77e39b88af6?w=800&h=600&fit=crop'
  ],

  // Executive apartment
  executiveApartment: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
  ],

  // Coliving space
  colivingSpace: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556909045-f208e5d80bf8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop'
  ],

  // Amenity photos
  amenities: {
    gym: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    pool: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    rooftop: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    coworking: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    garden: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop'
  },

  // Neighborhood photos (Mexico City)
  neighborhoods: {
    polanco: 'https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=800&h=600&fit=crop',
    romaNorte: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=600&fit=crop',
    condesa: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&h=600&fit=crop',
    santaFe: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
  }
};

// Helper function to get photos for a property
export const getPropertyPhotos = (propertyId: string) => {
  const photoMap: { [key: string]: any[] } = {
    'prop_001': realPropertyPhotos.modernApartment.map((url, index) => ({
      url,
      caption: ['Modern Living Room', 'Fully Equipped Kitchen', 'Master Bedroom', 'Shared Bathroom', 'Building Gym', 'Rooftop Terrace'][index] || `Photo ${index + 1}`,
      isPrimary: index === 0,
      order: index + 1,
      type: index < 4 ? 'property' : 'amenity'
    })),
    
    'prop_002': realPropertyPhotos.studentHouse.map((url, index) => ({
      url,
      caption: ['Front View', 'Common Area', 'Kitchen', 'Study Room'][index] || `Photo ${index + 1}`,
      isPrimary: index === 0,
      order: index + 1,
      type: 'property'
    })),
    
    'prop_003': realPropertyPhotos.luxuryPenthouse.map((url, index) => ({
      url,
      caption: ['Living Room View', 'Terrace', 'Master Suite', 'Kitchen', 'City View'][index] || `Photo ${index + 1}`,
      isPrimary: index === 0,
      order: index + 1,
      type: index === 1 ? 'amenity' : 'property'
    })),
    
    'prop_004': realPropertyPhotos.sharedHouse.map((url, index) => ({
      url,
      caption: ['Common Area', 'Kitchen', 'Bedroom'][index] || `Photo ${index + 1}`,
      isPrimary: index === 0,
      order: index + 1,
      type: 'property'
    })),
    
    'prop_005': realPropertyPhotos.executiveApartment.map((url, index) => ({
      url,
      caption: ['Living Area', 'Bedroom', 'Office Space'][index] || `Photo ${index + 1}`,
      isPrimary: index === 0,
      order: index + 1,
      type: 'property'
    })),
    
    'prop_006': realPropertyPhotos.colivingSpace.map((url, index) => ({
      url,
      caption: ['Coworking Space', 'Common Kitchen', 'Private Room', 'Garden'][index] || `Photo ${index + 1}`,
      isPrimary: index === 0,
      order: index + 1,
      type: index === 0 ? 'amenity' : 'property'
    }))
  };
  
  return photoMap[propertyId] || [];
};

// Roommate profile photos
export const roommatePhotos = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face'
]; 