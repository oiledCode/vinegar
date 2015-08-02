"use strict";
var TaskQ = function() {
	this.tasks = [];
	this.remainingTask = 0;
};

function createTask(task, params) {
	return {
		taskname: task,
		args: params
	}
};

function executeTask(task) {
	task.taskname.apply(null, task.args)
};

function checkCompleted() {
	if(--this.remainingTask === 0) {
		this.callBack();
	};
}



TaskQ.prototype.registerCallback = function(callBack) {
	this.callBack = callBack;
};

TaskQ.prototype.registerTask = function(task, params) {
	this.remainingTask++;
	this.tasks.push(createTask(task, params));
};

TaskQ.prototype.hasTasks = function() {
	return this.tasks.lenght > 0;
};

TaskQ.prototype.start = function() {
	let tasksLength = this.tasks.length;
	for(let i = 0; i < tasksLength; i++) {
		executeTask.call(this,this.tasks[i]); 
	}
};

TaskQ.prototype.taskCompleted = function(returnVal) {
	if (--this.remainingTask === 0) {
		this.callBack(returnVal);
	}
};

module.exports = TaskQ;





