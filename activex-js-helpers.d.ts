interface ActiveXObject {
    /** Register an event handler with the passed-in object, for the specified event */
    on<T>(obj: T, eventName: string, handler: (this: T, parameter: object) => void): void;

    /** Register an event handler with the passed-in object, for the specified event; 
     * specifying the parameters on the object passed into the handler */
    on<T, K extends string = never>(obj: T, eventName: string, parameterNames: K[], handler: (this: T, parameter: Record<K, any>) => void): void;

    /** Unregister all handlers, all handlers on a specific object, all handlers for a specific object's events, or a specific handler */
    off(obj?: any, eventName?: string, handler?: Function): void;

    hasRegisteredObjects(): boolean;

    /** Call a parameterized setter on a given object with the specified parameters and the new value */
    set(obj: any, propertyName: string, parameters: any[], newValue: any): void;
}