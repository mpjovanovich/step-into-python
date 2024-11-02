export interface Exercise {
  course: string;
  title: string;
  descriptions: Record<number, string>;
  instructions: Record<number, string>;
  template: string;
}
