import React from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router';
import Select from 'react-select';
import '../global/Form.css';

const styles = {
  select: {
    theme: theme => ({
      ...theme,
      borderRadius: 0,
      colors: {
        ...theme.colors,
        primary25: '#1fbfd7',
        primary: '#1fbfd7',
      },
    }),
    control: (base, state) => ({
      ...base,
      borderColor: 'lightgrey',
      boxShadow: `0 0 0 1px lightgrey`,
      borderRadius: '4px',
      '&:hover': {
        borderColor: '#1fbfd7',
        boxShadow: `1 1 5 10px #1fbfd7`,
        color: 'white',
      },
    }),
  },
};

class AddNewTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      selectedProject: [],
      title: '',
      summary: '',
      startDate: '',
      endDate: '',
      assignee: [],
      assigneeSelect: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.selectProject = this.selectProject.bind(this);
    this.selectAssignee = this.selectAssignee.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    fetch('https://lesewert.herokuapp.com/api/v1/users')
      .then(res => res.json())
      .then(data =>
        this.setState({
          assignee: data.users,
        }),
      )
      .catch(error => console.log(error))
      .then(
        fetch('https://lesewert.herokuapp.com/api/v1/projects')
          .then(res => res.json())
          .then(data =>
            this.setState({
              projects: data.projects,
            }),
          )
          .catch(error => console.log(error)),
      );
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  selectProject(option) {
    this.setState({
      selectedProject: option,
    });
  }

  selectAssignee(option) {
    this.setState({
      assigneeelect: option,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const newClient = this.state.selectedProject.value;
    const newassignee = this.state.assigneeelect.map(participant => {
      return participant.value;
    });
    const body = {
      clientId: newClient,
      title: this.state.title,
      summary: this.state.summary,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      assignee: newassignee,
    };
    fetch('https://lesewert.herokuapp.com/api/v1/projects', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    })
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.props.history.push('/projects');
          return res;
        } else {
          alert('Sorry - something went wrong.');
        }
      })
      .catch(error => console.log(error));
    this.setState({
      projects: [],
      selectedProject: [],
      title: '',
      summary: '',
      startDate: '',
      endDate: '',
      assignee: [],
      assigneeelect: [],
    });
  }

  render() {
    let clientOptions = this.state.projects.map(client => {
      return {value: client.id, label: client.name};
    });
    let participantOptions = this.state.assignee.map(user => {
      return {value: user.id, label: user.name};
    });
    return (
      <div className='container-fluid'>
        <div className='card'>
          <div className='card-header card-header-rose'>
            <h4 className='card-title'>New Task</h4>
          </div>
          <div className='card-body'>
            <br />
            <form onSubmit={this.handleSubmit}>
              <div className='form-row'>
                <div className='form-group col-sm-12 col-md-6 has-info input-group'>
                  <label htmlFor='inputTitle'>Title:</label>
                  <input
                    type='text'
                    name='title'
                    className='form-control inner-form'
                    id='inputTitle'
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div className='col-sm-12 col-md-6 has-info projects'>
                  <label htmlFor='inputClient' className='text-info'>
                    Project:
                  </label>
                  <Select
                    id='inputClient'
                    name='selectedProject'
                    value={this.state.selectedProject}
                    options={clientOptions}
                    onChange={this.selectProject}
                    className='select'
                    theme={styles.select.theme}
                    required
                  />
                </div>
              </div>
              <div className='form-row'>
                <div className='form-group col-sm-12 col-md-3 has-info input-group'>
                  <label htmlFor='inputStartDate'>Start Date:</label>
                  <input
                    type='date'
                    name='startDate'
                    className='form-control inner-form'
                    id='inputStartDate'
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div className='form-group col-sm-12 col-md-3 has-info input-group'>
                  <label htmlFor='inputEndDate'>End Date:</label>
                  <input
                    type='date'
                    name='endDate'
                    className='form-control inner-form'
                    id='inputEndDate'
                    onChange={this.handleChange}
                    required
                  />
                </div>
              </div>
              <div className='form-row'>
                <div className='form-group col-sm-5 col-md-3 col-lg-3 has-info'>
                  <label htmlFor='inputEstimation'>Estimation:</label>
                  <textarea
                    type='text'
                    name='estimation'
                    className='form-control'
                    id='inputEstimation'
                    onChange={this.handleChange}
                    rows={1}
                    placeholder='hours'
                    required
                  />
                </div>
                <div className='form-group col-sm-12 col-md-12 has-info'>
                  <label htmlFor='inputSummary'>Summary:</label>
                  <textarea
                    type='text'
                    name='summary'
                    className='form-control'
                    id='inputSummary'
                    onChange={this.handleChange}
                    rows={1}
                    required
                  />
                </div>
                <div className='form-group col-sm-12 col-md-12 has-info'>
                  <label htmlFor='inputSummary'>Description:</label>
                  <textarea
                    type='text'
                    name='summary'
                    className='form-control'
                    id='inputSummary'
                    onChange={this.handleChange}
                    rows={3}
                    required
                  />
                </div>
              </div>
              <div className='form-row'>
                <div className=' form-group col-xs-1'>
                  <Link to='/projects'>
                    <button type='reset' className='btn btn-danger'>
                      Cancel
                    </button>
                  </Link>
                </div>
                <div className='form-group col-xs-1 text-end ml-auto'>
                  <button type='submit' className='btn btn-success btn-right'>
                    Add
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(AddNewTask);
