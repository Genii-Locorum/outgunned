export class OutgunnedActionDie extends foundry.dice.terms.Die {
	constructor(termData) {
		termData.faces = 6;
		super(termData);
	}

	/* -------------------------------------------- */

	/** @override */
	static DENOMINATION = 'a';

	/** @override */
	get total() {
		return this.results.length;
	}

	/* -------------------------------------------- */

	/** @override */
	getResultLabel(result) {
		return {
			1: '1',
			2: '2',
			3: '3',
			4: '4',
			5: '5',
			6: '6',
		}[result.result];
	}
}