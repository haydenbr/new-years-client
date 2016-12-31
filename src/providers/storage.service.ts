import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import * as uuid from 'uuid';

import { Task } from '../models';
import { reorder } from '../util';

@Injectable()
export class StorageService {
	private readonly TASKS: string = 'tasks';
	// private readonly SETTINGS: string = 'settings';

	constructor(private storage: Storage) {
		this.initData();
		// this.killSwitch();
	}

	// for debugging purposes when local storage gets crapped up
	killSwitch() {
		this.storage.set(this.TASKS, []);
	}

	initData() {
		this.getTasks().then((tasks) => {
			if (!tasks) {
				this.setTasks([]);
			}
		});
	}

	getTasks(): Promise<Task[]> {
		return this.storage.get(this.TASKS);
	}

	setTasks(tasks): Promise<any> {
		return this.storage.set(this.TASKS, tasks);
	}

	addTask(task): Promise<Task> {
		task.id = uuid.v4();
		return this.getTasks()
			.then((tasks) => {
				return tasks.concat(task);
			})
			.then(this.updateTasks)
			.then(() => { return task; });
	}

	removeTask(removedTask): Promise<Task[]> {
		return this.getTasks()
			.then((tasks) => {
				return tasks.filter(task => task.id !== removedTask.id);
			})
			.then(this.updateTasks)
			.then(() => { return removedTask; });
	}

	updateTask(updatedTask): Promise<Task> {
		return this.getTasks()
			.then((tasks) => {
				let idx = tasks.findIndex(task => task.id === updatedTask.id);
				return [ ...tasks.slice(0, idx), updatedTask, ...tasks.slice(idx+1) ];
			})
			.then(this.updateTasks)
			.then(() => { return updatedTask; });
	}

	reorderTasks(index: { from: number, to: number }): Promise<Task[]> {
		return this.getTasks().then((tasks) => {
			return reorder(tasks, index);
		})
		.then(this.updateTasks)
	}

	addMilestone(taskId: string, milestone: Task): Promise<Task> {
		milestone.id = uuid.v4();
		return this.getTasks().then((tasks: Task[]) => {
			let task = tasks.find((t) => { return t.id === taskId });
			task.milestones.push(milestone);
			return task;
		})
		.then(this.updateTask);
	}

	removeMilestone(taskId: string, removedMilestone: Task) {
		return this.getTasks().then((tasks: Task[]) => {
			let task = tasks.find((t) => { return t.id === taskId });
			task.milestones = task.milestones.filter((m) => { return m.id !== removedMilestone.id })
			return task;
		})
		.then(this.updateTask);
	}

	updateMilestone(taskId: string, updatedMilestone: Task) {
		return this.getTasks().then((tasks: Task[]) => {
			let task = tasks.find((t) => { return t.id === taskId });
			task.milestones = task.milestones.map((m) => {
				if (m.id === updatedMilestone.id) {
					return updatedMilestone;
				}
				return m;
			});
			return task;
		})
		.then(this.updateTask);
	}

	reorderMilestone(taskId: string, index: { from: number, to: number }) {
		return this.getTasks().then((tasks: Task[]) => {
			let task = tasks.find((t) => { return t.id === taskId });
			task.milestones = reorder(task.milestones, index);
		})
		.then(this.updateTask);
	}

	private updateTasks = (tasks): Promise<Task[]> => {
		return this.setTasks(tasks).then(() => tasks);
	}
}