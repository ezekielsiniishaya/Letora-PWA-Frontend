// hooks/useApartmentCreation.js
import { useContext } from 'react';
import { ApartmentCreationContext } from '../contexts/ApartmentCreationContext';

export const useApartmentCreation = () => {
  const context = useContext(ApartmentCreationContext);
  if (!context) {
    throw new Error('useApartmentCreation must be used within an ApartmentCreationProvider');
  }
  return context;
};