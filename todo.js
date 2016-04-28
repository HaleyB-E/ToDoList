/*
 * Changes from original todo files:
 *      -Added bootstrap: it makes things look prettier and plays well with jQuery
 *      -Modified code to take advantage of jQuery functions - they're more compact and I find them more intuitive
 *      -Added "new task" entry box next to add-toplevel-task button so users can type task before it gets added to the list
 *      -Changed "completed" checkbox to a toggleable button that turns green when the task is complete
 */

//useful functions

/*
 * Finds the nearest element in the document whose subtree represents a task
 * and that encloses a given HTML element.  When called on an element
 * representing subtask, finds the task that it's an immediate subtask of.
 * @param {HTMLElement} element - The element whose corresponding task is
 *   sought.
 * @returns {?HTMLElement} The element whose subtree represents the enclosing
 *   task, or null if the given element is not part of a task subtree.
 */
var enclosing_task = function enclosing_task(element){
    if ($(element).hasClass("subtask")){
        toReturn = $(element).parent().parent('.task');
    }
    else {
        toReturn = $(element).parent('.task');
    }
    //if we are trying to look at something that isn't a task, we should return null
    if (toReturn.length == 0){
        return null;
    }
    //toReturn is a jQuery object of length 1 so we must return the first element to get HTMLElement
    return toReturn[0];
};

  /*
   * Unchecks the boxes for all of this task's direct ancestors.
   * @param {HTMLElement} task - The task whose ancestors are to be unchecked.
   */
var uncheck_enclosing_tasks = function uncheck_enclosing_tasks(task){
    while (task !== null){
        completedParentTask = $(task).children('.btn-success');
        uncheck_tasks(completedParentTask);
        task = enclosing_task(task);
    }
}

/*
 * both uncheck_tasks and check_tasks are
 * useful functions for marking all completion buttons in a jQuery object automatically
 * don't use this for when the user is toggling completion - that's what the event watcher below is for
 * @param {jQuery object} tasks - the tasks to be marked as complete or incomplete
 */
var uncheck_tasks = function uncheck_task(tasks){
    tasks.removeClass('btn-success');
    tasks.text('Click when completed');
}
var check_tasks = function check_task(tasks){
    tasks.addClass('btn-success');
    tasks.text('Task complete!');
}

//blank task that can be cloned to create new tasks
var task_template = $('.task').clone();


//button behaviors

//ADD NEW TASK: handles top-level add button, which creates a new top-level task with the text from top entry box
$(document).on('click','.add-toplevel-task',function(event){
    var newTask = task_template.clone();
    newTask.children('.task-text').val($('.new-task-contents').val())
    $('.toplevel-tasks').append(newTask);
    $('.new-task-contents').val('');
});

//DELETE TASK: removes the task it's enclosed by
$(document).on('click','.delete-task',function(event){
    var task_to_remove = enclosing_task(event.target);
    task_to_remove.parentElement.removeChild(task_to_remove);
});

/*
 * ADD SUBTASK: A non-top-level add button that creates a new task and appends it to subtasks list of
 * the task that encloses it. Since new task will initially be unchecked, enclosing task and
 * its ancestors must be unchecked too
 */
$(document).on('click','.add-subtask',function(event){
    var newTask = task_template.clone();
    newTask.addClass('subtask');
    $(enclosing_task(event.target)).children('.subtasks').append(newTask);
    uncheck_enclosing_tasks(event.target);
});

//TASK COMPLETED: toggle between complete and incomplete states
$(document).on('click','.task-completed',function(event){
    $(event.target).toggleClass('btn-success');
    if ($(event.target).hasClass('btn-success')){
        $(event.target).text('Task complete!');
        //if the task has just been completed, its subtasks must also be complete
        completedSubtasks = $(enclosing_task(event.target)).find('.task-completed');
        check_tasks(completedSubtasks);
    }
    else{
        $(event.target).text('Click when completed');
        //if the task has been marked incomplete, its parent tasks must also be incomplete 
        uncheck_enclosing_tasks(event.target);
    }
});


$(document).ready(function(){
    //turn on tooltip for new task button
    $('.add-toplevel-task').tooltip();
});