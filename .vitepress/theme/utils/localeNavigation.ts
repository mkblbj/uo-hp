export interface LocaleLinkEvent {
  preventDefault: () => void;
}

export const navigateToLocale = (
  event: LocaleLinkEvent,
  href: string,
  navigate: (target: string) => void = (target) => window.location.assign(target),
) => {
  event.preventDefault();
  navigate(href);
};
