import { useDispatch, useSelector } from 'react-redux';
import { useSnapshot } from 'valtio';
import { streamValtio } from '../../../store/valtioStore.jsx';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useColorMode } from '../../ui/color-mode.jsx';
import { DialogRoot, DialogBody, DialogContent, DialogBackdrop } from '../../ui/dialog.jsx';
import { onOpenModal, onCloseModal } from '../../../store/features/streamSlice.jsx';

const StreamModalResult = lazy(() => import('./StreamModalResult'));
const StreamModalBody = lazy(() => import('./StreamModalBody'));

export const StreamModal = ({ handleWS, closeConnection }) => {
  const { colorMode } = useColorMode();
  const result = useSnapshot(streamValtio.result);
  const streamSlice = useSelector((state) => state.streamSlice);
  const [isOpenResult, setIsOpenResult] = useState(false);
  const dispatch = useDispatch();

  const isAlive = result.some((u) => u && u.is_alive === 'True');
  const IsDone = result[result.length - 1]?.is_alive;

  useEffect(() => {
    if (IsDone === 'True' || IsDone === 'False') {
      dispatch(onCloseModal());
      setIsOpenResult(true);
    }
  }, [IsDone]);

  return (
    <>
      <DialogRoot lazyMount
                  placement={'center'}
                  size={'lg'}
                  open={streamSlice.isOpenModal}
                  onOpenChange={(e) => {
                    if (e.open) {
                      dispatch(onOpenModal());
                    } else {
                      dispatch(onCloseModal());
                    }
                  }}>
        <DialogBackdrop />
        <DialogContent backgroundColor={colorMode === 'light' ? 'white' : 'gray.700'}>
          <Suspense fallback={'loading...'}>
            <StreamModalBody streamSlice={streamSlice} IsDone={IsDone} />
          </Suspense>
        </DialogContent>
      </DialogRoot>

      <DialogRoot placement={'center'}
                  open={isOpenResult}
                  onOpenChange={(e) => {
                    if (e.open) {
                      setIsOpenResult(true);
                    } else {
                      setIsOpenResult(false);
                    }
                  }}>
        <DialogBackdrop />
        <DialogContent p={2} overflow={'hidden'} backgroundColor={colorMode === 'light' ? 'white' : 'gray.700'}>
          <DialogBody>
            <Suspense fallback={'loading...'}>
              <StreamModalResult streamSlice={streamSlice}
                                 setIsOpenResult={setIsOpenResult}
                                 isAlive={isAlive}
                                 handleWS={handleWS}
                                 closeConnection={closeConnection} />
            </Suspense>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
