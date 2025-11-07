export class Id {
	readonly id;

	constructor() {
		this.id = crypto.randomUUID();
	}

	get uuid() {
		return this.id;
	}
}

export const uuid = new Id();
