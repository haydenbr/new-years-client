import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { Task } from '../models';
import { reorder } from '../../util';

@Injectable()
export class ResolutionService {
	private readonly apiUrl = `${API_URL}/resolution`;

	constructor(private http: Http) {
		this.initData();
	}

	clearResolutions(): Observable<any> {
		return this.http.delete(this.apiUrl).map(() => []);
	}

	initData() {}

	getResolutions(): Observable<Task[]> {
		return this.http.get(this.apiUrl).map(res => res.json());
	}

	getResolution(id: string): Observable<Task> {
		return this.http.get(`${this.apiUrl}/${id}`).map(res => res.json());
	}

	addResolution(resolution: Task): Observable<Task> {
		return this.http.post(this.apiUrl, resolution).map(res => res.json());
	}

	removeResolution(removedTask: Task): Observable<Task> {
		return this.http.delete(`${this.apiUrl}/${removedTask.id}`).map(() => removedTask);
	}

	updateResolution(updatedTask: Task): Observable<Task> {
		return this.http.put(`${this.apiUrl}/${updatedTask.id}`, updatedTask).map(res => res.json());
	}

	reorderResolutions(reorderedResolutionIds: string[], index: { from: number; to: number }): Observable<any> {
		let reorderPayload = reorderedResolutionIds
			.slice(index.from, index.to + 1)
			.map((id, index) => Object.assign({ id, order: index + 1 }));

		return this.http.post(`${this.apiUrl}/reorder`, { reorder: reorderPayload }).map(res => res.json());
	}

	addMilestone(resolution: Task, milestone: Task): Observable<Task> {
		resolution.milestones.push(milestone);

		return this.updateResolution(resolution);
	}

	removeMilestone(resolution: Task, removedMilestone: Task): Observable<Task> {
		resolution.milestones = resolution.milestones.filter(m => m.id !== removedMilestone.id);

		return this.updateResolution(resolution);
	}

	updateMilestone(resolution: Task, updatedMilestone: Task): Observable<Task> {
		resolution.milestones = resolution.milestones.map(m => (m.id === updatedMilestone.id ? updatedMilestone : m));

		return this.updateResolution(resolution);
	}

	reorderMilestone(resolution: Task, index: { from: number; to: number }): Observable<any> {
		resolution.milestones = reorder(resolution.milestones, index);

		return this.updateResolution(resolution);
	}
}
