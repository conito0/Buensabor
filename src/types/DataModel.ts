export default interface DataModel<T> {
    id: number;
    eliminado: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: T | number | undefined | any[] | string | boolean | any;
}