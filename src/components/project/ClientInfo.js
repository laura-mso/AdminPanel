import React from 'react';
import CircleImg from './CircleImg';

export default class ClientInfo extends React.Component {
  static defaultProps = {
    url: 'https://lesewert.herokuapp.com/api/v1',
  };

  constructor(props) {
    super(props);

    this.state = {
      client: {},
    };
    this.getClient = this.getClient.bind(this);
  }
  getClient() {
    fetch(`${this.props.url}/clients/${this.props.client}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          client: data.client,
        });
      })
      .catch(error => console.log(error));
  }

  componentDidMount() {
    this.getClient();
  }

  render() {
    return (
      <div className='col-lg-4 col-md-12 col-sm-12'>
        <div className='card card-stats'>
          <div className='card-header card-header-info card-header-icon'>
            <div className='card-icon'>
              <i className='material-icons'>location_city</i>
            </div>
            <div className='container-fluid' style={{padding: '10px'}}>
              <p className='card-category' style={{paddingBottom: '5px'}}>
                Client Information
              </p>
              <CircleImg logo={this.state.client.logo} />
              <p style={{color: 'grey'}}>{this.state.client.name}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
