import { useEffect, useRef } from 'react';
import { streamValtio } from '../../../store/valtioStore.jsx';
import { streamAddress } from '../axios/FetchAxios.jsx';
import { onOpenModal, setElapseTime, setIP, setPath, setPort } from '../../../store/features/streamSlice.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { useSnapshot } from 'valtio';

export const useCheckConnection = () => {
  const streamSlice = useSelector(state => state.streamSlice);
  const socketRef = useRef(null);
  const result = useSnapshot(streamValtio.result);
  const dispatch = useDispatch();

  const closeConnection = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  useEffect(() => {
    return () => {
      closeConnection();
    };
  }, []);

  useEffect(() => {
    if (!streamSlice.isOpenModal) {
      closeConnection();
    }
  }, [streamSlice.isOpenModal]);

  const handleWS = ({ ip, port, path }) => {
    dispatch(setIP(ip));
    dispatch(setPort(port));
    dispatch(setPath(path));

    const startTime = Date.now();

    streamValtio.result = Array(result.length).fill(null);
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

    // socketRef.current = new WebSocket(`ws://192.168.17.24:8000/ws/${ip}/${port}?path=${path}`);
    socketRef.current = new WebSocket(`${protocol}://${window.location.host}/${streamAddress}/ws/${ip}/${port}?path=${path}`);

    socketRef.current.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);

      if (data.index - 1 >= result.length) {
        if (socketRef.current) {
          socketRef.current.close();
        }
      } else {
        streamValtio.result[data.index % result.length] = data;
      }
    });

    socketRef.current.addEventListener('close', () => {
      const endTime = Date.now();
      dispatch(setElapseTime(endTime - startTime));
    });

    setTimeout(() => {
      dispatch(onOpenModal());
    }, 250);
  };

  return { handleWS, closeConnection };
};
