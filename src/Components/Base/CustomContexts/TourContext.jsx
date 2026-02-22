import { createContext, useContext, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const TourContext = createContext();

export const TourProvider = ({ children }) => {
  const driverRef = useRef(null);
  const currentStepRef = useRef(0);
  const continuationRef = useRef(null); // to store the continue function temporarily

  const startTour = (steps, stepHandlers = {}) => {
    const driverObj = driver({
      onNextClick: () => {
        const index = currentStepRef.current;

        if (stepHandlers[index]) {
          // Save continuation and let handler control when to continue
          continuationRef.current = () => {
            driverObj.moveNext();
            currentStepRef.current++;
          };
          stepHandlers[index](continuationRef.current);
        } else {
          driverObj.moveNext();
          currentStepRef.current++;
        }
      },
      onPrevClick: () => {
        driverObj.movePrevious();
        currentStepRef.current = Math.max(0, currentStepRef.current - 1);
      },
      onCloseClick: () => {
        driverObj.destroy();
        currentStepRef.current = 0;
      },
      steps
    });

    driverRef.current = driverObj;
    currentStepRef.current = 0;
    driverObj.drive();
  };

  return (
    <TourContext.Provider value={{ startTour }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);
