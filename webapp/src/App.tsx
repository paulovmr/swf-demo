import React, {
    ChangeEvent,
    MouseEvent,
    MouseEventHandler,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import './App.css';
import Responsive, {Layout, WidthProvider} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import axios from "axios";
import Log from "./Log";
import Url from "./Url";

const ResponsiveGridLayout = WidthProvider(Responsive);

const EXECUTION_PARAMETERS = "execution-parameters";
const MONITORING_SYSTEM = "monitoring-system";
const ACTION_INFERRER = "action-inferrer";
const ANSIBLE = "ansible";
const TICKET_MANAGER = "ticket-manager";

function App() {
    const [activePods, setActivePods] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);
    const [queueLength, setQueueLength] = useState(0);

    const [minActivePods, setMinActivePods] = useState(1);
    const [maxActivePods, setMaxActivePods] = useState(10);
    const [avgLoadPerUser, setAvgLoadPerUser] = useState(40);
    const [addedUsers, setAddedUsers] = useState(0);
    const [removedUsers, setRemovedUsers] = useState(0);

    const [actionInferrerUrl, setActionInferrerUrl] = useState("https://action-inferrer-paulovmr-dev.apps.sandbox.x8i5.p1.openshiftapps.com");
    const [ansibleUrl, setAnsibleUrl] = useState("https://ansible-paulovmr-dev.apps.sandbox.x8i5.p1.openshiftapps.com");
    const [monitoringUrl, setMonitoringUrl] = useState("https://monitoring-system-paulovmr-dev.apps.sandbox.x8i5.p1.openshiftapps.com");
    const [ticketManagerUrl, setTicketManagerUrl] = useState("https://ticket-manager-paulovmr-dev.apps.sandbox.x8i5.p1.openshiftapps.com");

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

  const stopPropagation: MouseEventHandler = useCallback(event => {
      event.stopPropagation();
  }, []);

  const addUsers = useCallback((event: MouseEvent, numberOfUsers: number) => {
      event.preventDefault();
      axios.post(ansibleUrl + "/simulateUsers", {
          numberOfUsers: numberOfUsers
      }).then(res => {
          axios.post(monitoringUrl + "/performanceData", {
              numberOfRunningPods: res.data.numberOfPods,
              avgLoad: avgLoadPerUser * res.data.numberOfActiveUsers / res.data.numberOfPods,
              avgLoadPerUser: avgLoadPerUser,
              minActivePods: minActivePods,
              maxActivePods: maxActivePods,
              queueLength: queueLength,
              swfDeployUrl: "https://serverless-workflow-paulovmr-dev.apps.sandbox.x8i5.p1.openshiftapps.com"
          }).then(res => {
              console.log("Performance data updated.");
              setActivePods(res.data.numberOfPods);
              setActiveUsers(res.data.numberOfActiveUsers);
              setQueueLength(res.data.usersQueueLength);
          }).catch(err => {
              console.log("Failed to set performance data.", err);
          });
      }).catch(err => {
          console.log("Failed to change number of users.", err);
      });
  }, [avgLoadPerUser, ansibleUrl, monitoringUrl]);

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
                        Average load per user:
                        <input type={"number"}
                               value={avgLoadPerUser}
                               onChange={event => handleInputChange(event, setAvgLoadPerUser)}
                               onMouseDown={stopPropagation} />
                    </label>
                    <label>
                        Simulate users entering:
                        <input type={"number"}
                               value={addedUsers}
                               onChange={event => handleInputChange(event, setAddedUsers)}
                               onMouseDown={stopPropagation} />
                        <button onMouseDown={stopPropagation}
                                onClick={event => addUsers(event, addedUsers)}>
                            Add
                        </button>
                    </label>
                    <label>
                        Simulate users leaving:
                        <input type={"number"}
                               value={removedUsers}
                               onChange={event => handleInputChange(event, setRemovedUsers)}
                               onMouseDown={stopPropagation} />
                        <button onMouseDown={stopPropagation}
                                onClick={event => addUsers(event, -1 * removedUsers)}>
                            Remove
                        </button>
                    </label>
                </form>
            </div>
            <div key={MONITORING_SYSTEM}>
                <div className={"url"}>
                    <h3>Monitoring</h3>
                    <Url currentUrl={monitoringUrl} urlChangedCallback={setMonitoringUrl}></Url>
                </div>
                <Log baseUrl={monitoringUrl}></Log>
            </div>
            <div key={ACTION_INFERRER}>
                <div className={"url"}>
                    <h3>Action Inferrer</h3>
                    <Url currentUrl={actionInferrerUrl} urlChangedCallback={setActionInferrerUrl}></Url>
                </div>
                <Log baseUrl={actionInferrerUrl}></Log>
            </div>
            <div key={ANSIBLE}>
                <div className={"url"}>
                    <h3>Ansible</h3>
                    <Url currentUrl={ansibleUrl} urlChangedCallback={setAnsibleUrl}></Url>
                </div>
                <Log baseUrl={ansibleUrl}></Log>
            </div>
            <div key={TICKET_MANAGER}>
                <div className={"url"}>
                    <h3>Ticket Manager</h3>
                    <Url currentUrl={ticketManagerUrl} urlChangedCallback={setTicketManagerUrl}></Url>
                </div>
                <Log baseUrl={ticketManagerUrl}></Log>
            </div>
        </ResponsiveGridLayout>
    </div>
  );
}

export default App;
