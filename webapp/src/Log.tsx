import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import "react-grid-layout/css/styles.css";
import axios from "axios";

interface Props {
    baseUrl: string;
}

function Log(props: Props) {
  const logRef = useRef<HTMLTextAreaElement>(null);

  const stopPropagation: MouseEventHandler = useCallback(event => {
      event.stopPropagation();
  }, []);

  const [logSize, setLogSize] = useState(0);

  useEffect(() => {
    const logPooling = setInterval(() => {
        axios.get(props.baseUrl + "/log/" + logSize).then(res => {
            logRef.current!.value += res.data + '\n';
            setLogSize(logSize + 1);
        }).catch(err => {
            console.log("No log updates.");
        });
    }, 1000);

    return () => {
        clearInterval(logPooling);
    }
  }, [logSize, logRef]);

  return (
    <div className={"log"}>
        <textarea ref={logRef} onMouseDown={stopPropagation}></textarea>
    </div>
  );
}

export default Log;
