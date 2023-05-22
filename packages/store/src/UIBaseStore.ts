import { makeObservable, observable, action } from "mobx";

export class BaseStore {
  error: string | null = null;
  isLoading = false;

  constructor() {
    makeObservable(this, {
      error: observable,
      isLoading: observable,
      setError: action,
      setLoading: action,
      reset: action,
    });
  }

  setError(error: string | null) {
    this.error = error;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  reset() {
    this.error = null;
    this.isLoading = false;
  }
}
