import React,{Component} from 'react';
import axios from 'axios';
var ContentEditable = require("react-contenteditable");

class Notes extends Component {
  constructor(props) {
    super(props);
    if(!localStorage.getItem('login')) this.props.history.push('/login')
    this.state = { items: [], text: '' };
    let currentComponent = this;
    axios.post('/getNotes')
    .then(function (response) {
            currentComponent.setState({items:response.data})
        }
    )
    .catch(function (error) {
      console.log(error);
    });    

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeTodo = this.removeTodo.bind(this);
  }
  // removeTodo(e){this.setState(state=>({items:this.state.items.filter(e1=>e1!==e)}));}

  removeTodo(name){
      this.setState({
          items: this.state.items.filter(e => e !== name)
      })
  }
  // <TodoList items={this.state.items} />//sets the property with the state value of the parent
  render() {
    return (
      <div className="bg-payNotes p-5 ">
        <h3 className="text-white">PayNotes</h3>
        <div className="card">
          <div className="card-header">
            <form onSubmit={this.handleSubmit}>
              <label htmlFor="new-todo">
                What needs to be done?
              </label>
              <div className="row ">
                  <div className="mx-auto">
                    <div className="input-group">
                    <input className="input-group-addon"
                      id="new-todo"
                      onChange={this.handleChange}
                      value={this.state.text}
                    />
                    <button className="input-group-addon">
                      Add a New Note
                    </button>
                    </div>
                  </div>
                </div>
            </form>
          </div>
          <div className="card-body"><TodoList items={this.state.items} editNote={this.handleKeyPress}/></div>
          <div className="card-footer text-muted">Click on the Item to Delete</div>
      </div>
      </div>
    );
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleKeyPress=(e)=> {
    if (e.key === 'Enter' && e.ctrlKey) {         
        let currentComponent=this;
        axios.post('/saveEditedNote',{index:e.currentTarget.id,note:e.currentTarget.textContent})
        .then(function (response) {
                currentComponent.setState({items:response.data})
            }
        )
        .catch(function (error) {
          console.log(error);
        });            
    }
  }
  handleSubmit(e) {
    e.preventDefault();//to prevent default action on submit
    if (!this.state.text.length) {return;}
    let currentComponent=this;
    axios.post('/createNote',{note:this.state.text})
    .then(function (response) {
            currentComponent.setState({items:response.data})
        }
    )
    .catch(function (error) {
      console.log(error);
    });    
    
    this.setState(state => ({
      text: ''
    }));
  }
}

const TodoList =(props)=>{
  return (
    <div className="container">
    {props.items.length>0 ? "" :<div className="col-12 m-5 mx-auto">Add Items to your ToDo List</div>}
    <div className="row justify-content-around">
      {props.items.map((item,index) => (
          <div className="notes m-3 col-sm-3">
            <div contentEditable="true" key={index} id={index} onKeyUp={props.editNote} >{item}</div>
          </div>
      ))}
    </div>
    </div>
  );
}

export default Notes;
