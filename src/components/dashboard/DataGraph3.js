import React from 'react';
import ChartistGraph from 'react-chartist';
import {completedTasksChart} from '../global/ChartConfig';

class DataGraph3 extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className='col-md-4'>
          <div className='card card-chart'>
            <div className='card-header card-header-danger'>
              <ChartistGraph
                className='ct-chart'
                data={completedTasksChart.data}
                type='Line'
                options={completedTasksChart.options}
                listener={completedTasksChart.animation}
              />
            </div>
            <div className='card-body'>
              <h4 className='card-title'>Active Projects</h4>
              <p className='card-category'>Last Campaign Performance</p>
            </div>
            <div className='card-footer'>
              <div className='stats'>
                <i className='material-icons'>access_time</i> updated 1 day ago
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DataGraph3;