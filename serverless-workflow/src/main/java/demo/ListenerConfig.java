package demo;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;

import org.kie.api.event.process.ProcessNodeTriggeredEvent;
import org.kie.api.event.process.ProcessStartedEvent;
import org.kie.api.event.process.ProcessVariableChangedEvent;
import org.kie.kogito.internal.process.runtime.KogitoNodeInstance;
import org.kie.kogito.internal.process.runtime.KogitoProcessInstance;
import org.kie.kogito.internal.process.event.DefaultKogitoProcessEventListener;
import org.kie.kogito.process.impl.DefaultProcessEventListenerConfig;

@ApplicationScoped
public class ListenerConfig extends DefaultProcessEventListenerConfig {

    public ListenerConfig() {
    }

    @PostConstruct
    public void setup() {
        register(new DefaultKogitoProcessEventListener() {
            public void beforeProcessStarted(ProcessStartedEvent event) {
                System.out.println("Starting workflow " + event.getProcessInstance().getProcessId() + " (" + ((KogitoProcessInstance) event.getProcessInstance()).getStringId() + ")");
            }
            public void afterProcessStarted(ProcessStartedEvent event) {
                System.out.println("Workflow " + event.getProcessInstance().getProcessId() + " (" + ((KogitoProcessInstance) event.getProcessInstance()).getStringId() + ") was started, now " + getStatus(event.getProcessInstance().getState()));
            }
            public void beforeNodeTriggered(ProcessNodeTriggeredEvent event) {
                String nodeName = event.getNodeInstance().getNodeName();
                if (!"EmbeddedStart".equals(nodeName) && !"EmbeddedEnd".equals(nodeName) && !"Script".equals(nodeName)) {
                    System.out.println("Triggered node " + nodeName + " (" + ((KogitoNodeInstance) event.getNodeInstance()).getStringId() + ") for process " + event.getProcessInstance().getProcessId() + " (" + ((KogitoProcessInstance) event.getProcessInstance()).getStringId() + ")");
                }
            }
            public void afterVariableChanged(ProcessVariableChangedEvent event) {
                System.out.println("Data changed: " + event.getNewValue());
            }
        });
    }

    private static String getStatus(int status) {
        switch (status) {
            case 0: return "PENDING";
            case 1: return "ACTIVE";
            case 2: return "COMPLETED";
            case 3: return "ABORTED";
            case 4: return "SUSPENDED";
            default: return "UNKNOWN " + status;
        }
    }

}

