import { makeAutoObservable } from "mobx";

class ProfileUiStore {
  isOpen = false;
  selectedTab = "Profile"; // Default tab

  constructor() {
    makeAutoObservable(this);
  }

  toggleNavigation() {
    this.isOpen = !this.isOpen;
  }

  selectTab(tab) {
    this.selectedTab = tab;
  }
}

const profileStore = new ProfileUiStore();
export { profileStore };
