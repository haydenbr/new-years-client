import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class QuoteService {
	private readonly quoteUrl = `${FUNCTIONS_URL}/quote`;

	constructor(private http: Http) {}

	getRandomQuote(): Observable<string> {
		return this.http
			.get(this.quoteUrl)
			.map(res => res.json())
			.map(body => body.quote);
	}
}
