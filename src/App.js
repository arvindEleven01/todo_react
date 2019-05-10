import React, { Component } from 'react';
import logo from './logo.png';
import Web3 from 'web3'
import './App.css';
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from './config'
import TodoList from './components/TodoList'
 
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      todoListContract: {},
      account: '',
      taskCount: 0,
      tasks: [],
      task: '',
      todo: false,
      todoList: [],
      done: false,
      doneList: [],
    }
  }

  async componentDidMount() {
    const web3 = new Web3(Web3.givenProvider)
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS)
    // console.log(todoList)
    this.setState({todoListContract: todoList})
    const taskCount = await todoList.methods.taskCount().call()
    // console.log(taskCount)
    this.setState({taskCount})
    for(let i = 0; i < parseInt(taskCount); i++) {
      let task = await todoList.methods.tasks(i).call()
      this.setState({
        tasks: [...this.state.tasks, task]
      })
    }
  }

  changeHandler = event => {
    this.setState({
      task: event.target.value
    });
  }

  createTask = async () => {
    await this.state.todoListContract.methods.addTask(this.state.task)
    .send({from: this.state.account})
    .on('transactionHash', hash => { 
      const task = {
        "_id": this.state.taskCount + 1,
        "_task": this.state.task,
        "completed": false
       }
       this.setState({
         tasks: [...this.state.tasks, task]
       })
       this.setState({task: ''})
    })
  }

  checkboxHandler = async event => {
    const i = event.target.value
    console.log(i)
    await this.state.todoListContract.methods.completedTask(i)
    .send({from: this.state.account})
    .on('transactionHash', hash => { 
      const tasks = [...this.state.tasks];
      tasks[i] = { ...tasks[i], completed: !tasks[i].completed };
      this.setState({tasks})
      
    })
  };

  allTasks = async (type) => {
    this.setState({tasks:[]})
    const taskCount = await this.state.todoListContract.methods.taskCount().call()
    this.setState({taskCount})
    for(let i = 0; i < parseInt(taskCount); i++) {
      let task = await this.state.todoListContract.methods.tasks(i).call()
      if(type === 'todo'){
        if(task.completed === false) {
          this.setState({
            tasks: [...this.state.tasks, task]
          })
        }
        this.setState({todo: true})
        this.setState({done: false})
      } 
      else if(type === 'done') {
        if(task.completed === true) {
          this.setState({
            tasks: [...this.state.tasks, task]
          })
        }
        this.setState({done: true})
        this.setState({todo: false})
      }
    }
  }

  // todoTask = () => {
  //   let t = []
  //   const tasks = this.state.tasks;
  //   for(let i in tasks){
  //     if(tasks[i].completed === false) {
  //       t.push(tasks[i])
  //     }
  //   }
  //   this.setState({todoList: t})
  //   this.setState({todo: true})
  //   this.setState({done: false})
  // }

  // doneTask = () => {
  //   let t = []
  //   const tasks = this.state.tasks;
  //   for(let i in tasks){
  //     if(tasks[i].completed === true) {
  //       t.push(tasks[i])
  //     }
  //   }
  //   this.setState({doneList: t})
  //   this.setState({done: true})
  //   this.setState({todo: false})
  // }

  render() {
    let todoListData;
    if(!this.state.todo && !this.state.done){
      todoListData = <TodoList tasks={this.state.tasks} checkboxHandler={this.checkboxHandler}/>
    }
    else if (this.state.todo === true) {
      todoListData = <TodoList tasks={this.state.tasks} checkboxHandler={this.checkboxHandler}/> 
    }
    else if (this.state.done === true) {
      todoListData = <TodoList tasks={this.state.tasks} checkboxHandler={this.checkboxHandler}/> 
    }

    return (
      <div className="form-signin">
        <img className="mb-4 logo" src={logo} alt="" align="center" width="72" height="72" />
        <h1 className="h3 mb-3 font-weight-normal">Todo List</h1>
        
        <input 
          type="text" 
          className="form-control" 
          name="task" 
          value={this.state.task}  
          onChange={this.changeHandler} 
        />

        <button className="btn btn-sm btn-primary btn-block" onClick={this.createTask} type="button">Create To Do</button>
        <button className="btn btn-sm btn-info btn-block todoStyle" onClick={() => { this.allTasks('todo')} }>Pending</button>
        <button className="btn btn-sm btn-success btn-block doneStyle" onClick={() => {this.allTasks('done')} } type="button">Completed</button>
        
        { todoListData }

      </div>
    );
  }
}

export default App;
