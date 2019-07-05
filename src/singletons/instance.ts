export class Instance {

    private constructor() {}

    private static instance: {value: string, counter: number};

    public static getInstance(): {value: string, counter: number} {
        if (!this.instance) {
            this.instance = this.setInstance();
            return this.instance;
        } else {
            return this.instance;
        }
    };

    public static setInstance(value?: string): {value: string, counter: number} {
        if (!this.instance) {
            this.instance = this.createInstance(value);
            return this.instance;
        } else {
            return this.instance;
        }
    };

    private static createInstance(value?: string): {value: string, counter: number} {
        return {value: value ? value : 'NO VALUE WAS SET. Please call the setInstance BEFORE the getInstance', counter: this.instance ? this.instance.counter + 1 : 1};
    };
}