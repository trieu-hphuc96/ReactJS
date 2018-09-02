import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import propTypes from 'prop-types';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      items: [],

      input: '/* add your jsx here */',
      output: '',
      err: '',

      red: 0,
      blue: 0
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

  updateColor(e){
    this.setState({
      red: ReactDOM.findDOMNode(this.refs.red.refs.inp).value,
      blue: ReactDOM.findDOMNode(this.refs.blue.refs.inp).value
    })
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
        <hr></hr>

        <Buttons>
          <button value="A">A</button>
          <button value="B">B</button>
          <button value="C">C</button>
        </Buttons>
        <hr></hr>

        <div>
          <NumInput 
            ref="red" 
            min={0}
            max={255}
            step={0.1}
            val={this.state.red}
            update={this.updateColor.bind(this)}
            label="Red">
          </NumInput>
          <NumInput 
            ref="blue" 
            min={0}
            max={255}
            step={1}
            val={this.state.blue}
            update={this.updateColor.bind(this)}
            label="Blue"
            type="number">
          </NumInput>
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
    React.Children.forEach(this.props.children, child => console.log(child))
    let items = React.Children.map(this.props.children, child => child)
    console.log(items);
    return(
      <label onMouseMove={this.props.update}>
        {this.props.children} - {this.props.count}
      </label>
    )
  }
}

const LabelHOC = HOC(Label)

class Buttons extends Component {
  constructor() {
    super();
    this.state = {selected: 'None'}
  }

  selectItem(selected) {
    this.setState({selected})
  }

  render() {
    let fn = child =>
      React.cloneElement(child, {
        onClick: this.selectItem.bind(this, child.props.value)
      })
    let items = React.Children.map(this.props.children, fn);
    return (
      <div>
        <h2>You have selected: {this.state.selected}</h2>
        {items}
      </div>
    )
  }
}

class NumInput extends Component {
  render() {
    let label = this.props.label !== '' ?
      <label>{this.props.label} - {this.props.val}</label> : ''
    return (
      <div>
        <input ref="inp"
          type={this.props.type}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          defaultValue={this.props.val}
          onChange={this.props.update} />
          {label}
      </div>
    )
  }
}

NumInput.propTypes = {
  min: propTypes.number,
  max: propTypes.number,
  step: propTypes.number,
  val: propTypes.number,
  label: propTypes.string,
  update: propTypes.func.isRequired,
  type: propTypes.oneOf(['number','type'])
}

NumInput.defaultProps = {
  min: 0,
  max: 0,
  step: 1,
  val: 0,
  label: '',
  type: 'range'
}

export default App;
