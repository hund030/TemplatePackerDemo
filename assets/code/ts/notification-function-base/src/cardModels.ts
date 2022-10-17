/**
 * Adaptive Card data model. Properties can be referenced in an adaptive card via the `${var}`
 * Adaptive Card syntax.
 */
export interface CardData {
  title: string;
  appname: string;
  description: string;
  notificationUrl: string;
}
