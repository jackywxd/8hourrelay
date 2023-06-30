import { makeAutoObservable } from "mobx";

class ProfileUiStore {
  active = 0;
  isOpen = false;
  selectedTab = "Profile"; // Default tab

  constructor() {
    makeAutoObservable(this);
  }

  setActive(index: number) {
    this.active = index;
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
