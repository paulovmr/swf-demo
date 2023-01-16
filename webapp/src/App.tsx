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
const RUNTIME_STATUS = "runtime-status";
const MONITORING_SYSTEM = "monitoring-system";
const ACTION_INFERRER = "action-inferrer";
const ANSIBLE = "ansible";
const TICKET_MANAGER = "ticket-manager";
const WAITING_ROOM = "waiting-room";
const GLOBAL_CONFIG = "global-config";
const GLOBAL_LOG = "global-log";

function App() {
    const [activePods, setActivePods] = useState(1);
    const [activeUsers, setActiveUsers] = useState(0);
    const [queueLength, setQueueLength] = useState(0);
    const [ticketsOpened, setTicketsOpened] = useState(0);
    const [ticketsClosed, setTicketsClosed] = useState(0);

    const [viewUnifiedLog, setViewUnifiedLog] = useState(false);
    const [minActivePods, setMinActivePods] = useState(1);
    const [maxActivePods, setMaxActivePods] = useState(10);
    const [avgLoadPerUser, setAvgLoadPerUser] = useState(40);
    const [addedUsers, setAddedUsers] = useState(0);
    const [removedUsers, setRemovedUsers] = useState(0);

    /*const [actionInferrerUrl, setActionInferrerUrl] = useState("https://action-inferrer-paulovmr-dev.apps.sandbox.x8i5.p1.openshiftapps.com");
    const [ansibleUrl, setAnsibleUrl] = useState("https://ansible-paulovmr-dev.apps.sandbox.x8i5.p1.openshiftapps.com");
    const [monitoringUrl, setMonitoringUrl] = useState("https://monitoring-system-paulovmr-dev.apps.sandbox.x8i5.p1.openshiftapps.com");
    const [ticketManagerUrl, setTicketManagerUrl] = useState("https://ticket-manager-paulovmr-dev.apps.sandbox.x8i5.p1.openshiftapps.com");
    const [waitingRoomUrl, setWaitingRoomUrl] = useState("https://waiting-room-paulovmr-dev.apps.sandbox.x8i5.p1.openshiftapps.com");*/

    const [actionInferrerUrl, setActionInferrerUrl] = useState("http://localhost:3001");
    const [ansibleUrl, setAnsibleUrl] = useState("http://localhost:3002");
    const [monitoringUrl, setMonitoringUrl] = useState("http://localhost:3003");
    const [ticketManagerUrl, setTicketManagerUrl] = useState("http://localhost:3004");
    const [waitingRoomUrl, setWaitingRoomUrl] = useState("http://localhost:3005");

  const layout: Layout[] = useMemo(() => {
      if (viewUnifiedLog) {
          return [{
              i: EXECUTION_PARAMETERS,
              x: 0,
              y: 0,
              w: 4,
              h: 10
          }, {
              i: RUNTIME_STATUS,
              x: 4,
              y: 0,
              w: 2,
              h: 10
          }, {
              i: GLOBAL_CONFIG,
              x: 6,
              y: 0,
              w: 6,
              h: 10
          }, {
              i: GLOBAL_LOG,
              x: 0,
              y: 10,
              w: 12,
              h: 20
          }];
      } else {
          return [{
              i: EXECUTION_PARAMETERS,
              x: 0,
              y: 0,
              w: 4,
              h: 10
          }, {
              i: RUNTIME_STATUS,
              x: 4,
              y: 0,
              w: 2,
              h: 10
          }, {
              i: MONITORING_SYSTEM,
              x: 0,
              y: 10,
              w: 6,
              h: 10
          }, {
              i: ACTION_INFERRER,
              x: 0,
              y: 20,
              w: 6,
              h: 10
          }, {
              i: WAITING_ROOM,
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
          }];
      }
  }, [viewUnifiedLog]);

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>, setMethod: (value: any) => void) => {
      setMethod(event.target.value);
  }, []);

  const handleCheckboxChange = useCallback((event: ChangeEvent<HTMLInputElement>, setMethod: (value: any) => void) => {
      setMethod(event.target.checked);
  }, []);

  const stopPropagation: MouseEventHandler = useCallback(event => {
      event.stopPropagation();
  }, []);

  const addUsers = useCallback((event: MouseEvent, numberOfUsers: number) => {
      event.preventDefault();
      axios.post(waitingRoomUrl + "/simulateUsers", {
          numberOfUsers: numberOfUsers
      }).then(waitingRoomRes => {
          axios.get(ansibleUrl + "/numbers", {}).then(ansibleRes => {
              axios.post(monitoringUrl + "/performanceData", {
                  numberOfRunningPods: ansibleRes.data.numberOfActivePods,
                  avgLoad: avgLoadPerUser * waitingRoomRes.data.numberOfActiveUsers / ansibleRes.data.numberOfActivePods,
                  avgLoadPerUser: avgLoadPerUser,
                  minActivePods: minActivePods,
                  maxActivePods: maxActivePods,
                  queueLength: waitingRoomRes.data.usersQueueLength,
                  swfDeployUrl: "a"//https://serverless-workflow-paulovmr-dev.apps.sandbox.x8i5.p1.openshiftapps.com"
              }).then(_ => {
                  axios.get(ansibleUrl + "/numbers", {}).then(ansibleNumbers => {
                      setActivePods(ansibleNumbers.data.numberOfActivePods);
                  });
                  axios.get(waitingRoomUrl + "/numbers", {}).then(waitingRoomNumbers => {
                      setActiveUsers(waitingRoomNumbers.data.numberOfActiveUsers);
                      setQueueLength(waitingRoomNumbers.data.usersQueueLength);
                  });
                  axios.get(ticketManagerUrl + "/numbers", {}).then(ticketManagerNumbers => {
                      setTicketsOpened(ticketManagerNumbers.data.numberOfOpenedTickets);
                      setTicketsClosed(ticketManagerNumbers.data.numberOfClosedTickets);
                  });
              }).catch(err => {
                  console.log("Failed to set performance data.", err);
              });
          }).catch(err => {
              console.log("Failed to change number of users.", err);
          });
      }).catch(err => {
          console.log("Failed to change number of users.", err);
      });
  }, [avgLoadPerUser, ansibleUrl, monitoringUrl, waitingRoomUrl, ticketManagerUrl, minActivePods, maxActivePods, queueLength]);

  const reset = useCallback((event: MouseEvent) => {
      event.preventDefault();
      [ansibleUrl, monitoringUrl, actionInferrerUrl, waitingRoomUrl, ticketManagerUrl].forEach(url => {
          axios.post(url + "/reset").then(res => {
              console.log(url + " resetted.");
          }).catch(err => {
              console.log("Error while reseting " + url, err);
          })
      });
      window.location.reload();
  }, [ansibleUrl, monitoringUrl, actionInferrerUrl, waitingRoomUrl, ticketManagerUrl]);

  return (
    <div className={"root"}>
        <ResponsiveGridLayout layout={layout}
        rowHeight={30}
        onLayoutChange={() => {}}
        cols={12}>
            <div key={EXECUTION_PARAMETERS}>
                <div className={"url"}>
                    <h3>Execution parameters</h3>
                    <form>
                        <label>
                            View unified log:
                            <input type={"checkbox"}
                                   checked={viewUnifiedLog}
                                   onChange={event => handleCheckboxChange(event, setViewUnifiedLog)}
                                   onMouseDown={stopPropagation} />
                        </label>
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
            </div>

            <div key={RUNTIME_STATUS}>
                <div className={"url"}>
                    <h3>Current status</h3>
                    <form>
                        <label>
                            Active Users: {activeUsers}
                        </label>
                        <label>
                            Queued Users: {queueLength}
                        </label>
                        <label>
                            Active Pods: {activePods}
                        </label>
                        <label>
                            Tickets opened: {ticketsOpened}
                        </label>
                        <label>
                            Tickets closed: {ticketsClosed}
                        </label>
                        <label>
                            <button onMouseDown={stopPropagation}
                                    onClick={reset}>
                                Reset All
                            </button>
                        </label>
                    </form>
                </div>
            </div>

            {!viewUnifiedLog &&
                <div key={WAITING_ROOM}>
                    <div className={"url"}>
                        <h3>Waiting Room</h3>
                        <Url currentUrl={waitingRoomUrl} urlChangedCallback={setWaitingRoomUrl}></Url>
                    </div>
                    <Log labelsByUrl={new Map([[waitingRoomUrl, "WAITING ROOM"]])}></Log>
                </div>
            }

            {!viewUnifiedLog &&
                <div key={MONITORING_SYSTEM}>
                    <div className={"url"}>
                        <h3>Monitoring</h3>
                        <Url currentUrl={monitoringUrl} urlChangedCallback={setMonitoringUrl}></Url>
                    </div>
                    <Log labelsByUrl={new Map([[monitoringUrl, "MONITORING"]])}></Log>
                </div>
            }

            {!viewUnifiedLog &&
                <div key={ACTION_INFERRER}>
                    <div className={"url"}>
                        <h3>RHODS</h3>
                        <Url currentUrl={actionInferrerUrl} urlChangedCallback={setActionInferrerUrl}></Url>
                    </div>
                    <Log labelsByUrl={new Map([[actionInferrerUrl, "RHODS"]])}></Log>
                </div>
            }

            {!viewUnifiedLog &&
                <div key={ANSIBLE}>
                    <div className={"url"}>
                        <h3>Ansible</h3>
                        <Url currentUrl={ansibleUrl} urlChangedCallback={setAnsibleUrl}></Url>
                    </div>
                    <Log labelsByUrl={new Map([[ansibleUrl, "ANSIBLE"]])}></Log>
                </div>
            }

            {!viewUnifiedLog &&
                <div key={TICKET_MANAGER}>
                    <div className={"url"}>
                        <h3>Ticket Manager</h3>
                        <Url currentUrl={ticketManagerUrl} urlChangedCallback={setTicketManagerUrl}></Url>
                    </div>
                    <Log labelsByUrl={new Map([[ticketManagerUrl, "TICKET MANAGER"]])}></Log>
                </div>
            }

            {viewUnifiedLog &&
                <div key={GLOBAL_CONFIG}>
                    <div className={"url"}>
                        <h3>Waiting Room</h3>
                        <Url currentUrl={waitingRoomUrl} urlChangedCallback={setWaitingRoomUrl}></Url>
                    </div>
                    <div className={"url"}>
                        <h3>Monitoring</h3>
                        <Url currentUrl={monitoringUrl} urlChangedCallback={setMonitoringUrl}></Url>
                    </div>
                    <div className={"url"}>
                        <h3>RHODS</h3>
                        <Url currentUrl={actionInferrerUrl} urlChangedCallback={setActionInferrerUrl}></Url>
                    </div>
                    <div className={"url"}>
                        <h3>Ansible</h3>
                        <Url currentUrl={ansibleUrl} urlChangedCallback={setAnsibleUrl}></Url>
                    </div>
                    <div className={"url"}>
                        <h3>Ticket Manager</h3>
                        <Url currentUrl={ticketManagerUrl} urlChangedCallback={setTicketManagerUrl}></Url>
                    </div>
                </div>
            }

            {viewUnifiedLog &&
                <div key={GLOBAL_LOG} className={"large-log"}>
                    <div className={"url"}>
                        <h3>Unified Log</h3>
                    </div>
                    <Log labelsByUrl={new Map([
                        [ticketManagerUrl, "TICKET MANAGER"],
                        [ansibleUrl, "ANSIBLE"],
                        [actionInferrerUrl, "RHODS"],
                        [monitoringUrl, "MONITORING"],
                        [waitingRoomUrl, "WAITING ROOM"]
                    ])}></Log>
                </div>
            }
        </ResponsiveGridLayout>
    </div>
  );
}

export default App;
