import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import * as fromActions from '../actions/milestone.actions';
import { Task } from '../resolution/models';
import { ResolutionService } from '../resolution/services';
import { access } from 'fs';

@Injectable()
export class MilestoneEffects {
	constructor(private actions: Actions, private resolutionService: ResolutionService) {}

	@Effect()
	addMilestone: Observable<Action> = this.actions
		.ofType(fromActions.actions.ADD_MILESTONE)
		.map((action: fromActions.AddMilestone) => action.payload)
		.switchMap(payload => {
			let resolution = payload.resolution;
			let milestone = payload.milestone;

			return this.resolutionService
				.addMilestone(resolution, milestone)
				.map(() => new fromActions.AddMilestoneSuccess({ resolutionId: resolution.id, milestone }))
				.catch(error => of(new fromActions.AddMilestoneFail(error)));
		});

	@Effect()
	removeMilestone: Observable<Action> = this.actions
		.ofType(fromActions.actions.REMOVE_MILESTONE)
		.map((action: fromActions.RemoveMilestone) => action.payload)
		.switchMap(payload => {
			let resolution = payload.resolution;
			let milestone = payload.milestone;

			return this.resolutionService
				.removeMilestone(resolution, milestone)
				.map(() => new fromActions.RemoveMilestoneSuccess({ resolutionId: resolution.id, milestone }))
				.catch(error => of(new fromActions.RemoveMilestoneFail(error)));
		});

	@Effect()
	reorderMilestone: Observable<Action> = this.actions
		.ofType(fromActions.actions.REORDER_MILESTONE)
		.map((action: fromActions.ReorderMilestone) => action.payload)
		.switchMap(payload => {
			let resolution = payload.resolution;
			let index = payload.index;

			return this.resolutionService
				.reorderMilestone(resolution, index)
				.map(() => new fromActions.ReorderMilestoneSuccess({ resolutionId: resolution.id, index }))
				.catch(error => of(new fromActions.ReorderMilestoneFail(error)));
		});

	@Effect()
	editMilestone: Observable<Action> = this.actions
		.ofType(fromActions.actions.EDIT_MILESTONE)
		.map((action: fromActions.EditMilestone) => action.payload)
		.switchMap(payload => {
			let resolution = payload.resolution;
			let milestone = payload.milestone;

			return this.resolutionService
				.updateMilestone(payload.resolution, payload.milestone)
				.map(() => new fromActions.EditMilestoneSuccess({ resolutionId: resolution.id, milestone }))
				.catch(error => of(new fromActions.EditMilestoneFail(error)));
		});
}
