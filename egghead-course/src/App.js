import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      items: [],
      input: '/* add your jsx here */',
      output: '',
      err: '',
    }
  }

  componentWillMount() {
    fetch('https://swapi.co/api/people/?format=json')
      .then(response => response.json())
      .then(({ results: items }) => this.setState({ items }))
  }

  mountLifeCircle() {
    ReactDOM.render(<LifeCircle />, document.getElementById('lifeCircle'));
  }

  unMountLifeCircle() {
    ReactDOM.unmountComponentAtNode(document.getElementById('lifeCircle'));
  }

  filter(e) {
    this.setState({ filter: e.target.value })
  }

  updateOutput(e){
    let code = e.target.value;
    try {
      this.setState({
        output: window.Babel
        .transform(code, {presets: ['es2015','react']})
        .code,
        err: ''
      })
    } catch (error) {
      this.setState({err: error.message})
    }
  }

  render() {
    let items = this.state.items;
    if (this.state.filter) {
      items = items.filter(item =>
        item.name.toLowerCase()
          .includes(this.state.filter.toLowerCase()))
    }
    return (
      <div>
        <input type="text" onChange={this.filter.bind(this)}></input>
        {items.map(item =>
          <Person key={item.name} person={item}></Person>)}
        <hr></hr>

        <div>
          <header>{this.state.err}</header>
          <div className="container">
          <textarea
          onChange={this.updateOutput.bind(this)}
          defaultValue={this.state.input}></textarea>
          <pre>
            {this.state.output}
          </pre>
          </div>
        </div>
        <hr></hr>

        <div>
          <Button>button</Button>
          <hr></hr>
          <LabelHOC>label</LabelHOC>
        </div>

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
      increasing: false
    }
  }

  update() {
    ReactDOM.render(
      <LifeCircle val={this.props.val +1} />,
      document.getElementById('lifeCircle')
    )
  }

  componentWillMount() {
    console.log('componentWillMount');
    // For lesson 12 this.setState({ m: 2 })
  }

  componentDidMount() {
    console.log('componentDidMount');
    // For lesson 12 this.inc = setInterval(this.update.bind(this), 500);
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    // For lesson 12 clearInterval(this.inc);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({increasing: nextProps.val > this.props.val})
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.val % 5 === 0;
  }

  render() {
    console.log('render');
    console.log(this.state.increasing);
    return (
      <button onClick={this.update.bind(this)}>{this.props.val}</button>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(`preveProps: ${prevProps.val}`);
  }
}

LifeCircle.defaultProps = {val: 0};

const Person = (props) => <h4>{props.person.name}</h4>

const HOC = (InnerComponent) => class extends Component {
  constructor(){
    super();
    this.state = {
      count: 0
    };
  }

  componentWillMount(){
    console.log('HOC will mount');
  }

  updateCount(){
    this.setState({count: this.state.count + 1})
  }

  render() {
    return (
      <InnerComponent
      {...this.props}
      {...this.state}
      update={this.updateCount.bind(this)}
      />
    )
  }
}

const Button = HOC((props) => <button onClick={props.update}>{props.children} - {props.count}</button>)

class Label extends Component {
  componentWillMount(){
    console.log('label will mount');
  }
  render() {
    return(
      <label onMouseMove={this.props.update}>
        {this.props.children} - {this.props.count}
      </label>
    )
  }
}

const LabelHOC = HOC(Label)

export default App;
