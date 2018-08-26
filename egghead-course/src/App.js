import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {

  mountLifeCircle(){
    ReactDOM.render(<LifeCircle />, document.getElementById('lifeCircle'));
  }

  unMountLifeCircle() {
    ReactDOM.unmountComponentAtNode(document.getElementById('lifeCircle'));
  }

  render() {
    return (
      <div>
        <button onClick={this.mountLifeCircle.bind(this)}>Mount</button>
        <button onClick={this.unMountLifeCircle.bind(this)}>Un Mount</button>
      </div>
    );
  }
}

class LifeCircle extends Component {
  constructor() {
    super();
    this.state = {
      val: 0
    }
  }

  update() {
    this.setState({ val : this.state.val + 1})
  }

  componentWillMount() {
    console.log('componentWillMount');
    this.setState({m: 2})
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.inc = setInterval(this.update.bind(this),500);
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    clearInterval(this.inc);
  }

  render() {
    console.log('render');
    return (
      <button onClick={this.update.bind(this)}>{this.state.val * this.state.m}</button>
    );
  }
}

export default App;
