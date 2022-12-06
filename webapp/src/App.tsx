import React from 'react';
import './App.css';
import Responsive, {Layout, WidthProvider} from "react-grid-layout";
import "react-grid-layout/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const MONITORING_SYSTEM = "monitoring-system";
const ACTION_INFERRER = "action-inferrer";
const ANSIBLE = "ansible";
const TICKET_MANAGER = "ticket-manager";

function App() {
  const layout: Layout[] = [{
      i: MONITORING_SYSTEM,
      x: 0,
      y: 0,
      w: 6,
      h: 30
  },{
      i: ACTION_INFERRER,
      x: 6,
      y: 0,
      w: 6,
      h: 10
  },{
      i: ANSIBLE,
      x: 6,
      y: 10,
      w: 6,
      h: 10
  },{
      i: TICKET_MANAGER,
      x: 6,
      y: 20,
      w: 6,
      h: 10
  }];

  return (
    <div className={"root"}>
        <ResponsiveGridLayout layout={layout}
        rowHeight={30}
        onLayoutChange={() => {}}
        cols={12}>
            <div key={MONITORING_SYSTEM}>
                <span className="text">aaaa</span>
            </div>
            <div key={ACTION_INFERRER}>
                <span className="text">bbbb</span>
            </div>
            <div key={ANSIBLE}>
                <span className="text">cccc</span>
            </div>
            <div key={TICKET_MANAGER}>
                <span className="text">dddd</span>
            </div>
        </ResponsiveGridLayout>
    </div>
  );
}

export default App;
