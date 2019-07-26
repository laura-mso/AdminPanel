import React from 'react';
import {getLocalDateFromUTC} from '../../util/date';

function ProjectSummary(props) {
  const startDate = getLocalDateFromUTC(props.project.startDate);
  const endDate = getLocalDateFromUTC(props.project.endDate);
  return (
    <div className='card'>
      <div className='card-header card-header-text card-header-info'>
        <div className='card-text'>
          <h4 className='card-title'>Project Summary</h4>
        </div>
      </div>
      <div className='card-body'>
        <div>
          <p>
            Project Date:{' '}
            {props.project.endDate || props.project.startDate ? (
              <span>
                {startDate} ~ {endDate}
              </span>
            ) : (
              <span>No dates selected</span>
            )}
          </p>
          {}
        </div>
        {props.project.summary ? props.project.summary : 'No summary available'}
      </div>
    </div>
  );
}

export default ProjectSummary;
