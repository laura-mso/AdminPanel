import React from 'react';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router';
import '../global/Form.css';
import {config} from '../../util/config.js';
import Spinner from '../global/Spinner';
import Popup from '../global/Popup';
import './ClientNew.css';

function validate() {
  const errors = [];
  errors.push('Image size is too big');
  return errors;
}

class NewClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: '',
      name: '',
      initials: '',
      logo: '',
      logoPreview: '',
      logoLoaded: false,
      contactInformation: {
        email: '',
        number: '',
      },
      loading: false,
      edit: false,
      errors: [],
      showPopup: false,
      showError: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogoChange = this.handleLogoChange.bind(this);
    this.handleLogoDelete = this.handleLogoDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.getClient = this.getClient.bind(this);
    this.togglePopupHandler = this.togglePopupHandler.bind(this);
  }

  componentDidMount() {
    this.getClient();
  }

  getClient() {
    if (this.props.location.pathname.split('/').pop() !== 'new') {
      fetch(
        `${config.apiUrl}/clients/${this.props.location.pathname
          .split('/')
          .pop()}`,
        {
          headers: new Headers({
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
          }),
        },
      )
        .then(res => res.json())
        .then(data => {
          this.setState({
            clientId: data.client.id,
            name: data.client.name,
            initials: data.client.initials,
            contactInformation: data.client.contactInformation,
            logoPreview: data.client.logo,
            edit: true,
            loading: false,
            logoLoaded: true,
          });
        })
        .catch(error => alert(error));
    }
  }

  handleEdit(e) {
    e.preventDefault();
    const body = {
      name: this.state.name,
      initials: this.state.initials,
      contactInformation: this.state.contactInformation,
      logo: this.state.logoPreview,
    };
    fetch(`${config.apiUrl}/clients/${this.state.clientId}`, {
      method: 'PUT',
      headers: new Headers({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    })
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.props.history.push('/clients');
          return res;
        } else {
          alert('Sorry - something went wrong.');
        }
      })
      .catch(error => console.log(error));
    this.setState({
      name: '',
      initials: '',
      contactInformation: '',
      logo: '',
    });
  }

  handleChange(e) {
    e.preventDefault();
    if (e.target.name === 'email' || e.target.name === 'number') {
      let infoContact = this.state.contactInformation;
      this.setState({
        contactInformation: {
          ...infoContact,
          [e.target.name]: e.target.value,
        },
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const body = {
      name: this.state.name,
      initials: this.state.initials,
      contactInformation: this.state.contactInformation,
      logo: this.state.logoPreview,
    };
    fetch(`${config.apiUrl}/clients`, {
      method: 'POST',
      headers: new Headers({
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    })
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          this.props.history.push('/clients');
          return res;
        } else {
          alert('Sorry - something went wrong.');
        }
      })
      .catch(error => alert(error));
  }

  handleLogoChange(e) {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();

    if (e.target.files[0].size < 3145728) {
      reader.onloadend = e => {
        this.setState({
          logo: file,
          logoPreview: reader.result,
          logoLoaded: true,
        });
      };
    } else {
      const errors = validate();
      this.setState({
        showPopup: true,
        errors,
        showError: true,
      });
    }
    if (file) {
      reader.readAsDataURL(file);
      this.setState({
        logo: reader.result,
      });
    } else {
      this.setState({
        logo: '',
      });
    }
    e.target.value = null;
  }

  handleLogoDelete(e) {
    e.preventDefault();
    e.target.value = '';
    this.setState({
      logo: '',
      logoPreview: '',
      logoLoaded: false,
    });
  }

  togglePopupHandler(e) {
    e.preventDefault();
    e.target.parentElement.classList.remove('show');
    this.setState({
      showError: false,
    });
    setTimeout(() => {
      this.setState({
        showPopup: false,
        errors: [],
        showError: false,
      });
    }, 5000);
  }

  render() {
    return (
      <React.Fragment>
        {this.state.loading ? (
          <Spinner spinnerPosition={'global-spinner'} />
        ) : (
          <div className='container-fluid'>
            <div className='card'>
              <div className='card-header card-header-primary'>
                <h4 className='card-title'>
                  {this.state.edit ? 'Edit Client' : 'New Client'}
                </h4>
              </div>
              <div className='card-body'>
                <form
                  onSubmit={
                    this.state.edit ? this.handleEdit : this.handleSubmit
                  }>
                  <div className='form-row'>
                    <div className='form-row col-md-8 client-wrap'>
                      <div className='form-group col-sm-12 col-md-9 has-primary input-group'>
                        <label htmlFor='inputTitle'>Name:</label>
                        <input
                          type='text'
                          value={this.state.name}
                          name='name'
                          className='form-control inner-form'
                          id='inputTitle'
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                      <div className='form-group col-sm-12 col-md-3 has-primary input-group'>
                        <label htmlFor='inputInitials'>Initials:</label>
                        <input
                          type='text'
                          value={this.state.initials}
                          name='initials'
                          className='form-control inner-form'
                          id='inputInitials'
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                      <div className='form-group col-sm-12 col-md-7 has-primary input-group'>
                        <label htmlFor='inputEmail'>Email:</label>
                        <input
                          type='email'
                          value={this.state.contactInformation.email}
                          name='email'
                          className='form-control inner-form'
                          id='inputEmail'
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                      <div className='form-group col-sm-12 col-md-5 has-primary input-group'>
                        <label htmlFor='inputNumber'>Number:</label>
                        <input
                          type='text'
                          value={this.state.contactInformation.number}
                          name='number'
                          className='form-control inner-form'
                          id='inputNumber'
                          onChange={this.handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div
                      className='form-group col-sm-12 col-md-4 has-primary'
                      align='center'>
                      {this.state.logoLoaded === true ? (
                        <img
                          src={this.state.logoPreview}
                          className='fileinput-new thumbnail img-raised logo'
                          alt='avatar'
                        />
                      ) : (
                        <div className='fileinput-new thumbnail img-raised logo-place-holder' />
                      )}
                      {this.state.logoLoaded === true ? (
                        <div>
                          <button
                            className='btn btn-round btn-primary client-button'
                            type='button'
                            onClick={e => this.fileInput.click()}>
                            Change Logo
                          </button>
                          <input
                            type='file'
                            ref={ref => (this.fileInput = ref)}
                            name='logo'
                            accept='image/png, image/jpeg'
                            hidden
                            onChange={this.handleLogoChange}
                            className='fileInput'
                          />
                          <div className='validation-alert'>
                            {this.state.showPopup
                              ? this.state.errors.map((error, index) => {
                                  return (
                                    <Popup
                                      error={error}
                                      key={this.state.errors[index]}
                                      onClose={this.togglePopupHandler}
                                    />
                                  );
                                })
                              : null}
                          </div>
                          <button
                            className='btn btn-fab btn-danger btn-round client-button'
                            type='button'
                            onClick={this.handleLogoDelete}>
                            <i className='fa fa-times' />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            className='btn btn-round btn-primary client-button'
                            type='button'
                            onClick={e => this.fileInput.click()}>
                            Select Logo
                          </button>
                          <input
                            type='file'
                            ref={ref => (this.fileInput = ref)}
                            name='logo'
                            hidden
                            onChange={this.handleLogoChange}
                            className='fileInput'
                            accept='image/png, image/jpeg'
                          />
                          <div className='validation-alert'>
                            {this.state.showPopup
                              ? this.state.errors.map((error, index) => {
                                  return (
                                    <Popup
                                      error={error}
                                      key={this.state.errors[index]}
                                      onClose={this.togglePopupHandler}
                                    />
                                  );
                                })
                              : null}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='form-row'>
                    <div className=' form-group col-xs-1'>
                      <Link to='/clients'>
                        <button type='reset' className='btn btn-danger'>
                          Cancel
                        </button>
                      </Link>
                    </div>
                    <div className='form-group col-xs-1 text-end ml-auto'>
                      <button
                        type='submit'
                        className='btn btn-success btn-right'>
                        {this.state.edit ? 'Save' : 'Add'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(NewClient);
