import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import "react-grid-layout/css/styles.css";
import axios from "axios";
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons'

interface Props {
    labelsByUrl: Map<string, string>;
}

function Log(props: Props) {
  const [logSize, setLogSize] = useState(new Map(Array.from(props.labelsByUrl.values()).map(label => [label, 0])));

  const logRef = useRef<HTMLTextAreaElement>(null);

  library.add(faRefresh, faTrash);
  dom.watch();

  const stopPropagation: MouseEventHandler = useCallback(event => {
    event.stopPropagation();
  }, []);

  const refresh = useCallback(() => {
      logRef.current!.value = "";
      setLogSize(new Map(Array.from(props.labelsByUrl.values()).map(label => [label, 0])));
  }, []);

  const removeFirstLine = useCallback(() => {
      let remainingLines = logRef.current!.value.split("\n");
      remainingLines.shift();
      logRef.current!.value = remainingLines.join("\n");
  }, []);

  const removeAllLines = useCallback(() => {
      logRef.current!.value = "";
  }, []);

  useEffect(() => {
    const logPooling = setInterval(() => {
        const requests = Array.from(props.labelsByUrl.keys()).map((path) =>
            axios.get(path + "/log/" + logSize.get(props.labelsByUrl.get(path)!))
        );

        Promise.allSettled(requests).then((responses) => {
            const newLogSize = new Map(logSize);
            let newFullLog: string[] = [];
            responses.forEach((res) => {
                if (res.status === "fulfilled") {
                    const entry = Array.from(props.labelsByUrl.entries()).filter(v => res.value.config.url?.startsWith(v[0]))[0]
                    const labelledLog = props.labelsByUrl.size > 1 ? (""+res.value.data).replaceAll("] ", "] | " + entry[1].padEnd(14) + " | ") : (""+res.value.data);
                    const newLog = labelledLog.split("\n").filter(l => l !== "");
                    newLogSize.set(entry[1], logSize.get(entry[1])! + newLog.length);
                    newFullLog.push(...newLog);
                }
            });
            newFullLog.sort();
            logRef.current!.value += newFullLog.join("\n");
            logRef.current!.scrollTop = logRef.current!.scrollHeight;
            setLogSize(newLogSize);
        }).catch(err => console.log("error"));
    }, 1000);

    return () => {
        clearInterval(logPooling);
    }
  }, [logSize, logRef, props.labelsByUrl]);

  return (
    <div className={"log"}>
        <i className={"remove"} onMouseDown={stopPropagation} onClick={removeFirstLine} onDoubleClick={removeAllLines}><FontAwesomeIcon icon="trash" /></i>
        <i className={"refresh"} onMouseDown={stopPropagation} onClick={refresh}><FontAwesomeIcon icon="refresh" /></i>
        <textarea ref={logRef} onMouseDown={stopPropagation}></textarea>
    </div>
  );
}

export default Log;
