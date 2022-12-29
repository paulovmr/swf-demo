import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import "react-grid-layout/css/styles.css";
import axios from "axios";
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from '@fortawesome/free-solid-svg-icons'

interface Props {
    baseUrl: string;
}

function Log(props: Props) {
  const logRef = useRef<HTMLTextAreaElement>(null);

  library.add(faRefresh);
  dom.watch();

  const stopPropagation: MouseEventHandler = useCallback(event => {
    event.stopPropagation();
  }, []);

  const refresh = useCallback(() => {
    setLogSize(0);
    logRef.current!.value = "";
  }, []);

  const [logSize, setLogSize] = useState(0);

  useEffect(() => {
    const logPooling = setInterval(() => {
        axios.get(props.baseUrl + "/log/" + logSize).then(res => {
            logRef.current!.value += res.data + '\n';
            logRef.current!.scrollTop = logRef.current!.scrollHeight;
            setLogSize(logSize + 1);
        }).catch(err => {
            console.log("No log updates.");
        });
    }, 300);

    return () => {
        clearInterval(logPooling);
    }
  }, [logSize, logRef, props.baseUrl]);

  useEffect(() => {
      logRef.current!.value = "";
      setLogSize(0);
  }, [props.baseUrl]);

  return (
    <div className={"log"}>
        <i className={"refresh"} onMouseDown={stopPropagation} onClick={refresh}><FontAwesomeIcon icon="refresh" /></i>
        <textarea ref={logRef} onMouseDown={stopPropagation}></textarea>
    </div>
  );
}

export default Log;
