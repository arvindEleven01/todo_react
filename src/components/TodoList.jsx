import React from 'react';

const TodoList = (props) => {
    return(
        props.tasks.map((task, key) => {
            return(
                <div className="taskTemplate mt-3" key={key}>
                    <label>
                    <input 
                        type="checkbox" 
                        value={key}
                        onChange={props.checkboxHandler} 
                    />
                    {
                        task.completed 
                        ? ( <span className="completedTaskList">{task._task}</span> )
                        : ( <span className="content">{task._task}</span> )
                    }
                    </label>
                </div>
            )
        })
    );
};

export default TodoList