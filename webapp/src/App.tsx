import React, {ChangeEvent, MouseEventHandler, useCallback, useMemo, useState} from 'react';
import './App.css';
import Responsive, {Layout, WidthProvider} from "react-grid-layout";
import "react-grid-layout/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const EXECUTION_PARAMETERS = "execution-parameters";
const MONITORING_SYSTEM = "monitoring-system";
const ACTION_INFERRER = "action-inferrer";
const ANSIBLE = "ansible";
const TICKET_MANAGER = "ticket-manager";

function App() {
    const [activeUsers, setActiveUsers] = useState(0);

    const [minActivePods, setMinActivePods] = useState(1);
    const [maxActivePods, setMaxActivePods] = useState(10);
    const [avgCPULoadPerUser, setAvgCPULoadPerUser] = useState(0);
    const [avgMemoryLoadPerUser, setAvgMemoryLoadPerUser] = useState(0);
    const [addedUsers, setAddedUsers] = useState(0);
    const [removedUsers, setRemovedUsers] = useState(0);

  const layout: Layout[] = useMemo(() => [{
      i: EXECUTION_PARAMETERS,
      x: 0,
      y: 0,
      w: 6,
      h: 10
  }, {
      i: MONITORING_SYSTEM,
      x: 0,
      y: 0,
      w: 6,
      h: 20
  }, {
      i: ACTION_INFERRER,
      x: 6,
      y: 0,
      w: 6,
      h: 10
  }, {
      i: ANSIBLE,
      x: 6,
      y: 10,
      w: 6,
      h: 10
  }, {
      i: TICKET_MANAGER,
      x: 6,
      y: 20,
      w: 6,
      h: 10
  }], []);

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>, setMethod: (value: any) => void) => {
    setMethod(event.target.value);
  }, []);

  const stopPropagation: MouseEventHandler<HTMLInputElement> = useCallback(event => {
      event.stopPropagation();
  }, []);

  return (
    <div className={"root"}>
        <ResponsiveGridLayout layout={layout}
        rowHeight={30}
        onLayoutChange={() => {}}
        cols={12}>
            <div key={EXECUTION_PARAMETERS}>
                <h3>Execution parameters</h3>
                <form>
                    <label>
                        Minimum active pods:
                        <input type={"number"}
                               value={minActivePods}
                               onChange={event => handleInputChange(event, setMinActivePods)}
                               onMouseDown={stopPropagation} />
                    </label>
                    <label>
                        Maximum active pods:
                        <input type={"number"}
                               value={maxActivePods}
                               onChange={event => handleInputChange(event, setMaxActivePods)}
                               onMouseDown={stopPropagation} />
                    </label>
                    <label>
                        Average CPU load per user:
                        <input type={"number"}
                               value={avgCPULoadPerUser}
                               onChange={event => handleInputChange(event, setAvgCPULoadPerUser)}
                               onMouseDown={stopPropagation} />
                    </label>
                    <label>
                        Average Memory load per user:
                        <input type={"number"}
                               value={avgMemoryLoadPerUser}
                               onChange={event => handleInputChange(event, setAvgMemoryLoadPerUser)}
                               onMouseDown={stopPropagation} />
                    </label>
                    <label>
                        Simulate users entering:
                        <input type={"number"}
                               value={addedUsers}
                               onChange={event => handleInputChange(event, setAddedUsers)}
                               onMouseDown={stopPropagation} />
                        <button>Add</button>
                    </label>
                    <label>
                        Simulate users leaving:
                        <input type={"number"}
                               value={removedUsers}
                               onChange={event => handleInputChange(event, setRemovedUsers)}
                               onMouseDown={stopPropagation} />
                        <button>Remove</button>
                    </label>
                </form>
            </div>
            <div key={MONITORING_SYSTEM}>
                <h3>Monitoring</h3>
            </div>
            <div key={ACTION_INFERRER}>
                <h3>Action Inferrer</h3>
            </div>
            <div key={ANSIBLE}>
                <h3>Ansible</h3>
            </div>
            <div key={TICKET_MANAGER}>
                <h3>Ticket Manager</h3>
            </div>
        </ResponsiveGridLayout>
    </div>
  );
}

export default App;
