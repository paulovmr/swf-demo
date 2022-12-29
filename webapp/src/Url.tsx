import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import "react-grid-layout/css/styles.css";
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from '@fortawesome/free-solid-svg-icons'

interface Props {
    currentUrl: string;
    urlChangedCallback: (url: string) => void;
}

function Url(props: Props) {
  const [urlInputVisible, setUrlInputVisible] = useState(false);
  const [url, setUrl] = useState(props.currentUrl);

  library.add(faCog);
  dom.watch();

  const stopPropagation: MouseEventHandler = useCallback(event => {
      event.stopPropagation();
  }, []);

  return (
    <div>
        <i
            onMouseDown={stopPropagation}
            onClick={() => setUrlInputVisible(!urlInputVisible)}>
            <FontAwesomeIcon icon="cog" />
        </i>
        <input
            type={"text"}
            value={url}
            className={urlInputVisible ? "" : "hidden"}
            style={{ width: "500px" }}
            onMouseDown={stopPropagation}
            onChange={e => setUrl(e.target.value)}
            onBlur={e => props.urlChangedCallback(e.target.value)}
        />
    </div>
  );
}

export default Url;
