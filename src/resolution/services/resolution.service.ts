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

	// TODO: more work need for this one. need to add order field to each doc and sort by this field
	reorderResolutions(index: { from: number; to: number }): Observable<Task[]> {
		// return this.getResolutions()
		// 	.map((resolutions) => reorder(resolutions, index))
		// 	.switchMap(resolutions => this.setResolutions(resolutions))
	}

	// TODO: update adding mileston. it's reallt just a special case of updating resolution
	addMilestone(id: string, milestone: Task): Observable<Task> {
		return this.getResolution(id)
			.map(resolution => {
				resolution.milestones.push(milestone);
				return resolution;
			})
			.switchMap(resolution => this.updateResolution(resolution));
	}

	removeMilestone(id: string, removedMilestone: Task): Observable<any> {
		return this.getResolution(id)
			.map(resolution => {
				resolution.milestones = resolution.milestones.filter(m => m.id !== removedMilestone.id);
				return resolution;
			})
			.switchMap(resolution => this.updateResolution(resolution));
	}

	updateMilestone(id: string, updatedMilestone: Task): Observable<any> {
		return this.getResolution(id)
			.map(resolution => {
				resolution.milestones = resolution.milestones.map(m => {
					if (m.id === updatedMilestone.id) {
						return updatedMilestone;
					}
					return m;
				});

				return resolution;
			})
			.switchMap(resolution => this.updateResolution(resolution));
	}

	reorderMilestone(id: string, index: { from: number; to: number }): Observable<any> {
		return this.getResolution(id)
			.map(resolution => {
				resolution.milestones = reorder(resolution.milestones, index);

				return resolution;
			})
			.switchMap(resolution => this.updateResolution(resolution));
	}
}
